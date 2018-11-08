from generators.cpp_builder.BuilderGenerator import BuilderGenerator
from generators.javascript.JavaScriptGenerator import JavaScriptGenerator

AVAILABLE_GENERATORS = {
    'cpp_builder': BuilderGenerator,
    'js': JavaScriptGenerator
}
