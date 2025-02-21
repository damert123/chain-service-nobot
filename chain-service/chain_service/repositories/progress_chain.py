from chain_service.database.database import Database
from chain_service.database.models.progress_chain import ProgressChain


class ProgressChainRepository:

    def __init__(self, database: Database):
        self.collection = database.get_collection("progress_chains")

    async def upsert(self, progress_chain: ProgressChain) -> ProgressChain:
        query = {"_id": progress_chain.id}
        payload = progress_chain.model_dump(by_alias=True)
        await self.collection.replace_one(query, payload, upsert=True)
        return progress_chain
