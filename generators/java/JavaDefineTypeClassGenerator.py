# pylint: disable=too-few-public-methods
from .Helpers import get_generated_type, AttributeKind, get_attribute_kind
from .JavaMethodGenerator import JavaMethodGenerator
from .JavaClassGenerator import JavaClassGenerator


class JavaDefineTypeClassGenerator(JavaClassGenerator):
    """Java define type class generator"""

    def __init__(self, name, schema, class_schema, enum_list):
        class_schema['name'] = name[0].lower() + name[1:]
        super(JavaDefineTypeClassGenerator, self).__init__(
            name, schema, class_schema, enum_list)

    def _add_public_declarations(self):
        self._add_constructor()
        self._add_constructor_stream()
        self._add_getter_setter(self.class_schema)

    def _add_private_declarations(self):
        self._add_private_declaration(self.class_schema)
        self.class_output += ['']

    def _add_serialize_custom(self, serialize_method):
        self._generate_serialize_attributes(
            self.class_schema, serialize_method)

    def _calculate_size(self, new_getter):
        new_getter.add_instructions(
            ['return {0}'.format(self.class_schema['size'])])

    def _add_constructor(self):
        attribute_name = self.class_schema['name']
        return_type = get_generated_type(self.schema, self.class_schema)
        new_setter = JavaMethodGenerator('public', '',
                                         self.builder_class_name,
                                         [return_type + ' ' + attribute_name])

        setters = {
            AttributeKind.SIMPLE: self._add_simple_setter,
            AttributeKind.BUFFER: self._add_buffer_setter,
            AttributeKind.ARRAY: self._add_array_setter,
            AttributeKind.CUSTOM: self._add_simple_setter
        }

        attribute_kind = get_attribute_kind(self.class_schema)
        setters[attribute_kind](self.class_schema, new_setter)
        self._add_method(new_setter)

    def _add_constructor_stream(self):
        load_stream_constructor = JavaMethodGenerator(
            'public', '', self.builder_class_name,
            ['DataInput stream'], 'throws Exception')
        self._generate_load_from_binary_attributes(
            self.class_schema, load_stream_constructor)
        self._add_method(load_stream_constructor)
