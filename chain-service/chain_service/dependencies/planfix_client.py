from planfix_client import PlanfixClient
from chain_service.settings import Settings

from fastapi import Depends
from typing import Annotated


def get_planfix_client() -> PlanfixClient:
    settings = Settings()

    return PlanfixClient(
        planfix_hostname=settings.planfix_hostname, planfix_token=settings.planfix_token
    )


PlanfixClientDependency = Annotated[PlanfixClient, Depends(get_planfix_client)]
