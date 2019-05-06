import os

from generators.Descriptor import Descriptor

from .Helpers import is_byte_type, is_enum_type, is_struct_type, get_generated_class_name
from .JavaClassGenerator import JavaClassGenerator
from .JavaDefineTypeClassGenerator import JavaDefineTypeClassGenerator
from .JavaEnumGenerator import JavaEnumGenerator


class JavaFileGenerator:
    """Java file generator"""
    enum_class_list = {}

    def __init__(self, schema, options):
        self.schema = schema
        self.current = None
        self.options = options
        self.code = []

    def __iter__(self):
        self.current = self.generate()
        return self

    def __next__(self):
        self.code = []
        code, name = next(self.current)
        return Descriptor(name + '.java', code)

    def prepend_copyright(self, copyright_file):
        if os.path.isfile(copyright_file):
            with open(copyright_file) as header:
                self.code = [line.strip() for line in header]

    def set_import(self):
        self.code += ['import java.io.ByteArrayOutputStream;']
        self.code += ['import java.io.DataInput;']
        self.code += ['import java.io.DataOutputStream;']

    def set_package(self):
        self.code += ['package io.nem.catapult.builders;'] + ['']

    def update_code(self, generator):
        generated_class = generator.generate()
        for import_type in generator.get_required_import():
            self.code += ['import {0};'.format(import_type)]
        self.code += [''] + generated_class

    def generate(self):
        for type_descriptor, value in self.schema.items():
            self.code = []
            self.prepend_copyright(self.options['copyright'])
            self.set_package()
            self.set_import()
            attribute_type = value['type']

            if is_byte_type(attribute_type):
                new_class = JavaDefineTypeClassGenerator(
                    type_descriptor, self.schema, value,
                    JavaFileGenerator.enum_class_list)
                self.update_code(new_class)
                yield self.code, get_generated_class_name(type_descriptor)
            elif is_enum_type(attribute_type):
                JavaFileGenerator.enum_class_list[type_descriptor] = JavaEnumGenerator(
                    type_descriptor, self.schema, value)
            elif is_struct_type(attribute_type):
                if JavaClassGenerator.should_generate_class(type_descriptor):
                    new_class = JavaClassGenerator(
                        type_descriptor, self.schema, value,
                        JavaFileGenerator.enum_class_list)
                    self.update_code(new_class)
                    yield self.code, get_generated_class_name(type_descriptor)

        # write all the enum last just in case there are 'dynamic values'
        for type_descriptor, enum_class in JavaFileGenerator.enum_class_list.items():
            self.code = []
            self.prepend_copyright(self.options['copyright'])
            self.set_package()
            self.set_import()
            self.code += [''] + enum_class.generate()
            yield self.code, get_generated_class_name(type_descriptor)
