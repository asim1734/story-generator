# AI Story Generator

A full-stack web application that generates creative stories using AI. Built with **FastAPI**, **Next.js**, and **Google's Gemini API**.

---

## Features

-   **AI-Powered Stories**: Generate unique, creative stories based on your prompts.
-   **Customization Options**: Control genre, writing style, characters, and story length.
-   **Real-time Generation**: See your stories appear within seconds.
-   **Responsive Design**: Works on desktop and mobile devices.
-   **Audio Narration**: Generate audio narration for your stories using **Piper TTS**.

---

## Tech Stack

### Backend

-   **FastAPI**: High-performance Python web framework.
-   **Google Gemini API**: State-of-the-art large language model for creative text generation.
-   **Piper TTS**: Text-to-speech engine for generating audio narration.
-   **Python 3.10+**: Modern Python for robust server-side code.

### Frontend

-   **Next.js**: React framework with App Router for simplified routing and server components.
-   **TypeScript**: Type-safe JavaScript for better developer experience.
-   **Tailwind CSS**: Utility-first CSS framework for responsive design.
-   **React Select**: Enhanced select input components.

---

## Getting Started

### Prerequisites

-   **Python 3.10 or higher**
-   **Node.js 18 or higher**
-   **Google Gemini API key**
-   **Piper TTS voice model**: Download and place the voice model files in `~/piper-voices`.

---

### Backend Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/story-generator.git
    cd story-generator
    ```

2. Set up the Python virtual environment:

    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

4. Create a `.env` file with your Gemini API key:

    ```bash
    echo "GEMINI_API_KEY=your_api_key_here" > .env
    ```

5. Ensure the Piper TTS voice model is downloaded and placed in `~/piper-voices`. Update the paths in `tts_service.py` if necessary.

6. Start the backend server:
    ```bash
    chmod +x run.sh
    ./run.sh
    ```
    The API will be available at [http://localhost:8000](http://localhost:8000).

---

### Frontend Setup

1. Install dependencies:

    ```bash
    cd ../frontend
    npm install
    ```

2. Start the development server:
    ```bash
    npm run dev
    ```
    The app will be available at [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

### POST `/generate-story`

Generate a story with the following parameters:

-   **[prompt]** (string, required): The main story idea.
-   **[genre]** (string, optional): Genre of the story.
-   **[style]** (string, optional): Writing style.
-   **[character]** (string, optional): Main character.
-   **[story_length]** (string, optional): `"short"`, `"medium"`, or `"long"`.
-   **[temperature]** (number, optional): Creativity level (0.1–1.5).
-   **[include_dialogue]** (boolean, optional): Whether to include dialogue.
-   **[include_description]** (boolean, optional): Whether to include detailed descriptions.
-   **[generate_audio]**(boolean, optional): Whether to generate audio narration for the story.

### POST `/tts`

Generate audio narration for a given text:

-   **[text](http://_vscodecontentref_/9)** (string, required): The text to convert to speech.

### GET `/health`

Health check endpoint.

---

## Usage

1. Open the web application at `http://localhost:3000`
2. Enter a story prompt
3. Select optional parameters like genre, style, and story length
4. Click "Generate Story"
5. Read and enjoy your generated story!
6. Use the "Copy Story" button to save your creation

---

## Development

### Adding New Features

-   **Backend**: Extend the `main.py` and `prompt_builder.py` files
-   **Frontend**: Add or modify components in the components directory

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.
