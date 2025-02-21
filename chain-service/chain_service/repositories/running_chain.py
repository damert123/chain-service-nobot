from chain_service.database.database import Database


class RunningChainRepository:

    def __init__(self, database: Database):
        self.collection = database.get_collection("running_chains")

    async def add(self, task_id: str, progress_chain_id: str):
        query = {"taskId": task_id}
        payload = {"taskId": task_id, "progressChainId": progress_chain_id}
        await self.collection.replace_one(query, payload, upsert=True)

    async def exists(self, task_id: str, progress_chain_id: str = None) -> bool:
        query = {"taskId": task_id}

        if progress_chain_id:
            query = {"progressChainId": progress_chain_id}

        return bool(await self.collection.find_one(query))

    async def delete(self, task_id: str, progress_chain_id: str = None) -> bool:
        query = {"taskId": task_id}

        if progress_chain_id:
            query = {"progressChainId": progress_chain_id}

        await self.collection.delete_one(query)

    async def delete_all(self):
        await self.collection.delete_many({})
