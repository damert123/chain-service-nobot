from .base import BaseMongoModel


class UploadedFile(BaseMongoModel):
    file_id: int
    file_url: str
