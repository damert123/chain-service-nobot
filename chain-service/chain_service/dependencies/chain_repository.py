from .database import DatabaseDependency
from chain_service.repositories.chain import ChainRepository

from fastapi import Depends
from typing import Annotated


def get_chain_repository(database: DatabaseDependency) -> ChainRepository:
    return ChainRepository(database=database)


ChainRepositoryDependency = Annotated[ChainRepository, Depends(get_chain_repository)]
