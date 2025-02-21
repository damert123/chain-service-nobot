from chain_service.database.database import Database
from chain_service.database.models.namespace import Namespace

from uuid import UUID
from loguru import logger


class NamespaceRepository:

    def __init__(self, database: Database):
        self.collection = database.get_collection("namespaces")

    async def upsert(self, namespace: Namespace) -> Namespace:
        query = {"_id": namespace.id}
        payload = namespace.model_dump(by_alias=True)
        await self.collection.replace_one(query, payload, upsert=True)
        return namespace

    async def get_by_id(self, namespace_id: str) -> Namespace | None:
        try:
            query = {"_id": UUID(namespace_id)}
            namespace = await self.collection.find_one(query)
            return Namespace.model_validate(namespace) if namespace else None

        except ValueError:
            logger.error(f"Cannot convert {namespace_id} to UUID")

    async def get_by_name(self, name: str) -> Namespace | None:
        query = {"name": name}
        namespace = await self.collection.find_one(query)
        return Namespace.model_validate(namespace) if namespace else None
