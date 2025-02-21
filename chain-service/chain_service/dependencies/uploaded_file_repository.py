from .database import DatabaseDependency
from chain_service.repositories.uploaded_file import UploadedFileRepository

from fastapi import Depends
from typing import Annotated


def get_uploaded_file_repository(
    database: DatabaseDependency,
) -> UploadedFileRepository:
    return UploadedFileRepository(database=database)


UploadedFileRepositoryDependency = Annotated[
    UploadedFileRepository, Depends(get_uploaded_file_repository)
]
