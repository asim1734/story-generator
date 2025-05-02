import os
from dotenv import load_dotenv
import requests
import json
import uuid
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from prompt_builder import build_story_prompt
from tts_service import TTSService

# ----- Setup -----
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

# Create audio directory
AUDIO_DIR = Path("./audio_files")
AUDIO_DIR.mkdir(exist_ok=True)

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

# Mount the audio directory
app.mount("/audio", StaticFiles(directory=AUDIO_DIR), name="audio")

# Initialize the TTS service
tts_service = TTSService.get_instance()

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
    generate_audio: bool = False

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
        
        response_data = {"story": story, "prompt_used": final_prompt}
        
        # Generate audio if requested
        if story_req.generate_audio:
            # Create a unique filename for this story
            audio_filename = f"story_{uuid.uuid4()}.wav"
            audio_path = AUDIO_DIR / audio_filename
            
            # Generate the audio file
            tts_service.text_to_speech(story, output_path=str(audio_path))
            
            # Add the audio URL to the response
            audio_url = f"/audio/{audio_filename}"
            response_data["audio_url"] = audio_url
        
        return response_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/tts/{text}")
def text_to_speech(text: str):
    """Generate speech from text and return the audio file"""
    try:
        # Create a unique filename
        audio_filename = f"tts_{uuid.uuid4()}.wav"
        audio_path = AUDIO_DIR / audio_filename
        
        # Generate the audio file
        tts_service.text_to_speech(text, output_path=str(audio_path))
        
        # Return the audio file
        return FileResponse(
            path=str(audio_path), 
            media_type="audio/wav", 
            filename=audio_filename
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add a health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}