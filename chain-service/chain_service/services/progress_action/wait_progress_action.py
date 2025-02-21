import asyncio
from .base import BaseProgressActionService


class WaitProgressActionService(BaseProgressActionService):

    async def process(self):
        await asyncio.sleep(self.progress_action.wait_for)
