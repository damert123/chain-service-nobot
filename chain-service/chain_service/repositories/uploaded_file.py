from chain_service.database.database import Database
from chain_service.database.models.uploaded_file import UploadedFile


class UploadedFileRepository:

    def __init__(self, database: Database):
        self.collection = database.get_collection("uploaded_files")

    async def upsert(self, uploaded_file: UploadedFile) -> UploadedFile:
        query = {"_id": uploaded_file.id}
        payload = uploaded_file.model_dump(by_alias=True)
        await self.collection.replace_one(query, payload, upsert=True)
        return uploaded_file

    async def get_by_file_url(self, file_url: str) -> UploadedFile | None:
        query = {"fileUrl": file_url}
        uploaded_file = await self.collection.find_one(query)
        return UploadedFile.model_validate(uploaded_file) if uploaded_file else None
