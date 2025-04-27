import os
from dotenv import load_dotenv
import requests
import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from prompt_builder import build_story_prompt

# ----- Setup -----
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

# ----- FastAPI app -----
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the request body model
class StoryRequest(BaseModel):
    prompt: str
    genre: str = None
    style: str = None
    character: str = None
    story_length: str = "medium"  # "short", "medium", or "long"
    temperature: float = 0.8
    include_dialogue: bool = True
    include_description: bool = True

@app.post("/generate-story")
def generate_story(story_req: StoryRequest):
    # Map story length to token counts
    length_to_tokens = {
        "short": 700,
        "medium": 1200,
        "long": 2200
    }
    max_tokens = length_to_tokens.get(story_req.story_length, 1000)

    final_prompt = build_story_prompt(
        story_req.prompt,
        genre=story_req.genre,
        style=story_req.style,
        character=story_req.character,
        include_dialogue=story_req.include_dialogue,
        include_description=story_req.include_description,
        story_length=story_req.story_length
    )

    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": final_prompt}]}],
        "generationConfig": {
            "temperature": story_req.temperature,
            "maxOutputTokens": max_tokens,
        },
    }
    try:
        response = requests.post(API_URL, headers=headers, data=json.dumps(data))
        response.raise_for_status()
        result = response.json()
        story = result["candidates"][0]["content"]["parts"][0]["text"]
        return {"story": story, "prompt_used": final_prompt}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add a health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}
