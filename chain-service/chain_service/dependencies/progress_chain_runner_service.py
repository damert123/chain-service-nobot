from chain_service.services.progress_chain_runner import ProgressChainRunnerService

from .progress_chain_repository import ProgressChainRepositoryDependency
from .progress_action_service_factory import ProgressActionServiceFactoryDependency
from .running_chain_repository import RunningChainRepositoryDependency


from fastapi import Depends
from typing import Annotated


def get_progress_chain_runner_service(
    progress_chain_repository: ProgressChainRepositoryDependency,
    progress_action_service_factory: ProgressActionServiceFactoryDependency,
    running_chain_repository: RunningChainRepositoryDependency,
) -> ProgressChainRunnerService:
    return ProgressChainRunnerService(
        progress_chain_repository=progress_chain_repository,
        progress_action_service_factory=progress_action_service_factory,
        running_chain_repository=running_chain_repository,
    )


ProgressChainRunnerServiceDependency = Annotated[
    ProgressChainRunnerService, Depends(get_progress_chain_runner_service)
]
