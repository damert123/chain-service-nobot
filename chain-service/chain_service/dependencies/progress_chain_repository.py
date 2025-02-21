from .database import DatabaseDependency
from chain_service.repositories.progress_chain import ProgressChainRepository

from fastapi import Depends
from typing import Annotated


def get_progress_chain_repository(
    database: DatabaseDependency,
) -> ProgressChainRepository:
    return ProgressChainRepository(database=database)


ProgressChainRepositoryDependency = Annotated[
    ProgressChainRepository, Depends(get_progress_chain_repository)
]
