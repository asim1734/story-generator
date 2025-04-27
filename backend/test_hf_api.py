import os
from dotenv import load_dotenv
import requests
import json

from prompt_builder import build_story_prompt

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

def query_gemini(prompt, max_tokens=256, temperature=0.8):
    headers = {
        "Content-Type": "application/json"
    }
    data = {
      "contents": [{
        "parts": [{
          "text": prompt
        }]
      }],
      "generationConfig": {
        "temperature": temperature,
        "maxOutputTokens": max_tokens,
      },
    }
    response = requests.post(API_URL, headers=headers, data=json.dumps(data))
    response.raise_for_status()
    result = response.json()
    # Extract generated text:
    return result["candidates"][0]["content"]["parts"][0]["text"]

if __name__ == "__main__":
    # Test your prompt builder here
    user_prompt = "discovered a hidden power beneath the old castle walls."
    user_genre = "fantasy"
    user_style = "mysterious"
    user_character = "young wizard"

    final_prompt = build_story_prompt(
        user_prompt,
        genre=user_genre,
        style=user_style,
        character=user_character
    )
    print(f"Prompt sent to Gemini: {final_prompt}")

    try:
        story = query_gemini(final_prompt, max_tokens=256, temperature=0.8)
        print("\nGenerated story:")
        print(story)
    except Exception as e:
        print(f"Error querying Gemini API: {e}")