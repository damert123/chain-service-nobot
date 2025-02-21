from loguru import logger
from fastapi import APIRouter, HTTPException

from chain_service.database.models.chain import Chain

from chain_service.dependencies.chain_repository import ChainRepositoryDependency
from chain_service.dependencies.namespace_repository import (
    NamespaceRepositoryDependency,
)
from chain_service.dependencies.file_uploader_service import (
    FileUploaderServiceDependency,
)

router = APIRouter(prefix="/chain")


@router.post("/")
async def chain_upsert_controller(
    chain: Chain,
    chain_repository: ChainRepositoryDependency,
    namespace_repository: NamespaceRepositoryDependency,
    file_uploader_service: FileUploaderServiceDependency,
):
    try:
        assert await namespace_repository.get_by_name(name=chain.namespace_id)
        upserted_chain = await chain_repository.upsert(chain)
        await file_uploader_service.upload_from_chain(upserted_chain)
        return upserted_chain

    except AssertionError:
        logger.exception(f"Unknown namespace_id {chain.namespace_id}")
        raise HTTPException(status_code=400, detail="Wrong namespace_id")

    except Exception:
        logger.exception(f"Error during chain upsert {chain.model_dump_json()}")
        raise HTTPException(status_code=500, detail="Error during chain upsert")


@router.get("/list")
async def chain_list_controller(
    namespace_id: str,
    chain_repository: ChainRepositoryDependency,
    namespace_repository: NamespaceRepositoryDependency,
):

    try:
        assert await namespace_repository.get_by_name(name=namespace_id)
        chains = await chain_repository.get_list(namespace_id=namespace_id)
        return chains

    except AssertionError:
        logger.exception(f"Unknown namespace_id {namespace_id}")
        raise HTTPException(status_code=400, detail="Wrong namespace_id")

    except Exception:
        logger.exception("Error during chain list")
        raise HTTPException(status_code=500, detail="Error during chain list")


@router.get("/{chain_id}")
async def chain_get_controller(
    chain_id: str, chain_repository: ChainRepositoryDependency
):
    try:
        assert (chain := await chain_repository.get_by_id(chain_id))
        return chain

    except AssertionError:
        logger.warning(f"Chain not found {chain_id}")
        raise HTTPException(status_code=404, detail="Chain not found")

    except Exception:
        logger.exception("Error during chain get")
        raise HTTPException(status_code=500, detail="Error during chain get")


@router.delete("/delete/{chain_id}")
async def chain_delete_controller(
    chain_id: str, chain_repository: ChainRepositoryDependency
):
    try:
        await chain_repository.delete_by_id(chain_id)
        return {}

    except Exception:
        logger.exception("Error during chain deletion")
        raise HTTPException(status_code=500, detail="Error during chain deletion")
