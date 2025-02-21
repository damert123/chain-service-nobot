from .base import BaseConfig

from typing import Annotated, Optional
from pydantic import BaseModel, Field


class RunningChain(BaseModel):
    task_id: str
    progress_chain_id: Annotated[Optional[str], Field(default=None)]

    class Config(BaseConfig):
        pass
