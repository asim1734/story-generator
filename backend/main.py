import os
import uuid
import json
import random
from dotenv import load_dotenv
import requests
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from prompt_builder import build_story_prompt
from tts_service import TTSService

# ----- Setup -----
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

# Directory setup
AUDIO_DIR = Path("./audio_files")
AUDIO_DIR.mkdir(exist_ok=True)

SAMPLES_DIR = Path("./samples")
SAMPLE_STORIES_DIR = SAMPLES_DIR / "stories"
SAMPLE_AUDIO_DIR = SAMPLES_DIR / "audio"

# Ensure sample directories exist
SAMPLE_STORIES_DIR.mkdir(parents=True, exist_ok=True)
SAMPLE_AUDIO_DIR.mkdir(parents=True, exist_ok=True)

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

# Mount static directories
app.mount("/audio", StaticFiles(directory=AUDIO_DIR), name="audio")
app.mount("/samples/audio", StaticFiles(directory=SAMPLE_AUDIO_DIR), name="sample_audio")

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

class TTSRequest(BaseModel):
    text: str

# ----- Endpoints -----
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
        # Try to connect to the API
        response = requests.post(API_URL, headers=headers, data=json.dumps(data), timeout=10)
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
    
    except (requests.RequestException, Exception) as e:
        print(f"API error: {str(e)}. Falling back to sample story.")
        
        # Fall back to a sample story
        fallback_story = get_random_sample_story()
        if fallback_story:
            return fallback_story
        
        # If no fallback available, raise the error
        raise HTTPException(status_code=500, detail=f"Failed to generate story and no fallback available: {str(e)}")
  
# ----- Helper Functions -----
def get_random_sample_story():
    """Get a random sample story for fallback"""
    story_files = list(SAMPLE_STORIES_DIR.glob("*.txt"))
    if not story_files:
        return None
    
    # Pick a random story file
    random_story_file = random.choice(story_files)
    story_id = random_story_file.stem
    
    # Read the story content
    with open(random_story_file, "r", encoding="utf-8") as f:
        story_content = f.read()
    
    # Check if corresponding audio exists
    audio_file = SAMPLE_AUDIO_DIR / f"{story_id}.wav"
    has_audio = audio_file.exists()
    
    result = {
        "story": story_content,
        "is_fallback": True,
        "fallback_reason": "API connection failed or offline mode"
    }
    
    if has_audio:
        result["audio_url"] = f"/samples/audio/{story_id}.wav"
    
    return result

# Add a health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}