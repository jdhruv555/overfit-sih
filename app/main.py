from fastapi import FastAPI
from .api import router as api_router


def create_app() -> FastAPI:
    application = FastAPI(title="Defence Cyber Incident & Safety Portal - API")

    @application.get("/health")
    def health() -> dict:
        return {"status": "ok"}

    application.include_router(api_router)

    return application


app = create_app()


