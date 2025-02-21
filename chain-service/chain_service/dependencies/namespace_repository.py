from .database import DatabaseDependency
from chain_service.repositories.namespace import NamespaceRepository


from fastapi import Depends
from typing import Annotated


def get_namespace_repository(database: DatabaseDependency) -> NamespaceRepository:
    return NamespaceRepository(database=database)


NamespaceRepositoryDependency = Annotated[
    NamespaceRepository, Depends(get_namespace_repository)
]
