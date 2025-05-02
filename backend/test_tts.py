#!/usr/bin/env python3
from tts_service import TTSService
import argparse

def main():
    parser = argparse.ArgumentParser(description="Test the TTS service")
    parser.add_argument("--text", "-t", type=str, default="This is a test of the Piper text to speech system.", 
                        help="Text to convert to speech")
    parser.add_argument("--output", "-o", type=str, default="test_output.wav",
                        help="Output WAV file path")
    args = parser.parse_args()
    
    print(f"Generating speech for: {args.text}")
    tts = TTSService.get_instance()
    output_path = tts.text_to_speech(args.text, output_path=args.output)
    print(f"Speech generated successfully and saved to: {output_path}")
    print(f"You can play it with: aplay {output_path}")

if __name__ == "__main__":
    main()