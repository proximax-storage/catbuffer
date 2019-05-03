from .JavaScriptBlockGenerator import BlockType, JavaScriptBlockGenerator
from .JavaScriptClassGenerator import JavaScriptClassGenerator
from .JavaScriptFunctionGenerator import FunctionType, JavaScriptFunctionGenerator
from .JavaScriptUtils import indent


from enum import Enum
from generators.Descriptor import Descriptor


class TypeDescriptorType(Enum):
    Byte = 'byte'
    Struct = 'struct'
    Enum = 'enum'


class TypeDescriptorDisposition(Enum):
    Inline = 'inline'
    Const = 'const'


def _get_attribute_name_if_sizeof(attribute_name, attributes):
    for attribute in attributes:
        if 'size' in attribute and attribute['size'] == attribute_name:
            return attribute['name']
    return None


class JavaScriptGenerator:
    def __init__(self, schema, options):
        self.schema = schema
        self.generated = None
        self.new_class = None
        self.load_from_binary_function = None
        self.serialize_function = None
        self.consumer_class = None
        self.exports = None

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
        if attribute['type'] != TypeDescriptorType.Byte.value and attribute['type'] != TypeDescriptorType.Enum.value:
            return self.schema[attribute['type']]['size']
        return attribute['size']

    def _recurse_inlines(self, generate_attribute_function, attributes):
        for attribute in attributes:
            if 'disposition' in attribute:
                if attribute['disposition'] == TypeDescriptorDisposition.Inline.value:
                    self._recurse_inlines(generate_attribute_function, self.schema[attribute['type']]['layout'])
                elif attribute['disposition'] == TypeDescriptorDisposition.Const.value:
                    pass
            else:
                generate_attribute_function(attribute, _get_attribute_name_if_sizeof(attribute['name'], attributes))

    def _generate_load_from_binary_attributes(self, attribute, sizeof_attribute_name):
        block = JavaScriptBlockGenerator()

        if sizeof_attribute_name is not None:
            block.add_instructions([
                'var {0} = buffer_to_uint(consumableBuffer.get_bytes({1}))'.format(attribute['name'], attribute['size'])
            ])
        else:
            if attribute['type'] == TypeDescriptorType.Byte.value:
                block.add_instructions([
                    'var {0} = consumableBuffer.get_bytes({1})'.format(attribute['name'], self._get_type_size(attribute))
                ])
                block.add_instructions(['object.{0} = {0}'.format(attribute['name'])])

            # Struct object
            else:
                # Required to check if typedef or struct definition (depends if type of typedescriptor is Struct or Byte)
                attribute_typedescriptor = self.schema[attribute['type']]

                # Array of objects
                if 'size' in attribute:
                    # No need to check if attribute['size'] is int (fixed) or a variable reference,
                    # because attribute['size'] will either be a number or a previously code generated reference
                    block.add_instructions(['object.{} = []'.format(attribute['name'])])
                    for_block = JavaScriptBlockGenerator()
                    for_block.wrap(BlockType.FOR, '< {}'.format(attribute['size']), 'i')
                    if attribute_typedescriptor['type'] == TypeDescriptorType.Struct.value:
                        for_block.add_instructions(
                            ['var new{0} = {1}.loadFromBinary(consumableBuffer)'.format(
                                attribute['name'], JavaScriptClassGenerator.get_generated_class_name(attribute['type'])
                            )]
                        )
                    elif attribute_typedescriptor['type'] == TypeDescriptorType.Enum.value:
                        for_block.add_instructions(
                            ['var new{0} = consumableBuffer.get_bytes({1})'.format(
                                attribute['name'], self._get_type_size(attribute_typedescriptor)
                            )]
                        )
                    for_block.add_instructions(['object.{0}.push(new{0})'.format(attribute['name'])])
                    block.add_block(for_block)

                # Single object
                else:
                    if attribute_typedescriptor['type'] == TypeDescriptorType.Struct.value:
                        block.add_instructions([
                            'var {0} = {1}.loadFromBinary(consumableBuffer)'.format(
                                attribute['name'], JavaScriptClassGenerator.get_generated_class_name(attribute['type'])
                            )
                        ])
                    elif (
                            attribute_typedescriptor['type'] == TypeDescriptorType.Byte.value
                            or attribute_typedescriptor['type'] == TypeDescriptorType.Enum.value
                    ):
                        block.add_instructions([
                            'var {0} = consumableBuffer.get_bytes({1})'.format(
                                attribute['name'], self._get_type_size(attribute_typedescriptor)
                            )
                        ])
                    block.add_instructions(['object.{0} = {0}'.format(attribute['name'])])

        if 'condition' in attribute:
            block.wrap(BlockType.IF, '{0} === \'{1}\''.format(attribute['condition'], attribute['condition_value']))

        self.load_from_binary_function.add_instructions(block.get_instructions())

    def _generate_load_from_binary_function(self, attributes):
        self.load_from_binary_function = JavaScriptFunctionGenerator(FunctionType.STATIC)
        self.load_from_binary_function.set_name('loadFromBinary')
        self.load_from_binary_function.set_params(['consumableBuffer'])
        self.load_from_binary_function.add_instructions(['var object = new {}()'.format(self.new_class.class_name)])
        self._recurse_inlines(self._generate_load_from_binary_attributes, attributes)
        self.load_from_binary_function.add_instructions(['return object'])
        self.new_class.add_function(self.load_from_binary_function)

    def _generate_serialize_attributes(self, attribute, sizeof_attribute_name):
        if sizeof_attribute_name is not None:
            self.serialize_function.add_instructions([
                'newArray = concat_typedarrays(newArray, uint_to_buffer(this.{0}.length, {1}))'.format(
                    sizeof_attribute_name, attribute['size']
                )
            ])
        else:
            if attribute['type'] == TypeDescriptorType.Byte.value:
                if isinstance(attribute['size'], int):
                    self.serialize_function.add_instructions([
                        'var fitArray{0} = fit_bytearray(this.{0}, {1})'.format(attribute['name'], self._get_type_size(attribute))
                    ])
                    self.serialize_function.add_instructions([
                        'newArray = concat_typedarrays(newArray, fitArray{})'.format(attribute['name'])
                    ])
                else:
                    self.serialize_function.add_instructions(['newArray = concat_typedarrays(newArray, this.{})'.format(attribute['name'])])

            # Struct object
            else:
                # Required to check if typedef or struct definition (depends if type of typedescriptor is Struct or Byte)
                attribute_typedescriptor = self.schema[attribute['type']]

                # Array of objects
                if 'size' in attribute:
                    # No need to check if attribute['size'] is int (fixed) or a variable reference,
                    # because we iterate with a for util in both cases
                    for_block = JavaScriptBlockGenerator()
                    for_block.wrap(BlockType.FOR, '< this.{}.length'.format(attribute['name']), 'i')
                    if attribute_typedescriptor['type'] == TypeDescriptorType.Struct.value:
                        for_block.add_instructions(
                            ['newArray = concat_typedarrays(newArray, this.{}[i].serialize())'.format(attribute['name'])]
                        )
                    elif attribute_typedescriptor['type'] == TypeDescriptorType.Enum.value:
                        for_block.add_instructions(
                            ['var fitArray{0} = fit_bytearray(this.{0}, {1})'.format(
                                attribute['name'], self._get_type_size(attribute_typedescriptor)
                            )]
                        )
                        for_block.add_instructions(
                            ['newArray = concat_typedarrays(newArray, fitArray{})'.format(attribute['name'])]
                        )
                    self.serialize_function.add_block(for_block)

                # Single object
                else:
                    if attribute_typedescriptor['type'] == TypeDescriptorType.Struct.value:
                        self.serialize_function.add_instructions([
                            'newArray = concat_typedarrays(newArray, this.{}.serialize())'.format(attribute['name'])
                        ])
                    elif (
                            attribute_typedescriptor['type'] == TypeDescriptorType.Byte.value
                            or attribute_typedescriptor['type'] == TypeDescriptorType.Enum.value
                    ):
                        self.serialize_function.add_instructions([
                            'var fitArray{0} = fit_bytearray(this.{0}, {1})'.format(
                                attribute['name'], self._get_type_size(attribute_typedescriptor)
                            )
                        ])
                        self.serialize_function.add_instructions([
                            'newArray = concat_typedarrays(newArray, fitArray{})'.format(attribute['name'])
                        ])

    def _generate_serialize_function(self, attributes):
        self.serialize_function = JavaScriptFunctionGenerator()
        self.serialize_function.set_name('serialize')
        self.serialize_function.add_instructions(['var newArray = new Uint8Array()'])
        self._recurse_inlines(self._generate_serialize_attributes, attributes)
        self.serialize_function.add_instructions(['return newArray'])
        self.new_class.add_function(self.serialize_function)

    def _generate_attributes(self, attribute, sizeof_attribute_name):
        if sizeof_attribute_name is None:
            self.new_class.add_getter_setter(attribute['name'])

    def _generate_schema(self, type_descriptor, schema):
        self.new_class = JavaScriptClassGenerator(type_descriptor)
        self.exports.append(self.new_class.class_name)
        self._recurse_inlines(self._generate_attributes, schema['layout'])
        self._generate_load_from_binary_function(schema['layout'])
        self._generate_serialize_function(schema['layout'])
        return self.new_class.get_instructions()

    def _generate_concat_typedarrays(self):
        function = JavaScriptFunctionGenerator(FunctionType.ARROW_FUNCTION)
        function.set_name('concat_typedarrays')
        function.set_params(['array1', 'array2'])
        self.exports.append(function.name)
        function.add_instructions([
            'var newArray = new Uint8Array(array1.length + array2.length)',
            'newArray.set(array1)',
            'newArray.set(array2, array1.length)',
            'return newArray',
        ])
        return function.get_instructions()

    def _generate_buffer_to_uint(self):
        function = JavaScriptFunctionGenerator(FunctionType.ARROW_FUNCTION)
        function.set_name('buffer_to_uint')
        function.set_params(['buffer'])
        self.exports.append(function.name)
        function.add_instructions(['var dataView = new DataView(buffer.buffer)'])

        block = JavaScriptBlockGenerator()
        block.wrap(BlockType.IF, 'buffer.byteLength == 1')
        block.add_instructions([
            'return dataView.getUint8(0, true)',
        ])
        function.add_block(block)

        block = JavaScriptBlockGenerator()
        block.wrap(BlockType.ELIF, 'buffer.byteLength == 2')
        block.add_instructions([
            'return dataView.getUint16(0, true)',
        ])
        function.add_block(block)

        block = JavaScriptBlockGenerator()
        block.wrap(BlockType.ELIF, 'buffer.byteLength == 4')
        block.add_instructions([
            'return dataView.getUint32(0, true)',
        ])
        function.add_block(block)

        return function.get_instructions()

    def _generate_uint_to_buffer(self):
        function = JavaScriptFunctionGenerator(FunctionType.ARROW_FUNCTION)
        function.set_name('uint_to_buffer')
        function.set_params(['uint', 'bufferSize'])
        self.exports.append(function.name)
        function.add_instructions([
            'var buffer = new ArrayBuffer(bufferSize)',
            'var dataView = new DataView(buffer)',
        ])

        block = JavaScriptBlockGenerator()
        block.wrap(BlockType.IF, 'bufferSize == 1')
        block.add_instructions([
            'dataView.setUint8(0, uint, true)',
        ])
        function.add_block(block)

        block = JavaScriptBlockGenerator()
        block.wrap(BlockType.ELIF, 'bufferSize == 2')
        block.add_instructions([
            'dataView.setUint16(0, uint, true)',
        ])
        function.add_block(block)

        block = JavaScriptBlockGenerator()
        block.wrap(BlockType.ELIF, 'bufferSize == 4')
        block.add_instructions([
            'dataView.setUint32(0, uint, true)',
        ])
        function.add_block(block)

        function.add_instructions(['return new Uint8Array(buffer)'])

        return function.get_instructions()

    def _generate_fit_bytearray(self):
        function = JavaScriptFunctionGenerator(FunctionType.ARROW_FUNCTION)
        function.set_name('fit_bytearray')
        function.set_params(['array', 'size'])
        self.exports.append(function.name)

        block = JavaScriptBlockGenerator()
        block.wrap(BlockType.IF, 'array == null')
        block.add_instructions([
            'var newArray = new Uint8Array(size)',
            'newArray.fill(0)',
            'return newArray',
        ])
        function.add_block(block)

        block = JavaScriptBlockGenerator()
        block.wrap(BlockType.IF, 'array.length > size')
        block.add_instructions([
            'throw new RangeError("Data size larger than allowed")'
        ])
        function.add_block(block)

        block = JavaScriptBlockGenerator()
        block.wrap(BlockType.ELIF, 'array.length < size')
        block.add_instructions([
            'var newArray = new Uint8Array(size)',
            'newArray.fill(0)',
            'newArray.set(array, size - array.length)',
            'return newArray',
        ])
        function.add_block(block)

        function.add_instructions(['return array'])

        return function.get_instructions()

    def _generate_Uint8Array_consumer(self):
        self.consumer_class = JavaScriptClassGenerator('Uint8ArrayConsumable')
        self.consumer_class.add_constructor({'offset': 0, 'binary': 'binary'}, ['binary'])
        self.exports.append(self.consumer_class.class_name)

        get_bytes_function = JavaScriptFunctionGenerator()
        get_bytes_function.set_name('get_bytes')
        get_bytes_function.set_params(['count'])

        block = JavaScriptBlockGenerator()
        block.wrap(BlockType.IF, 'count + this.offset > this.binary.length')
        block.add_instructions([
            'throw new RangeError()',
        ])
        get_bytes_function.add_block(block)

        get_bytes_function.add_instructions([
            'var bytes = this.binary.slice(this.offset, this.offset + count)',
            'this.offset += count',
            'return bytes',
        ])
        self.consumer_class.add_function(get_bytes_function)

        return self.consumer_class.get_instructions()

    def _generate_module_exports(self):
        return ['module.exports = {'] + indent([export + ',' for export in self.exports]) + ['};']

    def generate(self):
        self.exports = []

        new_file = ['/*** File automatically generated by Catbuffer ***/', '']

        new_file += self._generate_concat_typedarrays() + ['']
        new_file += self._generate_fit_bytearray() + ['']
        new_file += self._generate_Uint8Array_consumer() + ['']
        new_file += self._generate_buffer_to_uint() + ['']
        new_file += self._generate_uint_to_buffer() + ['']

        for type_descriptor, value in self.schema.items():
            if value['type'] == TypeDescriptorType.Byte.value:
                # Typeless environment, values will be directly assigned
                pass
            elif value['type'] == TypeDescriptorType.Enum.value:
                # Using the constant directly, so enum definition unneeded
                pass
            elif value['type'] == TypeDescriptorType.Struct.value:
                new_file += self._generate_schema(type_descriptor, value) + ['']

        new_file += self._generate_module_exports() + ['']

        return new_file
