from .progress_action.factory import ProgressActionServiceFactory

from chain_service.database.models.progress_chain import (
    ProgressChain,
    BaseProgressAction,
    ProgressActionStatusEnum,
)

from chain_service.repositories.progress_chain import ProgressChainRepository
from chain_service.repositories.running_chain import RunningChainRepository

from loguru import logger
from datetime import datetime


class ProgressChainRunnerService:

    def __init__(
        self,
        progress_chain_repository: ProgressChainRepository,
        progress_action_service_factory: ProgressActionServiceFactory,
        running_chain_repository: RunningChainRepository,
    ):
        self.progress_chain_repository = progress_chain_repository
        self.progress_action_service_factory = progress_action_service_factory
        self.running_chain_repository = running_chain_repository

    async def process(self, progress_chain: ProgressChain):

        if progress_chain.is_finished or progress_chain.has_failed:
            logger.info(f"Skipping ProgressChain {progress_chain.id}")
            return

        for progress_action in progress_chain.actions:

            if progress_action.status is ProgressActionStatusEnum.DONE:
                continue

            if not await self.process_action(progress_chain, progress_action):
                break

        await self.running_chain_repository.delete(
            task_id=str(progress_chain.task_id),
            progress_chain_id=str(progress_chain.id),
        )

    async def process_action(
        self, progress_chain: ProgressChain, progress_action: BaseProgressAction
    ):

        try:
            progress_action.started_at = datetime.utcnow()

            progress_action_service = self.progress_action_service_factory(
                progress_chain=progress_chain, progress_action=progress_action
            )

            await progress_action_service.process()

            assert await self.running_chain_repository.exists(
                task_id=str(progress_chain.task_id),
                progress_chain_id=str(progress_chain.id),
            )

            progress_action.status = ProgressActionStatusEnum.DONE
            return True

        except AssertionError:
            logger.info(f"Chain was aborted {progress_chain.chain_id}")
            progress_action.status = ProgressActionStatusEnum.ABORTED
            return False

        except Exception as error:
            logger.exception(f"Error during action process for {progress_chain.id}")
            progress_action.status = ProgressActionStatusEnum.FAILED
            progress_action.error_text = str(error)
            return False

        finally:
            progress_action.finished_at = datetime.utcnow()
            await self.progress_chain_repository.upsert(progress_chain)
