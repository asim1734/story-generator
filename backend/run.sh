#!/bin/bash

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Check if main.py exists, otherwise try story_api.py
if [ -f "main.py" ]; then
    echo "Starting FastAPI server with main.py..."
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
fi
