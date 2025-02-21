import boto3
from chain_service.settings import Settings

settings = Settings()

s3_client = boto3.client(
    "s3",
    aws_access_key_id=settings.s3_access_key,
    aws_secret_access_key=settings.s3_secret_access_key,
)
