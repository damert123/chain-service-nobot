from .base import BaseConfig

from pydantic import BaseModel, Field
from typing import Annotated, Optional, Dict, List


class RunChainInput(BaseModel):
    task_id: int
    chain_id: str
    variables: Annotated[Optional[Dict], Field(default={})]
    recipients: Annotated[Optional[List[int]], Field(default=[])]

    class Config(BaseConfig):
        pass


class AbortChainInput(BaseModel):
    task_id: str
