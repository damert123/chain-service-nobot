FROM python:3.12-alpine as base
WORKDIR /app/

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

ARG POETRY_USERNAME
ARG POETRY_PASSWORD

RUN apk add --update --virtual .build-deps \
    build-base \
    python3-dev \
    libpq \
    gcc \
    libffi-dev

RUN pip install poetry
COPY pyproject.toml poetry.lock* /app/

RUN poetry config virtualenvs.create false
RUN poetry config http-basic.gitlab ${POETRY_USERNAME} ${POETRY_PASSWORD}
RUN poetry install --without dev --no-interaction --no-ansi


FROM python:3.12-alpine

EXPOSE 8010
WORKDIR /app/

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONPATH /app:$PYTHONPATH

RUN apk add --update --no-cache libpq ffmpeg

COPY --from=base /usr/local/bin/ /usr/local/bin/
COPY --from=base /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/

COPY . .

CMD [ "sh", "./start.sh" ]
