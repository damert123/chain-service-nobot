from .planfix_client import PlanfixClientDependency

from chain_service.services.progress_action.factory import ProgressActionServiceFactory
from chain_service.dependencies.uploaded_file_repository import (
    UploadedFileRepositoryDependency,
)

from fastapi import Depends
from typing import Annotated


def get_progress_action_service_factory(
    planfix_client: PlanfixClientDependency,
    uploaded_file_repository: UploadedFileRepositoryDependency,
) -> ProgressActionServiceFactory:
    return ProgressActionServiceFactory(
        planfix_client=planfix_client, uploaded_file_repository=uploaded_file_repository
    )


ProgressActionServiceFactoryDependency = Annotated[
    ProgressActionServiceFactory, Depends(get_progress_action_service_factory)
]
