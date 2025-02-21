from chain_service.services.file_uploader import FileUploaderService

from .planfix_client import PlanfixClientDependency
from .uploaded_file_repository import UploadedFileRepositoryDependency
from .audio_converter_service import AudioConverterServiceDependency

from fastapi import Depends
from typing import Annotated


def get_file_uploader_service(
    planfix_client: PlanfixClientDependency,
    uploaded_file_repository: UploadedFileRepositoryDependency,
    audio_converter_service: AudioConverterServiceDependency,
) -> FileUploaderService:
    return FileUploaderService(
        planfix_client=planfix_client,
        uploaded_file_repository=uploaded_file_repository,
        audio_converter_service=audio_converter_service,
    )


FileUploaderServiceDependency = Annotated[
    FileUploaderService, Depends(get_file_uploader_service)
]
