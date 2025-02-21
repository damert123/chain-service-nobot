from .database import DatabaseDependency
from chain_service.repositories.running_chain import RunningChainRepository

from fastapi import Depends
from typing import Annotated


def get_running_chain_repository(
    database: DatabaseDependency,
) -> RunningChainRepository:
    return RunningChainRepository(database=database)


RunningChainRepositoryDependency = Annotated[
    RunningChainRepository, Depends(get_running_chain_repository)
]
