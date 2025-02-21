from .base import BaseConfig, BaseMongoModel

from datetime import datetime
from pydantic import BaseModel, Field
from typing import Literal, Union, Annotated, Optional, List


class BaseAction(BaseModel):
    action_type: Literal["wait", "comment"]

    class Config(BaseConfig):
        pass


class WaitAction(BaseAction):
    action_type: Literal["wait"]
    wait_for: int


class CommentAction(BaseAction):
    action_type: Literal["comment"]
    text: Annotated[Optional[str], Field(default=None)]
    file_urls: Annotated[Optional[List[str]], Field(default=[])]


Action = Annotated[Union[WaitAction, CommentAction], Field(description="action_type")]


class Chain(BaseMongoModel):
    namespace_id: str
    name: Annotated[Optional[str], Field(default=None)]
    actions: Annotated[Optional[List[Action]], Field(default=[])]
    last_modified: Annotated[datetime, Field(default_factory=datetime.utcnow)]
