import os
from dotenv import load_dotenv
import requests
import json

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from prompt_builder import build_story_prompt

# ----- Setup -----
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

# ----- FastAPI app -----
app = FastAPI()

# Define the request body model
class StoryRequest(BaseModel):
    prompt: str
    genre: str = None
    style: str = None
    character: str = None
    max_tokens: int = 256
    temperature: float = 0.8

@app.post("/generate-story")
def generate_story(story_req: StoryRequest):
    final_prompt = build_story_prompt(
        story_req.prompt,
        genre=story_req.genre,
        style=story_req.style,
        character=story_req.character
    )

    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": final_prompt}]}],
        "generationConfig": {
            "temperature": story_req.temperature,
            "maxOutputTokens": story_req.max_tokens,
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