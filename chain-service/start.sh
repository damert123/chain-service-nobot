#! /bin/sh

exec uvicorn chain_service.app:application --host 0.0.0.0 --port 8010
