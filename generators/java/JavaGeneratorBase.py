# pylint: disable=too-few-public-methods
from abc import ABC, abstractmethod

from .Helpers import get_attribute_property_equal, append_period_if_needed
from .Helpers import get_generated_class_name, get_comments_from_attribute, indent, get_builtin_type
from .JavaMethodGenerator import JavaMethodGenerator


class JavaGeneratorBase(ABC):

    # pylint: disable=too-many-instance-attributes
    def __init__(self, name, schema, class_schema):
        self.builder_class_name = get_generated_class_name(name)
        self.name = name
        self.base_class_name = None
        self.class_output = []
        self.schema = schema
        self.privates = []
        self.class_schema = class_schema
        self.class_type = None
        self.finalized_class = False
        self.required_import = set()

    @abstractmethod
    def _add_public_declarations(self):
        raise NotImplementedError('need to override method')

    @abstractmethod
    def _add_serialize_custom(self, serialize_method):
        raise NotImplementedError('need to override method')

    @abstractmethod
    def _add_load_from_binary_custom(self, load_from_binary_method):
        raise NotImplementedError('need to override method')

    @abstractmethod
    def _add_private_declarations(self):
        raise NotImplementedError('need to override method')

    @abstractmethod
    def _calculate_size(self, new_getter):
        raise NotImplementedError('need to override method')

    @staticmethod
    def _foreach_attributes(attributes, callback, context=None):
        for attribute in attributes:
            if context is None:
                if callback(attribute):
                    break
            else:
                if callback(attribute, context):
                    break

    def _add_method(self, method, add_empty_line=True):
        self.class_output += [indent(line)
                              for line in method.get_method()]
        if add_empty_line:
            self.class_output += ['']

    def _add_load_from_binary_method(self):
        load_from_binary_method = JavaMethodGenerator(
            'public', self.builder_class_name, 'loadFromBinary',
            ['final DataInput stream'], 'throws Exception', True)
        self._add_load_from_binary_custom(load_from_binary_method)
        self._add_method_documentation(load_from_binary_method,
                                       'loadFromBinary - Create an instance of {0} from a stream.'
                                       .format(self.builder_class_name),
                                       [('stream', 'Byte stream to use to serialize the object.')],
                                       'An instance of {0}.'.format(
                                           self.builder_class_name),
                                       'Exception failed to deserialize from stream.')
        self._add_method(load_from_binary_method)

    def _add_serialize_method(self):
        serialize_method = JavaMethodGenerator(
            'public', 'byte[]', 'serialize', [], 'throws Exception')
        serialize_method.add_instructions(
            ['final ByteArrayOutputStream byteArrayStream = new ByteArrayOutputStream()'])
        serialize_method.add_instructions(
            ['final DataOutputStream dataOutputStream = new DataOutputStream(byteArrayStream)'])
        self._add_serialize_custom(serialize_method)
        serialize_method.add_instructions(['dataOutputStream.close()'])
        serialize_method.add_instructions(
            ['return byteArrayStream.toByteArray()'])
        self._add_method_documentation(serialize_method,
                                       'Serialize the object to bytes.',
                                       [], 'Serialized bytes.', 'Exception failed to serialize.')
        self._add_method(serialize_method, False)

    def _add_class_definition(self):
        line = get_comments_from_attribute(self.class_schema)
        if line is not None:
            self.class_output += [line]

        line = 'public '
        line += 'final ' if self.finalized_class or self.name.endswith('Body') else ''
        line += '{0} {1} '.format(
            self.class_type, self.builder_class_name)
        if self.base_class_name is not None:
            line += 'extends {0} '.format(
                get_generated_class_name(self.base_class_name))
        line += '{'
        self.class_output += [line]

    def _add_size_getter(self):
        size_attribute = get_attribute_property_equal(
            self.schema, self.schema['SizePrefixedEntity']['layout'], 'name', 'size')
        return_type = get_builtin_type(size_attribute['size'])
        new_getter = JavaMethodGenerator(
            'public', return_type, 'getSize', [])
        if self.base_class_name is not None:
            new_getter.add_annotation('@Override')
        self._calculate_size(new_getter)
        self._add_method_documentation(new_getter,
                                       'Get the size of the object.',
                                       [], 'Size in bytes.', None)
        self._add_method(new_getter)

    @staticmethod
    def _add_method_documentation(method_writer, method_description, param_list,
                                  return_description, exception):
        method_writer.add_documentations(['/**'])
        method_writer.add_documentations([' * {0}'.format(
            append_period_if_needed(method_description))])
        method_writer.add_documentations([' *'])
        if param_list:
            for name, description in param_list:
                method_writer.add_documentations([' * @param {0} {1}'.format(
                    name, append_period_if_needed(description))])
        if return_description:
            method_writer.add_documentations([' * @return {0}'.format(
                append_period_if_needed(return_description))])
        if exception:
            method_writer.add_documentations([' * @throws {0}'.format(
                append_period_if_needed(exception))])
        method_writer.add_documentations([' */'])

    def _add_required_import(self, full_class):
        if full_class not in self.required_import:
            self.required_import.add(full_class)

    def get_required_import(self):
        return self.required_import

    def _generate_class_methods(self):
        self._add_private_declarations()
        self._add_public_declarations()
        self._add_size_getter()
        self._add_load_from_binary_method()
        self._add_serialize_method()
        self.class_output += ['}']

    def generate(self):
        self._add_class_definition()
        self._generate_class_methods()
        return self.class_output
