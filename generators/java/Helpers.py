from enum import Enum


class TypeDescriptorType(Enum):
    """Type descriptor enum"""
    Byte = 'byte'
    Struct = 'struct'
    Enum = 'enum'


def is_struct_type(typename):
    return typename == TypeDescriptorType.Struct.value


def is_enum_type(typename):
    return typename == TypeDescriptorType.Enum.value


def is_byte_type(typename):
    return typename == TypeDescriptorType.Byte.value


def get_generated_class_name(typename):
    return typename + 'Builder'


def is_builtin_type(typename, size):
    # byte up to long are passed as 'byte' with size set to proper value
    return not isinstance(size, str) and is_byte_type(typename) and size <= 8


class AttributeKind(Enum):
    """Attribute type enum"""
    SIMPLE = 1
    BUFFER = 2
    ARRAY = 3
    CUSTOM = 4
    UNKNOWN = 100


def get_attribute_size(schema, attribute):
    if ('size' not in attribute and not is_byte_type(attribute['type'])
            and not is_enum_type(attribute['type'])):
        attr = schema[attribute['type']]
        if 'size' in attr:
            return attr['size']
        return 1

    return attribute['size']


def get_attribute_kind(attribute):
    attribute_type = attribute['type']
    if is_struct_type(attribute_type) or is_enum_type(attribute_type):
        return AttributeKind.CUSTOM
    if 'size' not in attribute:
        return AttributeKind.CUSTOM

    attribute_size = attribute['size']

    if isinstance(attribute_size, str):
        if attribute_size.endswith('Size'):
            return AttributeKind.BUFFER

        if attribute_size.endswith('Count'):
            return AttributeKind.ARRAY

    if is_builtin_type(attribute_type, attribute_size):
        return AttributeKind.SIMPLE

    return AttributeKind.BUFFER


class TypeDescriptorDisposition(Enum):
    Inline = 'inline'
    Const = 'const'


def indent(code, n_indents=1):
    return ' ' * 4 * n_indents + code


def get_attribute_if_size(attribute_name, attributes, schema):
    value = get_attribute_property_equal(
        schema, attributes, 'size', attribute_name)
    return value['name'] if value is not None else None


def get_attribute_property_equal(schema, attributes, attribute_name, attribute_value):
    for attribute in attributes:
        if attribute_name in attribute and attribute[attribute_name] == attribute_value:
            return attribute
        if ('disposition' in attribute and
                attribute['disposition'] == TypeDescriptorDisposition.Inline.value):
            value = get_attribute_property_equal(
                schema, schema[attribute['type']]['layout'], attribute_name, attribute_value)
            if value is not None:
                return value

    return None


def get_builtin_type(size):
    builtin_types = {1: 'byte', 2: 'short', 4: 'int', 8: 'long'}
    builtin_type = builtin_types[size]
    return builtin_type


def get_read_method_name(size):
    if isinstance(size, str) or size > 8:
        method_name = 'readFully'
    else:
        typesize_methodname = {1: 'readByte',
                               2: 'readShort', 4: 'readInt', 8: 'readLong'}
        method_name = typesize_methodname[size]
    return method_name


def get_reverse_method_name(size):
    if isinstance(size, str) or size > 8 or size == 1:
        method_name = '{0}'
    else:
        typesize_methodname = {2: 'Short.reverseBytes({0})',
                               4: 'Integer.reverseBytes({0})',
                               8: 'Long.reverseBytes({0})'}
        method_name = typesize_methodname[size]
    return method_name


def get_write_method_name(size):
    if isinstance(size, str) or size > 8:
        method_name = 'write'
    else:
        typesize_methodname = {1: 'writeByte',
                               2: 'writeShort',
                               4: 'writeInt',
                               8: 'writeLong'}
        method_name = typesize_methodname[size]
    return method_name


def get_generated_type(schema, attribute):
    typename = attribute['type']
    attribute_kind = get_attribute_kind(attribute)
    if not is_byte_type(typename):
        typename = get_generated_class_name(typename)

    if attribute_kind == AttributeKind.SIMPLE:
        return get_builtin_type(get_attribute_size(schema, attribute))
    if attribute_kind == AttributeKind.BUFFER:
        return 'ByteBuffer'
    if attribute_kind == AttributeKind.ARRAY:
        return 'java.util.ArrayList<{0}>'.format(typename)

    return typename


def get_comments_if_present(comment):
    if comment:
        return '/** {0} */'.format(comment)
    return None
