from enum import Enum
from generators.Descriptor import Descriptor

class TypeDescriptorType(Enum):
    Byte = 'byte'
    Struct = 'struct'
    Enum = 'enum'


class TypeDescriptorDisposition(Enum):
    Inline = 'inline'
    Const = 'const'


def indent(code, n_indents=1):
    return ' ' * 4 * n_indents + code


class JavaScriptMethodGenerator:
    def __init__(self, signature, params=[], static=False):
        self.signature = signature
        if static:
            self.method_output = ['static {}({}) {{'.format(self.signature, ', '.join(params))]
        else:
            self.method_output = ['{} = ({}) => {{'.format(self.signature, ', '.join(params))]

    def add_instructions(self, instructions):
        for instruction in instructions:
            self.method_output.append(indent(instruction))

    def get_method(self):
        return self.method_output + ['}']


class JavaScriptClassGenerator:
    @staticmethod
    def get_generated_class_signature(signature):
        return '{}Buffer'.format(signature)

    @staticmethod
    def get_generated_getter_signature(attribute):
        return 'get{}'.format(attribute.capitalize())

    @staticmethod
    def get_generated_setter_signature(attribute):
        return 'set{}'.format(attribute.capitalize())

    def __init__(self, signature):
        self.class_signature = JavaScriptClassGenerator.get_generated_class_signature(signature)
        self.class_output = ['class {} {{'.format(self.class_signature)]

    def add_constructor(self, initial_values, params=[]):
        new_constructor = [indent('constructor({}) {{'.format(', '.join(params)))]
        for attribute, value in initial_values.items():
            new_constructor += [indent('this.{} = {}'.format(attribute, value), 2)]
        self.class_output += new_constructor + [indent('}'), '']

    def _add_getter(self, attribute):
        new_getter = JavaScriptMethodGenerator(JavaScriptClassGenerator.get_generated_getter_signature(attribute), [attribute])
        new_getter.add_instructions(['return this.{0}'.format(attribute)])
        self.add_method(new_getter)

    def _add_setter(self, attribute):
        new_setter = JavaScriptMethodGenerator(JavaScriptClassGenerator.get_generated_setter_signature(attribute), [attribute])
        new_setter.add_instructions(['this.{0} = {0}'.format(attribute)])
        self.add_method(new_setter)

    def add_getter_setter(self, attribute):
        self._add_getter(attribute)
        self._add_setter(attribute)

    def add_method(self, method):
        self.class_output += [indent(line) for line in method.get_method()] + ['']

    def get_class(self):
        return self.class_output + ['}']


class JavaScriptGenerator:
    def __init__(self, schema):
        self.schema = schema

    def __iter__(self):
        self.generated = False
        return self

    def __next__(self):
        if self.generated:
            raise StopIteration

        code = self.generate()
        self.generated = True
        return Descriptor('catbuffer_generated_output.js', code)

    def _get_type_size(self, attribute):
        if attribute['type'] != 'byte':
            return self.schema[attribute['type']]['size']
        return attribute['size']

    def _get_attribute_name_if_sizeof(self, attribute_name, attributes):
        for attribute in attributes:
            if 'size' in attribute and attribute['size'] == attribute_name:
                return attribute['name']

    def _generate_load_from_binary_attributes(self, attributes):
        context = {}  # Stores meta size information for dynamic length attributes
        for attribute in attributes:
            if 'disposition' in attribute:
                if attribute['disposition'] == TypeDescriptorDisposition.Inline.value:
                    self._generate_load_from_binary_attributes(self.schema[attribute['type']]['layout'])
                elif attribute['disposition'] == TypeDescriptorDisposition.Const.value:
                    self.load_from_binary_method.add_instructions(['var {0} = consumableBuffer.get_bytes({1})'.format(attribute['name'], self._get_type_size(attribute))])
                    self.load_from_binary_method.add_instructions(['object.{0} = {0}'.format(attribute['name'])])
            else:
                sizeof_attribute_name = self._get_attribute_name_if_sizeof(attribute['name'], attributes)
                if sizeof_attribute_name is not None:
                    self.load_from_binary_method.add_instructions(['var {0} = buffer_to_int(consumableBuffer.get_bytes({1}))'.format(attribute['name'], attribute['size'])])
                    context[attribute['name']] = attribute['size']
                else:
                    if attribute['type'] == TypeDescriptorType.Byte.value:
                        if isinstance(attribute['size'], int):
                            self.load_from_binary_method.add_instructions(['var {0} = consumableBuffer.get_bytes({1})'.format(attribute['name'], self._get_type_size(attribute))])
                            self.load_from_binary_method.add_instructions(['object.{0} = {0}'.format(attribute['name'])])
                        else:
                            self.load_from_binary_method.add_instructions(['var {} = []'.format(attribute['name'])])
                            self.load_from_binary_method.add_instructions(['for (i = 0; i < {0}; i++) {{'.format(attribute['size'])])
                            self.load_from_binary_method.add_instructions([indent('{0}.push(consumableBuffer.get_bytes({1}))'.format(attribute['name'], context[attribute['size']]))])
                            self.load_from_binary_method.add_instructions(['}', 'object.{0} = {0}'.format(attribute['name'])])

                    # Struct object
                    else:
                        # Required to check if typedef or struct definition (depends if type of typedescriptor is Struct or Byte)
                        attribute_typedescriptor = self.schema[attribute['type']]

                        # Array of objects
                        if 'size' in attribute:
                            # No need to check if attribute['size'] is int (fixed) or a variable reference, because attribute['size'] will either be a number or a previously code generated reference
                            self.load_from_binary_method.add_instructions(['object.{} = []'.format(attribute['name'])])
                            self.load_from_binary_method.add_instructions(['for (i = 0; i < {}; i++) {{'.format(attribute['size'])])
                            if attribute_typedescriptor['type'] == TypeDescriptorType.Struct.value:
                                self.load_from_binary_method.add_instructions([indent('var new{0} = {1}.loadFromBinary(consumableBuffer)'.format(attribute['name'], JavaScriptClassGenerator.get_generated_class_signature(attribute['type'])))])
                            elif attribute_typedescriptor['type'] == TypeDescriptorType.Byte.value:
                                self.load_from_binary_method.add_instructions([indent('var new{0} = consumableBuffer.get_bytes({1})'.format(attribute['name'], self._get_type_size(attribute_typedescriptor)))])
                            self.load_from_binary_method.add_instructions([indent('object.{0}.push(new{0})'.format(attribute['name']))])
                            self.load_from_binary_method.add_instructions(['}'])

                        # Single object
                        else:
                            if attribute_typedescriptor['type'] == TypeDescriptorType.Struct.value:
                                self.load_from_binary_method.add_instructions(['var {0} = {1}.loadFromBinary(consumableBuffer)'.format(attribute['name'], JavaScriptClassGenerator.get_generated_class_signature(attribute['type']))])
                            elif attribute_typedescriptor['type'] == TypeDescriptorType.Byte.value:
                                self.load_from_binary_method.add_instructions(['var {0} = consumableBuffer.get_bytes({1})'.format(attribute['name'], self._get_type_size(attribute_typedescriptor))])
                            self.load_from_binary_method.add_instructions(['object.{0} = {0}'.format(attribute['name'])])

    def _generate_load_from_binary_method(self, attributes):
        self.load_from_binary_method = JavaScriptMethodGenerator('loadFromBinary', ['consumableBuffer'], True)
        self.load_from_binary_method.add_instructions(['var object = new {}()'.format(self.new_class.class_signature)])
        self._generate_load_from_binary_attributes(attributes)
        self.load_from_binary_method.add_instructions(['return object'])
        self.new_class.add_method(self.load_from_binary_method)

    def _generate_serialize_attributes(self, attributes):
        for attribute in attributes:
            if 'disposition' in attribute:
                if attribute['disposition'] == TypeDescriptorDisposition.Inline.value:
                    self._generate_serialize_attributes(self.schema[attribute['type']]['layout'])
                elif attribute['disposition'] == TypeDescriptorDisposition.Const.value:
                    self.serialize_method.add_instructions(['var fitArray{0} = fit_bytearray(this.{0}, {1})'.format(attribute['name'], self._get_type_size(attribute))])
                    self.serialize_method.add_instructions(['newArray = concat_typedarrays(newArray, fitArray{})'.format(attribute['name'])])
            else:
                sizeof_attribute_name = self._get_attribute_name_if_sizeof(attribute['name'], attributes)
                if sizeof_attribute_name is not None:
                    self.serialize_method.add_instructions(['newArray = concat_typedarrays(newArray, new Uint8Array([this.{}.length]))'.format(sizeof_attribute_name)])
                else:
                    if attribute['type'] == TypeDescriptorType.Byte.value:
                        if isinstance(attribute['size'], int):
                            self.serialize_method.add_instructions(['var fitArray{0} = fit_bytearray(this.{0}, {1})'.format(attribute['name'], self._get_type_size(attribute))])
                            self.serialize_method.add_instructions(['newArray = concat_typedarrays(newArray, fitArray{})'.format(attribute['name'])])
                        else:
                            self.serialize_method.add_instructions(['for (element in this.{}) {{'.format(attribute['name'])])
                            self.serialize_method.add_instructions([indent('newArray = concat_typedarrays(newArray, element)')])
                            self.serialize_method.add_instructions(['}'])

                    # Struct object
                    else:
                        # Required to check if typedef or struct definition (depends if type of typedescriptor is Struct or Byte)
                        attribute_typedescriptor = self.schema[attribute['type']]

                        # Array of objects
                        if 'size' in attribute:
                            # No need to check if attribute['size'] is int (fixed) or a variable reference, because we iterate with a for util in both cases
                            self.serialize_method.add_instructions(['for (element in this.{}) {{'.format(attribute['name'])])
                            if attribute_typedescriptor['type'] == TypeDescriptorType.Struct.value:
                                self.serialize_method.add_instructions([indent('newArray = concat_typedarrays(newArray, element.serialize())')])
                            elif attribute_typedescriptor['type'] == TypeDescriptorType.Byte.value:
                                self.serialize_method.add_instructions([indent('var fitArray{0} = fit_bytearray(this.{0}, {1})'.format(attribute['name'], self._get_type_size(attribute_typedescriptor)))])
                                self.serialize_method.add_instructions([indent('newArray = concat_typedarrays(newArray, fitArray{})'.format(attribute['name']))])
                            self.serialize_method.add_instructions(['}'])

                        # Single object
                        else:
                            if attribute_typedescriptor['type'] == TypeDescriptorType.Struct.value:
                                self.serialize_method.add_instructions(['newArray = concat_typedarrays(newArray, this.{}.serialize())'.format(attribute['name'])])
                            elif attribute_typedescriptor['type'] == TypeDescriptorType.Byte.value:
                                self.serialize_method.add_instructions(['var fitArray{0} = fit_bytearray(this.{0}, {1})'.format(attribute['name'], self._get_type_size(attribute_typedescriptor))])
                                self.serialize_method.add_instructions(['newArray = concat_typedarrays(newArray, fitArray{})'.format(attribute['name'])])

    def _generate_serialize_method(self, attributes):
        self.serialize_method = JavaScriptMethodGenerator('serialize')
        self.serialize_method.add_instructions(['var newArray = new Uint8Array()'])
        self._generate_serialize_attributes(attributes)
        self.serialize_method.add_instructions(['return newArray'])
        self.new_class.add_method(self.serialize_method)

    def _generate_attributes(self, attributes):
        for attribute in attributes:
            if 'disposition' in attribute:
                if attribute['disposition'] == TypeDescriptorDisposition.Inline.value:
                    self._generate_attributes(self.schema[attribute['type']]['layout'])
                elif attribute['disposition'] == TypeDescriptorDisposition.Const.value:
                    self.constructor_initial_values[attribute['name']] = attribute['value']
                    if self._get_attribute_name_if_sizeof(attribute['name'], attributes) is None:
                        self.new_class.add_getter_setter(attribute['name'])
            else:
                if self._get_attribute_name_if_sizeof(attribute['name'], attributes) is None:
                    self.new_class.add_getter_setter(attribute['name'])

    def _generate_struct(self, type_descriptor, struct):
        self.new_class = JavaScriptClassGenerator(type_descriptor)
        self.exports.append(self.new_class.class_signature)
        self.constructor_initial_values = {}
        self._generate_attributes(struct['layout'])
        if self.constructor_initial_values:
            self.new_class.add_constructor(self.constructor_initial_values)
        self._generate_load_from_binary_method(struct['layout'])
        self._generate_serialize_method(struct['layout'])
        return self.new_class.get_class()

    def _gengerate_concat_typedarrays(self):
        method = JavaScriptMethodGenerator('concat_typedarrays', ['array1', 'array2'])
        self.exports.append(method.signature)
        method.add_instructions([
            'var newArray = new Uint8Array(array1.length + array2.length)',
            'newArray.set(array1)',
            'newArray.set(array2, array1.length)',
            'return newArray',
        ])
        return method.get_method()

    def _gengerate_buffer_to_uint(self):
        method = JavaScriptMethodGenerator('buffer_to_uint', ['buffer'])
        self.exports.append(method.signature)
        method.add_instructions([
            'var dataView = new DataView(buffer)',
            'if (dataView.byteLength == 1)',
            indent('return dataView.getUint8(0)'),
            'if (dataView.byteLength == 2)',
            indent('return dataView.getUint16(0)'),
            'if (dataView.byteLength == 4)',
            indent('return dataView.getUint32(0)'),
        ])
        return method.get_method()

    def _gengerate_fit_bytearray(self):
        method = JavaScriptMethodGenerator('fit_bytearray', ['array', 'size'])
        self.exports.append(method.signature)
        method.add_instructions([
            'if (array == null) {',
            indent('var newArray = new Uint8Array(size)'),
            indent('newArray.fill(0)'),
            indent('return newArray'),
            '}',
            'if (array.length > size) {',
            indent('throw new RangeError("Data size larger than allowed")'),
            '}',
            'else if (array.length < size) {',
            indent('var newArray = new Uint8Array(size)'),
            indent('newArray.fill(0)'),
            indent('newArray.set(array, size - array.length)'),
            indent('return newArray'),
            '}',
            'return array',
        ])
        return method.get_method()

    def _generate_Uint8Array_consumer(self):
        self.consumer_class = JavaScriptClassGenerator('Uint8ArrayConsumable')
        self.consumer_class.add_constructor({'offset': 0, 'binary': 'binary'}, ['binary'])
        self.exports.append(self.consumer_class.class_signature)

        get_bytes_method = JavaScriptMethodGenerator('get_bytes', ['count'])
        get_bytes_method.add_instructions([
            'if (count + this.offset > this.binary.length)',
            indent('throw new RangeError()'),
            'var bytes = this.binary.slice(this.offset, this.offset + count)',
            'this.offset += count',
            'return bytes',
        ])
        self.consumer_class.add_method(get_bytes_method)

        return self.consumer_class.get_class()

    def _generate_module_exports(self):
        return ['module.exports = {'] + [indent(export + ',') for export in self.exports] + ['};']

    def generate(self):
        self.exports = []

        new_file = ['/*** File automatically generated by Catbuffer ***/', '']

        new_file += self._gengerate_concat_typedarrays() + ['']
        new_file += self._gengerate_fit_bytearray() + ['']
        new_file += self._generate_Uint8Array_consumer() + ['']
        new_file += self._gengerate_buffer_to_uint() + ['']

        for type_descriptor, value in self.schema.items():
            if value['type'] == TypeDescriptorType.Byte.value:
                # Typeless environment, values will be directly assigned
                pass
            elif value['type'] == TypeDescriptorType.Enum.value:
                # Using the constant directly, so enum definition unneeded
                pass
            elif value['type'] == TypeDescriptorType.Struct.value:
                new_file += self._generate_struct(type_descriptor, value) + ['']

        new_file += self._generate_module_exports() + ['']

        return new_file
