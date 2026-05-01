from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from dotenv import load_dotenv  # <-- Add this
load_dotenv()  # <-- Add this (loads the .env file)
app = FastAPI()

# Tell FastAPI to trust requests coming from your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://studyreels-three.vercel.app",
        "https://studyreels-110xyn2i0-umar-hussains-projects-b7546bc7.vercel.app",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CRITICAL: Ensure app.include_router(router) comes AFTER the middleware
app.include_router(router)