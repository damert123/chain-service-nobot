from chain_service.database.models.progress_chain import (
    ProgressChain,
    BaseProgressAction,
)

from abc import ABC, abstractmethod


class BaseProgressActionService(ABC):

    def __init__(
        self, progress_chain: ProgressChain, progress_action: BaseProgressAction
    ):
        self.progress_chain = progress_chain
        self.progress_action = progress_action

    @abstractmethod
    async def process():
        pass
