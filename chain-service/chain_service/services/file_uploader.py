from chain_service.database.models.chain import Chain
from chain_service.database.models.uploaded_file import UploadedFile
from chain_service.repositories.uploaded_file import UploadedFileRepository
from chain_service.services.audio_converter import AudioConverterService

from io import BytesIO
from loguru import logger
from httpx import AsyncClient
from planfix_client import PlanfixClient
from planfix_client.exceptions import PlanfixAPIError


class FileUploaderService:

    def __init__(
        self,
        planfix_client: PlanfixClient,
        uploaded_file_repository: UploadedFileRepository,
        audio_converter_service: AudioConverterService,
    ):
        self.client = AsyncClient()
        self.planfix_client = planfix_client
        self.uploaded_file_repository = uploaded_file_repository
        self.audio_converter_service = audio_converter_service

    async def upload_from_chain(self, chain: Chain):
        file_urls_to_upload = list()

        for action in filter(lambda a: a.action_type == "comment", chain.actions):
            file_urls_to_upload = [*file_urls_to_upload, *action.file_urls]

        for file_url in file_urls_to_upload:
            await self.upload_file_by_url(file_url)

    async def upload_file_by_url(self, file_url: str):
        try:
            uploaded_file = await self.uploaded_file_repository.get_by_file_url(
                file_url
            )

            if uploaded_file:
                return

            if file_url.endswith(".ogg") or file_url.endswith(".mp3"):
                content = await self.audio_converter_service.audio_to_ogg(
                    audio=BytesIO((await self.client.get(file_url)).read())
                )

                uploaded_file_id = await self.planfix_client.upload_file(
                    file_content=content
                )

            else:
                uploaded_file_id = await self.planfix_client.upload_file_from_url(
                    file_url
                )

            await self.uploaded_file_repository.upsert(
                UploadedFile(file_id=uploaded_file_id, file_url=file_url)
            )

        except PlanfixAPIError:
            logger.exception(f"Error while uploading to planfix {file_url=}")
