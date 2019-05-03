from .JavaScriptUtils import indent

from enum import Enum


class BlockType(Enum):
    NONE = 0
    IF = 1
    ELSE = 2
    ELIF = 3


class JavaScriptBlockGenerator:
    def __init__(self):
        self.type = BlockType.NONE
        self.rule = ''
        self.instructions = []

    def wrap(self, type, rule):
        self.type = type
        self.rule = rule

    def add_instructions(self, instructions):
        self.instructions += instructions

    def add_block(self, block):
        self.add_instructions(block.get_instructions())

    def get_instructions(self):
        if self.type is not BlockType.NONE:
            if self.type is BlockType.IF:
                return ['if ({0}) {{'.format(self.rule)] + indent(self.instructions) + ['}']
            if self.type is BlockType.ELIF:
                return ['else if ({0}) {{'.format(self.rule)] + indent(self.instructions) + ['}']
            if self.type is BlockType.ELSE:
                return ['else {'] + indent(self.instructions) + ['}']

        return self.instructions
