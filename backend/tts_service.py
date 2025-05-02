#!/usr/bin/env python3
import os
import wave
import tempfile
from piper import PiperVoice

class TTSService:
    _instance = None
    _voice = None
    
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = TTSService()
        return cls._instance
    
    def __init__(self):
        # Define the paths to the voice model files
        model_dir = os.path.expanduser("~/piper-voices")
        self.model_path = os.path.join(model_dir, "en_US-lessac-medium.onnx")
        self.model_config = os.path.join(model_dir, "en_US-lessac-medium.onnx.json")
        
        # Lazy loading - voice will be loaded on first use
        self._voice = None
    
    def _load_voice(self):
        """Load the TTS voice model if not already loaded"""
        if self._voice is None:
            print(f"Loading TTS voice model from {self.model_path}...")
            self._voice = PiperVoice.load(self.model_path, self.model_config)
            print("TTS voice model loaded successfully")
    
    def text_to_speech(self, text, output_path=None):
        """
        Convert text to speech and save as a WAV file
        
        Args:
            text (str): The text to convert to speech
            output_path (str, optional): Path to save the WAV file. If None, a temporary file is created.
            
        Returns:
            str: Path to the generated audio file
        """
        # Load the voice if not already loaded
        self._load_voice()
        
        # Use a temporary file if no output path is specified
        if output_path is None:
            temp_file = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
            output_path = temp_file.name
            temp_file.close()
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        
        # Generate the speech
        with wave.open(output_path, "wb") as wav_file:
            self._voice.synthesize(text, wav_file)
        
        return output_path