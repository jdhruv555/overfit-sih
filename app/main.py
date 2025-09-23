from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import router as api_router


def create_app() -> FastAPI:
    application = FastAPI(title="Defence Cyber Incident & Safety Portal - API")

    # CORS to allow frontend to call backend via browser
    application.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost",
            "http://localhost:80",
            "http://localhost:3000",
            "http://127.0.0.1",
            "http://127.0.0.1:3000",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @application.get("/health")
    def health() -> dict:
        return {"status": "ok"}

    # Mount application API under /api/v1 to align with nginx and frontend
    application.include_router(api_router, prefix="/api/v1")

    return application


app = create_app()


