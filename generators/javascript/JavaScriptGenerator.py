from .javascript_builder.JavaScriptBlockGenerator import BlockType, JavaScriptBlockGenerator
from .javascript_builder.JavaScriptClassGenerator import JavaScriptClassGenerator
from .javascript_builder.JavaScriptFunctionGenerator import FunctionType, JavaScriptFunctionGenerator
from .javascript_builder.JavaScriptUtils import indent

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
        self.current = None
        self.new_class = None
        self.load_from_binary_function = None
        self.serialize_function = None
        self.consumer_class = None
        self.exports = None

    def __iter__(self):
        self.current = iter(self.schema)
        return self

    def __next__(self):
        name = next(self.current)
        while self.schema[name]['type'] is not 'struct' or self._is_inlined_in_schema(name):
            name = next(self.current)
        code = self.generate(name)
        return Descriptor('{}Buffer.js'.format(name), code)

    def _is_inlined_in_schema(self, name):
        for schema in self.schema.values():
            if 'layout' in schema and list(filter(lambda field: field['type'] == name and 'disposition' in field and field['disposition'] == 'inline', schema['layout'])) != []:
                return True
        return False

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
                            ['newArray = concat_typedarrays(newArray, this.{0}[{1}].serialize())'.format(attribute['name'], for_block.iterator)]
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

    def _generate_module_exports(self):
        return ['module.exports = {'] + indent([export + ',' for export in self.exports]) + ['};']

    def generate(self, name):
        self.exports = []

        new_file = ['/*** File automatically generated by Catbuffer ***/', '']

        schema_type = self.schema[name]['type']
        if schema_type == TypeDescriptorType.Byte.value:
            # Typeless environment, values will be directly assigned
            pass
        elif schema_type == TypeDescriptorType.Enum.value:
            # Using the constant directly, so enum definition unneeded
            pass
        elif schema_type == TypeDescriptorType.Struct.value:
            new_file += self._generate_schema(name, self.schema[name]) + ['']

        new_file += self._generate_module_exports() + ['']

        return new_file
