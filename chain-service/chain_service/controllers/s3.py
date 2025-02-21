from chain_service.s3 import s3_client
from chain_service.settings import Settings

from io import BytesIO
from uuid import uuid4
from loguru import logger
from fastapi import APIRouter, HTTPException, UploadFile

router = APIRouter()


@router.post("/s3")
async def s3_controller(file: UploadFile):
    try:
        filename = f'{uuid4()}.{file.filename.split(".")[-1]}'

        upload_file_bucket = Settings().s3_upload_file_bucket
        upload_file_key = f"files/{filename}"

        s3_client.upload_fileobj(
            BytesIO(await file.read()), upload_file_bucket, upload_file_key
        )

        return {"url": Settings().s3_public_url + upload_file_key}

    except Exception:
        logger.exception("Error during s3 upload")
        raise HTTPException(status_code=500, detail="Cannot upload")
