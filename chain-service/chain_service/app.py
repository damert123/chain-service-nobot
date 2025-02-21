from chain_service.logging import setup_logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from chain_service.controllers.__main__ import setup_controllers

setup_logging()

application = FastAPI()

application.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
)

setup_controllers(application)
