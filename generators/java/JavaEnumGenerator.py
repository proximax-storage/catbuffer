from .Helpers import get_builtin_type, indent, get_attribute_size
from .Helpers import get_read_method_name, get_reverse_method_name, get_write_method_name
from .Helpers import get_comments_if_present
from .JavaMethodGenerator import JavaMethodGenerator
from .JavaGeneratorBase import JavaGeneratorBase


def get_type(attribute):
    return get_builtin_type(attribute['size'])


def create_enum_name(name):
    return name[0] + ''.join('_' + x if x.isupper() else x for x in name[1:])


class JavaEnumGenerator(JavaGeneratorBase):
    """Java enum generator"""

    def __init__(self, name, schema, class_schema):
        super(JavaEnumGenerator, self).__init__(name, schema, class_schema)
        self.enum_values = {}
        self.class_type = 'enum'

        self._add_enum_values(self.class_schema)

    def _add_private_declaration(self):
        var_type = get_type(self.class_schema)
        self.class_output += [
            indent('private final {0} value;'.format(var_type))] + ['']

    def _add_enum_values(self, enum_attribute):
        enum_attribute_values = enum_attribute['values']
        for current_attribute in enum_attribute_values:
            self.add_enum_value(
                current_attribute['name'],
                current_attribute['value'],
                current_attribute['comments'])

    def _write_enum_values(self):
        enum_type = get_type(self.class_schema)
        enum_length = len(self.enum_values)
        count = 1
        for name, value_comments in self.enum_values.items():
            value, comments = value_comments
            comment_line = get_comments_if_present(comments)
            if comment_line is not None:
                self.class_output += [indent(comment_line)]
            line = '{0}(({1}) {2})'.format(name.upper(), enum_type, value)
            line += ',' if count < enum_length else ';'
            self.class_output += [indent(line)]
            count += 1
        self.class_output += ['']

    def _add_constructor(self):
        enum_type = get_type(self.class_schema)
        constructor_method = JavaMethodGenerator('private', '', self.builder_class_name, [
            '{0} value'.format(enum_type)])
        constructor_method.add_instructions(['this.value = value'])
        self._add_method(constructor_method)

    def _add_load_from_binary_custom(self, load_from_binary_method):
        read_data_line = 'stream.{0}()'.format(
            get_read_method_name(self.class_schema['size']))
        size = get_attribute_size(self.schema, self.class_schema)
        reverse_byte_method = get_reverse_method_name(
            size).format(read_data_line)
        load_from_binary_method.add_instructions(
            ['{0} streamValue = {1}'.format(get_type(self.class_schema), reverse_byte_method)])
        load_from_binary_method.add_instructions(
            ['for ({0} current : {0}.values()) {{'.format(self.builder_class_name)], False)
        load_from_binary_method.add_instructions(
            [indent('if (streamValue == current.value)')], False)
        load_from_binary_method.add_instructions(
            [indent('return current', 2)])
        load_from_binary_method.add_instructions(
            ['}'], False)
        load_from_binary_method.add_instructions(
            ['throw new RuntimeException(streamValue + " was not a backing value for {0}.")'
             .format(self.builder_class_name)])

    def _add_serialize_custom(self, serialize_method):
        size = get_attribute_size(self.schema, self.class_schema)
        reverse_byte_method = get_reverse_method_name(
            size).format('this.value')
        serialize_method.add_instructions([
            'dataOutputStream.{0}({1})'.format(
                get_write_method_name(size), reverse_byte_method)
        ])

    def add_enum_value(self, name, value, comments):
        self.enum_values[create_enum_name(name)] = [value, comments]

    def _add_public_declarations(self):
        pass

    def _add_private_declarations(self):
        self._add_private_declaration()
        self._add_constructor()

    def _calculate_size(self, new_getter):
        new_getter.add_instructions(
            ['return {0}'.format(self.class_schema['size'])])

    def generate(self):
        self._add_class_definition()
        self._write_enum_values()
        self._generate_class_methods()
        return self.class_output
