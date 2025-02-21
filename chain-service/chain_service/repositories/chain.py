from loguru import logger

from uuid import UUID
from typing import List
from pydantic import TypeAdapter

from chain_service.database.database import Database
from chain_service.database.models.chain import Chain


class ChainRepository:

    def __init__(self, database: Database):
        self.collection = database.get_collection("chains")

    async def upsert(self, chain: Chain) -> Chain:
        query = {"_id": chain.id}
        payload = chain.model_dump(by_alias=True)
        await self.collection.replace_one(query, payload, upsert=True)
        return chain

    async def get_list(self, namespace_id: str) -> List[Chain]:
        # sort_order = ("lastModified", pymongo.DESCENDING)
        query = {"namespaceId": namespace_id}
        chains = [chain async for chain in self.collection.find(query)]
        return TypeAdapter(List[Chain]).validate_python(chains)

    async def get_by_id(self, chain_id: str) -> Chain | None:
        try:
            query = {"_id": UUID(chain_id)}
            chain = await self.collection.find_one(query)
            return Chain.model_validate(chain) if chain else None

        except ValueError:
            logger.error(f"Cannot convert {chain_id} to UUID")

    async def delete_by_id(self, chain_id: str):
        try:
            query = {"_id": UUID(chain_id)}
            await self.collection.delete_one(query)

        except ValueError:
            logger.error(f"Cannot convert {chain_id} to UUID")
