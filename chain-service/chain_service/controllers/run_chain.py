from chain_service.schema.run_chain import RunChainInput, AbortChainInput

from chain_service.dependencies.chain_repository import ChainRepositoryDependency

from chain_service.dependencies.progress_chain_repository import (
    ProgressChainRepositoryDependency,
)

from chain_service.dependencies.progress_chain_runner_service import (
    ProgressChainRunnerServiceDependency,
)

from chain_service.dependencies.running_chain_repository import (
    RunningChainRepositoryDependency,
)

from chain_service.database.models.progress_chain import ProgressChain

import asyncio
from loguru import logger
from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.post("/run_chain")
async def run_chain_controller(
    run_chain_input: RunChainInput,
    chain_repository: ChainRepositoryDependency,
    progress_chain_repository: ProgressChainRepositoryDependency,
    progress_chain_runner_service: ProgressChainRunnerServiceDependency,
    running_chain_repository: RunningChainRepositoryDependency,
):
    try:
        assert (chain := await chain_repository.get_by_id(run_chain_input.chain_id))

        if await running_chain_repository.exists(str(run_chain_input.task_id)):
            logger.error(f"Chain {chain.id} is already running")
            raise HTTPException(status_code=409, detail="Chain is already running")

        progress_chain = ProgressChain.create_from_chain(
            chain=chain,
            task_id=run_chain_input.task_id,
            recipients=run_chain_input.recipients,
            variables=run_chain_input.variables,
        )

        progress_chain = await progress_chain_repository.upsert(progress_chain)

        await running_chain_repository.add(
            task_id=str(progress_chain.task_id),
            progress_chain_id=str(progress_chain.id),
        )

        await asyncio.create_task(progress_chain_runner_service.process(progress_chain))
        return {}

    except AssertionError:
        logger.warning(f"Chain not found {run_chain_input.chain_id}")
        raise HTTPException(status_code=404, detail="Chain not found")

    except HTTPException:
        raise

    except Exception:
        logger.exception("Error during run chain")
        raise HTTPException(status_code=500, detail="Error during run chain")


@router.post("/abort_chain")
async def abort_chain_controller(
    abort_chain_input: AbortChainInput,
    running_chain_repository: RunningChainRepositoryDependency,
):
    try:
        assert await running_chain_repository.exists(str(abort_chain_input.task_id))
        await running_chain_repository.delete(str(abort_chain_input.task_id))
        return {}

    except AssertionError:
        logger.warning("Cannot abort a chain that isn't running")

    except Exception:
        logger.exception("Error during chain abortion")
        raise HTTPException(status_code=400, detail="Chain abortion error :)")


@router.post("/abort_all_chains")
async def abort_all_chains_controller(
    running_chain_repository: RunningChainRepositoryDependency,
):
    try:
        await running_chain_repository.delete_all()
        return {}

    except Exception:
        logger.exception("Error during all chains abortion")
        raise HTTPException(status_code=400, detail="Chains abortion error :)")
