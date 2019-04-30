from .Helpers import get_attribute_kind, TypeDescriptorDisposition, get_attribute_if_size
from .Helpers import get_comments_if_present, is_builtin_type
from .Helpers import get_generated_class_name, get_builtin_type, indent, get_attribute_size
from .Helpers import get_generated_type, get_attribute_property_equal, AttributeKind, is_byte_type
from .Helpers import get_read_method_name, get_reverse_method_name, get_write_method_name
from .JavaGeneratorBase import JavaGeneratorBase
from .JavaMethodGenerator import JavaMethodGenerator


def capitalize_first_character(string):
    return string[0].upper() + string[1:]


class JavaClassGenerator(JavaGeneratorBase):
    """Java class generator"""

    def __init__(self, name, schema, class_schema, enum_list):
        super(JavaClassGenerator, self).__init__(name, schema, class_schema)

        self.enum_list = enum_list
        self.class_type = 'class'

        if 'layout' in self.class_schema:
            self._foreach_attributes(
                self.class_schema['layout'], self._find_base_callback)

    @staticmethod
    def _is_inline_class(attribute):
        return 'disposition' in attribute and attribute[
            'disposition'] == TypeDescriptorDisposition.Inline.value

    def _find_base_callback(self, attribute):
        if (self._is_inline_class(attribute) and
                self.should_generate_class(attribute['type'])):
            self.base_class_name = attribute['type']
            self.finalized_class = True
            return True
        return False

    def _should_declaration(self, attribute):
        return not self.is_count_size_field(attribute) and attribute['name'] != 'size'

    def _get_body_class_name(self):
        body_name = self.name if not self.name.startswith('Embedded') else self.name[8:]
        return '{0}Body'.format(body_name)

    def _add_private_declarations(self):
        self._recurse_foreach_attribute(
            self.name, self._add_private_declaration, self.class_output,
            [self.base_class_name, self._get_body_class_name()])
        self.class_output += ['']

    def _add_private_declaration(self, attribute, private_output):
        if not self.is_count_size_field(attribute):
            line = get_comments_if_present(attribute['comments'])
            if line is not None:
                private_output += [indent(line)]
            attribute_name = attribute['name']
            var_type = get_generated_type(self.schema, attribute)
            scope = 'private final' if attribute_name != 'size' else 'protected'
            private_output += [
                indent('{0} {1} {2};'.format(scope, var_type, attribute_name))]

    @staticmethod
    def _get_generated_getter_name(attribute_name):
        return 'get{0}'.format(capitalize_first_character(attribute_name))

    @staticmethod
    def _add_simple_getter(attribute, new_getter):
        new_getter.add_instructions(
            ['return this.{0}'.format(attribute['name'])])

    @staticmethod
    def _add_buffer_getter(attribute, new_getter):
        new_getter.add_instructions(
            ['return this.{0}'.format(attribute['name'])])

    def _add_array_getter(self, attribute, new_getter):
        return_type = get_generated_type(self.schema, attribute)
        new_getter.add_instructions(
            ['return ({0})this.{1}'.format(return_type, attribute['name'])])

    def _add_method_condition(self, attribute, method_writer):
        if 'condition' in attribute:
            condition_type_attribute = get_attribute_property_equal(
                self.schema, self.class_schema['layout'], 'name', attribute['condition'])
            condition_type_prefix = ''
            if condition_type_attribute is not None:
                condition_type_prefix = '{0}.'.format(
                    get_generated_class_name(condition_type_attribute['type']))

            method_writer.add_instructions(['if ({0} != {1}{2})'.format(
                attribute['condition'], condition_type_prefix,
                attribute['condition_value'].upper())], False)
            method_writer.add_instructions(
                [indent('{throw new java.lang.IllegalStateException();}')], False)
            method_writer.add_instructions([''], False)

    def _add_getter(self, attribute, schema):
        attribute_name = attribute['name']
        return_type = get_generated_type(schema, attribute)
        new_getter = JavaMethodGenerator(
            'public', return_type, self._get_generated_getter_name(attribute_name), [])

        if 'aggregate_class' in attribute:
            # This is just a pass through
            new_getter.add_instructions(
                ['return this.{0}.{1}()'.format(
                    self._get_name_from_type(attribute['aggregate_class']),
                    self._get_generated_getter_name(attribute_name))])
        else:
            self._add_method_condition(attribute, new_getter)
            getters = {
                AttributeKind.SIMPLE: self._add_simple_getter,
                AttributeKind.BUFFER: self._add_buffer_getter,
                AttributeKind.ARRAY: self._add_array_getter,
                AttributeKind.CUSTOM: self._add_simple_getter
            }
            attribute_kind = get_attribute_kind(attribute)
            getters[attribute_kind](attribute, new_getter)

        # If the comments is empty then just use name in the description
        description = attribute['comments'] if attribute[
            'comments'].strip() else attribute_name + '.'
        self._add_method_documentation(new_getter, 'Get {0}.'.format(description), [],
                                       description, None)
        self._add_method(new_getter)

    @staticmethod
    def _add_simple_setter(attribute, new_setter):
        new_setter.add_instructions(
            ['this.{0} = {0}'.format(attribute['name'])])

    @staticmethod
    def _add_array_setter(attribute, new_setter):
        new_setter.add_instructions(
            ['this.{0} = {0}'.format(attribute['name'])])

    def _add_buffer_setter(self, attribute, new_setter):
        attribute_size = get_attribute_size(self.schema, attribute)
        attribute_name = attribute['name']
        new_setter.add_instructions(
            ['if ({0} == null)'.format(attribute_name)], False)
        new_setter.add_instructions(
            [indent('{{throw new NullPointerException("{0}");}}'.format(attribute_name))], False)
        if not isinstance(attribute_size, str):
            new_setter.add_instructions(
                ['if ({0}.array().length != {1})'.format(attribute_name, attribute_size)], False)
            new_setter.add_instructions(
                [indent('{{throw new IllegalArgumentException("{0} should be {1} bytes");}}'
                        .format(attribute_name, attribute_size))], False)
        new_setter.add_instructions([''], False)
        new_setter.add_instructions(
            ['this.{0} = {0}'.format(attribute_name)])

    @staticmethod
    def _add_size_value(attribute, size_list):
        kind = get_attribute_kind(attribute)
        if kind == AttributeKind.SIMPLE:
            size_list.append(
                '{0}; // {1}'.format(attribute['size'], attribute['name']))
        elif kind == AttributeKind.BUFFER:
            size_list.append(
                'this.{0}.array().length;'.format(attribute['name']))
        elif kind == AttributeKind.ARRAY:
            size_list.append('this.{0}.stream().mapToInt(o -> o.getSize()).sum();'.
                             format(attribute['name']))
        else:
            size_list.append('this.{0}.getSize();'.format(attribute['name']))

    def _calculate_size(self, new_getter):
        size_list = []
        size_attribute = get_attribute_property_equal(
            self.schema, self.schema['SizePrefixedEntity']['layout'], 'name', 'size')
        return_type = get_builtin_type(size_attribute['size'])
        if self.base_class_name is not None:
            size_list.append('super.getSize();')
        self._recurse_foreach_attribute(self.name,
                                        self._add_size_value, size_list,
                                        [self.base_class_name, self._get_body_class_name()])
        if size_list is not None:
            new_getter.add_instructions(
                ['{0} size = {1}'.format(return_type, size_list[0])], False)
            for size in size_list[1:]:
                new_getter.add_instructions(['size += {0}'.format(size)], False)
        new_getter.add_instructions(['return size'])

    def _add_getters(self, attribute, schema):
        if self._should_declaration(attribute):
            self._add_getter(attribute, schema)

    @staticmethod
    def _get_name_from_type(type_name):
        return type_name[0].lower() + type_name[1:]

    def _recurse_foreach_attribute(self, class_name, callback,
                                   context, ignore_inline_class):
        class_generated = (class_name != self.name and self.should_generate_class(class_name))
        for attribute in self.schema[class_name]['layout']:
            if class_generated:
                attribute['aggregate_class'] = class_name

            if 'disposition' in attribute:
                inline_class = attribute['type']
                if attribute['disposition'] == TypeDescriptorDisposition.Inline.value:
                    if self.should_generate_class(inline_class):
                        # Class was grenerated so it can be declare aggregate
                        attribute['name'] = self._get_name_from_type(inline_class)
                        if (self.base_class_name == inline_class and
                                self.base_class_name in ignore_inline_class):
                            continue  # skip the base class
                        if inline_class in ignore_inline_class:
                            callback(attribute, context)
                            continue

                    self._recurse_foreach_attribute(inline_class,
                                                    callback, context, ignore_inline_class)
                elif attribute['disposition'] == TypeDescriptorDisposition.Const.value:
                    # add dynamic enum if present in this class
                    enum_name = attribute['type']
                    if enum_name in self.enum_list:
                        self.enum_list[enum_name].add_enum_value(
                            self.builder_class_name,
                            attribute['value'],
                            attribute['comments'])
                    continue
            else:
                callback(attribute, context)

    def _add_attribute_condition_if_needed(self, attribute, method_writer, obj_prefix):
        if 'condition' in attribute:
            condition_type_attribute = get_attribute_property_equal(
                self.schema, self.class_schema, 'name', attribute['condition'])
            condition_type_prefix = ''
            if condition_type_attribute is not None:
                condition_type_prefix = '{0}.'.format(
                    get_generated_class_name(condition_type_attribute['type']))

            method_writer.add_instructions(['if ({0}{1}() == {2}{3})'.format(
                obj_prefix, self._get_generated_getter_name(
                    attribute['condition']),
                condition_type_prefix, attribute['condition_value'].upper())], False)
            return True
        return False

    def _load_from_binary_simple(self, attribute, load_from_binary_method):
        indent_required = self._add_attribute_condition_if_needed(
            attribute, load_from_binary_method, 'this.')
        size = get_attribute_size(self.schema, attribute)
        read_method_name = 'stream.{0}()'.format(get_read_method_name(size))
        reverse_byte_method = get_reverse_method_name(
            size).format(read_method_name)
        line = 'this.{0} = {1}'.format(attribute['name'], reverse_byte_method)
        load_from_binary_method.add_instructions(
            [indent(line) if indent_required else line])

    def _load_from_binary_buffer(self, attribute, load_from_binary_method):
        attribute_name = attribute['name']
        attribute_size = get_attribute_size(self.schema, attribute)
        load_from_binary_method.add_instructions(
            ['this.{0} = ByteBuffer.allocate({1})'.format(attribute_name, attribute_size)])
        load_from_binary_method.add_instructions([
            'stream.{0}(this.{1}.array())'.format(
                get_read_method_name(attribute_size), attribute_name)
        ])

    @staticmethod
    def _load_from_binary_array(attribute, load_from_binary_method):
        attribute_typename = attribute['type']
        attribute_sizename = attribute['size']
        attribute_name = attribute['name']
        load_from_binary_method.add_instructions(
            ['this.{0} = new java.util.ArrayList<>({1})'.format(
                attribute_name, attribute_sizename)])
        load_from_binary_method.add_instructions([
            'for (int i = 0; i < {0}; i++) {{'.format(attribute_sizename)], False)

        if is_byte_type(attribute_typename):
            load_from_binary_method.add_instructions([indent(
                '{0}.add(stream.{1}())'.format(attribute_name, get_read_method_name(1)))])
        else:
            load_from_binary_method.add_instructions([indent(
                '{0}.add({1}.loadFromBinary(stream))'.format(
                    attribute_name, get_generated_class_name(attribute_typename)))])
        load_from_binary_method.add_instructions(['}'], False)

    @staticmethod
    def _load_from_binary_custom(attribute, load_from_binary_method):
        load_from_binary_method.add_instructions([
            'this.{0} = {1}.loadFromBinary(stream)'
            .format(attribute['name'], get_generated_class_name(attribute['type']))
        ])

    @staticmethod
    def is_count_size_field(field):
        return field['name'].endswith('Size') or field['name'].endswith('Count')

    def _generate_load_from_binary_attributes(self, attribute, load_from_binary_method):
        attribute_name = attribute['name']
        if self.is_count_size_field(attribute):
            read_method_name = 'stream.{0}()'.format(
                get_read_method_name(attribute['size']))
            size = get_attribute_size(self.schema, attribute)
            reverse_byte_method = get_reverse_method_name(
                size).format(read_method_name)
            load_from_binary_method.add_instructions([
                '{0} {1} = {2}'.format(get_generated_type(self.schema, attribute),
                                       attribute_name, reverse_byte_method)
            ])
        else:
            load_attribute = {
                AttributeKind.SIMPLE: self._load_from_binary_simple,
                AttributeKind.BUFFER: self._load_from_binary_buffer,
                AttributeKind.ARRAY: self._load_from_binary_array,
                AttributeKind.CUSTOM: self._load_from_binary_custom
            }

            attribute_kind = get_attribute_kind(attribute)
            load_attribute[attribute_kind](attribute, load_from_binary_method)

    def _serialize_attribute_simple(self, attribute, serialize_method):
        indent_required = self._add_attribute_condition_if_needed(attribute,
                                                                  serialize_method, 'this.')
        size = get_attribute_size(self.schema, attribute)
        reverse_byte_method = get_reverse_method_name(size).format(
            'this.' + self._get_generated_getter_name(attribute['name'] + '()'))
        line = 'dataOutputStream.{0}({1})'.format(
            get_write_method_name(size), reverse_byte_method)
        serialize_method.add_instructions(
            [indent(line) if indent_required else line])

    def _serialize_attribute_buffer(self, attribute, serialize_method):
        attribute_name = attribute['name']
        attribute_size = get_attribute_size(self.schema, attribute)
        serialize_method.add_instructions([
            'dataOutputStream.{0}(this.{1}.array(), 0, this.{1}.array().length)'.format(
                get_write_method_name(attribute_size), attribute_name)
        ])

    @staticmethod
    def _get_serialize_name(attribute_name):
        return '{0}Bytes'.format(attribute_name)

    def _serialize_attribute_array(self, attribute, serialize_method):
        attribute_typename = attribute['type']
        attribute_size = attribute['size']
        attribute_name = attribute['name']
        serialize_method.add_instructions([
            'for (int i = 0; i < this.{0}.size(); i++) {{'.format(attribute_name)
        ], False)

        if is_byte_type(attribute_typename):
            serialize_method.add_instructions([indent(
                'dataOutputStream.{0}(this.{1}.get(i))'.format(get_write_method_name(1),
                                                               attribute_name))])
        else:
            attribute_bytes_name = self._get_serialize_name(attribute_name)
            serialize_method.add_instructions([indent(
                'final byte[] {0} = this.{1}.get(i).serialize()'.format(attribute_bytes_name,
                                                                        attribute_name))])
            serialize_method.add_instructions([indent(
                'dataOutputStream.{0}({1}, 0, {1}.length)'.format(
                    get_write_method_name(attribute_size), attribute_bytes_name))])
        serialize_method.add_instructions(['}'], False)

    def _serialize_attribute_custom(self, attribute, serialize_method):
        attribute_name = attribute['name']
        attribute_bytes_name = self._get_serialize_name(attribute_name)
        serialize_method.add_instructions([
            'final byte[] {0} = this.{1}.serialize()'
            .format(attribute_bytes_name, attribute_name)
        ])
        serialize_method.add_instructions([
            'dataOutputStream.write({0}, 0, {0}.length)'.format(
                attribute_bytes_name)
        ])

    def _generate_serialize_attributes(self, attribute, serialize_method):
        attribute_name = attribute['name']
        if self.is_count_size_field(attribute):
            size = get_attribute_size(self.schema, attribute)
            size_extension = '.size()' if attribute_name.endswith(
                'Count') else '.array().length'
            full_property_name = '({0}){1}'.format(
                get_builtin_type(size), 'this.' +
                get_attribute_if_size(attribute['name'],
                                      self.class_schema['layout'],
                                      self.schema) + size_extension)
            reverse_byte_method = get_reverse_method_name(
                size).format(full_property_name)
            line = 'dataOutputStream.{0}({1})'.format(
                get_write_method_name(size), reverse_byte_method)
            serialize_method.add_instructions([line])
        else:
            serialize_attribute = {
                AttributeKind.SIMPLE: self._serialize_attribute_simple,
                AttributeKind.BUFFER: self._serialize_attribute_buffer,
                AttributeKind.ARRAY: self._serialize_attribute_array,
                AttributeKind.CUSTOM: self._serialize_attribute_custom
            }

            attribute_kind = get_attribute_kind(attribute)
            serialize_attribute[attribute_kind](attribute, serialize_method)

    def _add_getters_field(self):
        self._recurse_foreach_attribute(
            self.name, self._add_getters, self.schema, [self.base_class_name])

    def _add_public_declarations(self):
        self._add_constructor()
        self._add_constructor_stream()
        self._add_factory_method()
        self._add_getters_field()

    def _add_load_from_binary_custom(self, load_from_binary_method):
        load_from_binary_method.add_instructions(
            ['return new {0}(stream)'.format(self.builder_class_name)])

    def _add_serialize_custom(self, serialize_method):
        if self.base_class_name is not None:
            serialize_method.add_instructions(
                ['final byte[] superBytes = super.serialize()'])
            serialize_method.add_instructions(
                ['dataOutputStream.write(superBytes, 0, superBytes.length)'])
        self._recurse_foreach_attribute(self.name,
                                        self._generate_serialize_attributes,
                                        serialize_method,
                                        [self.base_class_name, self._get_body_class_name()])

    def _add_constructor_stream(self):
        load_stream_constructor = JavaMethodGenerator(
            'protected', '', self.builder_class_name,
            ['final DataInput stream'], 'throws Exception')
        if self.base_class_name is not None:
            load_stream_constructor.add_instructions(['super(stream)'])
        self._recurse_foreach_attribute(self.name,
                                        self._generate_load_from_binary_attributes,
                                        load_stream_constructor,
                                        [self.base_class_name, self._get_body_class_name()])
        self._add_method_documentation(load_stream_constructor,
                                       'Constructor - Create object of a stream.',
                                       [('stream', 'Byte stream to use to serialize the object.')],
                                       None, 'Exception failed to deserialize from stream.')
        self._add_method(load_stream_constructor)

    def _add_to_variable(self, attribute, param_list):
        if self._should_declaration(attribute):
            param_list.append('{0}'.format(attribute['name']))

    def _add_to_param(self, attribute, param_list):
        if self._should_declaration(attribute):
            attribute_name = attribute['name']
            attribute_type = get_generated_type(self.schema, attribute)
            param_list.append('final {0} {1}'.format(attribute_type, attribute_name))

    def _create_list(self, name, callback):
        param_list = []
        self._recurse_foreach_attribute(name,
                                        callback,
                                        param_list, [])
        param_string = param_list[0]
        for param in param_list[1:]:
            param_string += ', {0}'.format(param)
        return param_string

    def _create_param_list(self):
        return self._create_list(self.name, self._add_to_param)

    def _add_name_comment(self, attribute, context):
        if self._should_declaration(attribute):
            context.append((attribute['name'], attribute['comments']))

    def _create_name_comment_list(self, name):
        name_comment_list = []
        self._recurse_foreach_attribute(name,
                                        self._add_name_comment,
                                        name_comment_list, [])
        return name_comment_list

    @staticmethod
    def _add_attribute_to_list(attribute, attribute_list):
        attribute_list.append(attribute)

    def _add_constructor(self):
        constructor_method = JavaMethodGenerator(
            'protected', '', self.builder_class_name,
            [self._create_param_list()], 'throws Exception')

        if self.base_class_name is not None:
            constructor_method.add_instructions(['super({0})'.format(
                self._create_list(self.base_class_name,
                                  self._add_to_variable))])
            constructor_method.add_instructions([''], False)

        object_attributes = []
        self._recurse_foreach_attribute(self.name,
                                        self._add_attribute_to_list,
                                        object_attributes,
                                        [self.base_class_name, self._get_body_class_name()])
        add_space = False
        for attribute in object_attributes:
            if self._is_inline_class(attribute):
                continue
            if 'size' not in attribute or not is_builtin_type(attribute['type'], attribute['size']):
                attribute_name = attribute['name']
                constructor_method.add_instructions(
                    ['if ({0} == null)'.format(attribute_name)], False)
                constructor_method.add_instructions(
                    [indent('{{throw new NullPointerException("{0} cannot be null.");}}'.format(
                        attribute_name))],
                    False)
                add_space = True

        if add_space:
            constructor_method.add_instructions([''], False)

        for variable in object_attributes:
            if self._should_declaration(variable):
                if self._is_inline_class(variable):
                    constructor_method.add_instructions(['this.{0} = new {1}({2})'.format(
                        variable['name'], get_generated_class_name(variable['type']),
                        self._create_list(variable['type'],
                                          self._add_to_variable))])
                else:
                    constructor_method.add_instructions(
                        ['this.{0} = {0}'.format(variable['name'])])

        self._add_method_documentation(constructor_method, 'Constructor.',
                                       self._create_name_comment_list(self.name),
                                       None, 'Exception invalid parameters.')

        self._add_method(constructor_method)

    def _add_factory_method(self):
        factory = JavaMethodGenerator(
            'public', self.builder_class_name, 'create',
            [self._create_param_list()], 'throws Exception', True)
        factory.add_instructions(['return new {0}({1})'.format(
            self.builder_class_name, self._create_list(
                self.name, self._add_to_variable))])
        self._add_method_documentation(factory,
                                       'Create an instance of {0}.'.format(self.builder_class_name),
                                       self._create_name_comment_list(self.name),
                                       'An instance of {0}.'.format(self.builder_class_name),
                                       'Exception Invalid parameters.')
        self._add_method(factory)

    @staticmethod
    def should_generate_class(name):
        return (name.startswith('Embedded')
                or name.endswith('Transaction')
                or name.startswith('Mosaic')
                or name.endswith('Mosaic')
                or name.endswith('Modification')
                or (name.endswith('Body') and name != 'EntityBody'))
