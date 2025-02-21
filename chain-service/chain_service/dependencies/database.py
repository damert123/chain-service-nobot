from chain_service.settings import Settings
from chain_service.database.database import Database

from fastapi import Depends
from typing import Annotated


def get_database() -> Database:
    settings = Settings()

    return Database(
        database_url=settings.database_url, database_name=settings.database_name
    )


DatabaseDependency = Annotated[Database, Depends(get_database)]
