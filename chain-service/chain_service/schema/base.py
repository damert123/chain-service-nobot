from pydantic.alias_generators import to_camel


class BaseConfig:
    populate_by_name = True
    alias_generator = to_camel
