from .Helpers import indent


class JavaMethodGenerator:
    """Java method generator"""

    def __init__(self, scope, return_type, name, params, exception_list='', static_method=False):
        # pylint: disable-msg=too-many-arguments
        self.name = name
        line = '{0} static'.format(
            scope) if static_method else '{0}'.format(scope)
        if return_type:
            line += ' {0}'.format(return_type)
        line += ' {0}({1})'.format(self.name, ', '.join(params))
        if exception_list:
            line += ' {0}'.format(exception_list)
        line += ' {'
        self.method_output = [line]
        self.annotation_output = []
        self.documentation_output = []

    def add_instructions(self, instructions, add_semicolon=True):
        for instruction in instructions:
            if add_semicolon:
                instruction += ';'
            self.method_output.append(indent(instruction))

    def get_method(self):
        return self.documentation_output + self.annotation_output + self.method_output + ['}']

    def add_annotation(self, annotation):
        self.annotation_output.append(annotation)

    def add_documentations(self, documentations):
        for documentation in documentations:
            self.documentation_output.append(documentation)
