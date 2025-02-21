from .chain import Chain
from .base import BaseConfig, BaseMongoModel

from enum import Enum
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Literal, Union, Annotated, Optional, Dict, List


class ProgressActionStatusEnum(str, Enum):
    PENDING = "pending"
    DONE = "done"
    FAILED = "failed"
    ABORTED = "aborted"


class BaseProgressAction(BaseModel):
    action_type: Literal["wait", "comment"]

    status: Annotated[
        ProgressActionStatusEnum, Field(default=ProgressActionStatusEnum.PENDING)
    ]

    started_at: Annotated[Optional[datetime], Field(default=None)]
    finished_at: Annotated[Optional[datetime], Field(default=None)]
    error_text: Annotated[Optional[str], Field(default=None)]


class WaitProgressAction(BaseProgressAction):
    action_type: Literal["wait"]
    wait_for: int

    class Config(BaseConfig):
        pass


class CommentProgressAction(BaseProgressAction):
    action_type: Literal["comment"]
    text: Annotated[Optional[str], Field(default=None)]
    file_urls: Annotated[Optional[List[str]], Field(default=[])]

    class Config(BaseConfig):
        pass


Action = Annotated[
    Union[WaitProgressAction, CommentProgressAction],
    Field(description="action_type"),
]


class ProgressChain(BaseMongoModel):
    task_id: int
    chain_id: str
    namespace_id: str
    variables: Annotated[Optional[Dict], Field(default={})]
    recipients: Annotated[Optional[List[int]], Field(default=[])]
    name: Annotated[Optional[str], Field(default=None)]
    actions: Annotated[Optional[List[Action]], Field(default=[])]
    created_at: Annotated[datetime, Field(default_factory=datetime.utcnow)]

    @classmethod
    def create_from_chain(
        cls,
        chain: Chain,
        task_id: int,
        variables: Optional[Dict] = {},
        recipients: Optional[List[int]] = [],
    ):

        for action in filter(lambda c: c.action_type == "comment", chain.actions):
            if not action.text:
                continue

            for key, value in variables.items():
                action.text = action.text.replace(f"{{{{{key}}}}}", value)

            action.text = action.text.replace("\n", "<br/>")

        return ProgressChain(
            task_id=task_id,
            chain_id=str(chain.id),
            namespace_id=chain.namespace_id,
            variables=variables,
            recipients=recipients,
            name=chain.name,
            actions=map(Chain.model_dump, chain.actions),
        )

    @property
    def is_finished(self):
        return all(
            action.status is ProgressActionStatusEnum.DONE for action in self.actions
        )

    @property
    def has_failed(self):
        return any(
            action.status is ProgressActionStatusEnum.FAILED for action in self.actions
        )
