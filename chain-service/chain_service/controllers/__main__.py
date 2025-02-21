from .chain import router as chain_router
from .run_chain import router as run_chain_router
from .s3 import router as s3_router
from .namespace import router as namespace_router

from fastapi import FastAPI, APIRouter


def setup_controllers(application: FastAPI):
    router = APIRouter(prefix="/api")

    router.include_router(chain_router)
    router.include_router(run_chain_router)
    router.include_router(s3_router)
    router.include_router(namespace_router)

    application.include_router(router)
