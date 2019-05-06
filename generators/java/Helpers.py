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


def get_attribute_property_equal(schema, attributes, attribute_name, attribute_value, recurse=True):
    for attribute in attributes:
        if attribute_name in attribute and attribute[attribute_name] == attribute_value:
            return attribute
        if (recurse and 'disposition' in attribute and
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
        type_size_method_name = {1: 'readByte', 2: 'readShort', 4: 'readInt', 8: 'readLong'}
        method_name = type_size_method_name[size]
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
        return 'ArrayList<{0}>'.format(typename)

    return typename


def get_import_for_type(data_type):
    actual_type = data_type.split('<')[0] if '<' in data_type else data_type

    type_import = {
        'ByteBuffer': 'java.nio.ByteBuffer',
        'ArrayList': 'java.util.ArrayList',
    }
    return type_import[actual_type] if actual_type in type_import.keys() else None


def append_period_if_needed(line):
    return line if line.endswith('.') else line + '.'


def get_comment_from_name(name):
    return name[0].upper() + ''.join(' ' + x.lower() if x.isupper() else x for x in name[1:])


def get_comments_if_present(comment):
    if comment:
        return '/** {0} */'.format(append_period_if_needed(comment))
    return None


def get_comments_from_attribute(attribute, formatted=True):
    comment = attribute['comments'].strip() if 'comments' in attribute else ''
    if not comment:
        comment = get_comment_from_name(attribute['name'])
    return get_comments_if_present(comment) if formatted else comment


def create_enum_name(name):
    enum_name = name[0] + ''.join('_' + x if x.isupper() else x for x in name[1:])
    return enum_name.upper()


def get_default_value(attribute):
    attribute_kind = get_attribute_kind(attribute)
    if attribute_kind == AttributeKind.SIMPLE:
        return '0'
    return 'null'
