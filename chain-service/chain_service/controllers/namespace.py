from loguru import logger
from fastapi import APIRouter, HTTPException

from chain_service.database.models.namespace import Namespace

from chain_service.dependencies.namespace_repository import (
    NamespaceRepositoryDependency,
)

router = APIRouter(prefix="/namespace")


@router.post("/")
async def namespace_controller(
    namespace: Namespace, namespace_repository: NamespaceRepositoryDependency
):
    try:
        upserted_namespace = await namespace_repository.upsert(namespace)
        return upserted_namespace

    except Exception:
        logger.exception(f"Error during namespace upsert {namespace.model_dump_json()}")
        raise HTTPException(status_code=500, detail="Error during namespace upsert")


@router.get("/{namespace_name}")
async def namespace_get_by_name_controller(
    namespace_name: str, namespace_repository: NamespaceRepositoryDependency
):
    try:
        assert (namespace := await namespace_repository.get_by_name(namespace_name))
        return namespace

    except AssertionError:
        logger.warning(f"Namespace not found {namespace_name}")
        raise HTTPException(status_code=404, detail="Namespace not found")

    except Exception:
        logger.exception("Error during chain get")
        raise HTTPException(status_code=500, detail="Error during namespace get")
