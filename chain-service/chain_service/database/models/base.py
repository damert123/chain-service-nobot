from uuid import UUID, uuid4
from pydantic import BaseModel, Field
from pydantic.alias_generators import to_camel


class BaseConfig:
    populate_by_name = True
    alias_generator = to_camel
    json_encoders = {UUID: str}
    arbitrary_types_allowed = True


class BaseMongoModel(BaseModel):
    id: UUID = Field(default_factory=uuid4, alias="_id")

    class Config(BaseConfig):
        pass
