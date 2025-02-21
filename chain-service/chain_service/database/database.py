from motor.motor_asyncio import AsyncIOMotorClient


class Database:

    def __init__(self, database_url: str, database_name: str):
        self.client = AsyncIOMotorClient(database_url, uuidRepresentation="standard")
        self.database = self.client[database_name]

    def get_collection(self, collection_name: str):
        return self.database[collection_name]
