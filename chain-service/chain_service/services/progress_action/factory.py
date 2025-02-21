from chain_service.repositories.uploaded_file import UploadedFileRepository
from chain_service.database.models.progress_chain import (
    ProgressChain,
    BaseProgressAction,
)

from .base import BaseProgressActionService
from .wait_progress_action import WaitProgressActionService
from .comment_progress_action import CommentProgressActionService

from planfix_client import PlanfixClient


class ProgressActionServiceFactory:

    def __init__(
        self,
        planfix_client: PlanfixClient,
        uploaded_file_repository: UploadedFileRepository,
    ):
        self.planfix_client = planfix_client
        self.uploaded_file_repository = uploaded_file_repository

    def __call__(
        self, progress_chain: ProgressChain, progress_action: BaseProgressAction
    ) -> BaseProgressActionService:

        match progress_action.action_type:

            case "wait":
                return WaitProgressActionService(
                    progress_chain=progress_chain, progress_action=progress_action
                )

            case "comment":
                return CommentProgressActionService(
                    planfix_client=self.planfix_client,
                    uploaded_file_repository=self.uploaded_file_repository,
                    progress_chain=progress_chain,
                    progress_action=progress_action,
                )
