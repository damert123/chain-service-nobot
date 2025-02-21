from chain_service.services.audio_converter import AudioConverterService

from fastapi import Depends
from typing import Annotated


def get_audio_converter_service() -> AudioConverterService:
    return AudioConverterService()


AudioConverterServiceDependency = Annotated[
    AudioConverterService, Depends(get_audio_converter_service)
]
