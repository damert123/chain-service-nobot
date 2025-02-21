from chain_service.utils.sync_to_async import sync_to_async

import os
import ffmpeg
import aiofiles
from uuid import uuid4
from io import BytesIO


class AudioConverterService:

    @sync_to_async
    def __audio_to_ogg(self, audio: BytesIO) -> str:
        filename = f"./audios/{uuid4()}.ogg"

        process = (
            ffmpeg.input("pipe:")
            .output(filename, codec="libopus", loglevel="quiet")
            .overwrite_output()
            .run_async(pipe_stdin=True)
        )

        process.communicate(input=audio.getbuffer())
        return filename

    async def audio_to_ogg(self, audio: BytesIO) -> BytesIO:
        filename = await self.__audio_to_ogg(audio)

        async with aiofiles.open(filename, "rb") as file:
            content = BytesIO(initial_bytes=await file.read())

        os.remove(filename)
        return content
