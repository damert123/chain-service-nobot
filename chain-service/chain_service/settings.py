from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    database_name: Optional[str] = "chain-db"
    planfix_hostname: str
    planfix_token: str
    s3_access_key: str
    s3_secret_access_key: str
    s3_upload_file_bucket: str
    s3_public_url: str

    model_config = SettingsConfigDict(env_file=".env")
