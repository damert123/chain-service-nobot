import asyncio
from functools import wraps
from typing import Callable, Tuple, Dict


def sync_to_async(function: Callable):

    @wraps(function)
    async def wrapper(*args: Tuple, **kwargs: Dict):
        return await asyncio.to_thread(function, *args, **kwargs)

    return wrapper
