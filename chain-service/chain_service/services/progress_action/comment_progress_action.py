from .base import BaseProgressActionService

from chain_service.repositories.uploaded_file import UploadedFileRepository
from chain_service.database.models.progress_chain import (
    CommentProgressAction,
    ProgressChain,
)

from typing import List
from loguru import logger
from planfix_client import PlanfixClient


class CommentProgressActionService(BaseProgressActionService):

    def __init__(
        self,
        planfix_client: PlanfixClient,
        uploaded_file_repository: UploadedFileRepository,
        progress_chain: ProgressChain,
        progress_action: CommentProgressAction,
    ):
        self.planfix_client = planfix_client
        self.uploaded_file_repository = uploaded_file_repository
        self.progress_chain = progress_chain
        self.progress_action = progress_action

    async def process(self):
        payload = {
            "task_id": self.progress_chain.task_id,
            "recipients": self.progress_chain.recipients or [],
        }

        if self.progress_action.text:
            payload["description"] = self.progress_action.text

        if self.progress_action.file_urls:
            payload["file_ids"] = await self.get_file_ids()

        await self.planfix_client.create_comment(**payload)

    async def get_file_ids(self) -> List[int]:
        file_ids = list()

        for file_url in self.progress_action.file_urls:
            uploaded_file = await self.uploaded_file_repository.get_by_file_url(
                file_url
            )

            if not uploaded_file:
                logger.error(
                    f"Uploaded file id not found while running {self.progress_chain}"
                )

                continue

            file_ids.append(uploaded_file.file_id)

        return file_ids
