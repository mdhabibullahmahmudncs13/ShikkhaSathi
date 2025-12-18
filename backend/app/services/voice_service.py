import os
import tempfile
import logging
from typing import Optional, Dict, Any
import openai
import requests
from app.core.config import settings

logger = logging.getLogger(__name__)

class VoiceService:
    def __init__(self):
        # Initialize OpenAI client only if API key is available
        openai_api_key = getattr(settings, 'OPENAI_API_KEY', None)
        if openai_api_key:
            self.openai_client = openai.OpenAI(api_key=openai_api_key)
        else:
            self.openai_client = None
            
        self.elevenlabs_api_key = getattr(settings, 'ELEVENLABS_API_KEY', None)
        self.elevenlabs_voice_id = getattr(settings, 'ELEVENLABS_VOICE_ID', '21m00Tcm4TlvDq8ikWAM')  # Default voice
        
    async def speech_to_text(self, audio_data: bytes, language: str = "bn") -> Dict[str, Any]:
        """
        Convert speech to text using OpenAI Whisper API
        
        Args:
            audio_data: Audio file bytes
            language: Language code (bn for Bangla, en for English)
            
        Returns:
            Dict containing transcribed text and confidence
        """
        try:
            if not self.openai_client:
                return {
                    "success": False,
                    "error": "OpenAI API key not configured",
                    "text": "",
                    "confidence": 0.0
                }
            # Create temporary file for audio data
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
                temp_audio.write(audio_data)
                temp_audio_path = temp_audio.name

            try:
                # Use OpenAI Whisper API for transcription
                with open(temp_audio_path, "rb") as audio_file:
                    transcript = self.openai_client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_file,
                        language=language,
                        response_format="verbose_json"
                    )
                
                return {
                    "success": True,
                    "text": transcript.text,
                    "language": transcript.language,
                    "duration": getattr(transcript, 'duration', None),
                    "confidence": 0.95  # Whisper doesn't provide confidence, using default high value
                }
                
            finally:
                # Clean up temporary file
                if os.path.exists(temp_audio_path):
                    os.unlink(temp_audio_path)
                    
        except Exception as e:
            logger.error(f"Error in speech-to-text conversion: {e}")
            return {
                "success": False,
                "error": str(e),
                "text": "",
                "confidence": 0.0
            }

    async def text_to_speech(self, text: str, language: str = "bn") -> Dict[str, Any]:
        """
        Convert text to speech using ElevenLabs API
        
        Args:
            text: Text to convert to speech
            language: Language code (bn for Bangla, en for English)
            
        Returns:
            Dict containing audio data and metadata
        """
        try:
            if not self.elevenlabs_api_key:
                # Fallback: return empty audio data with message
                return {
                    "success": False,
                    "error": "ElevenLabs API key not configured",
                    "audio_data": None,
                    "content_type": "audio/mpeg"
                }

            # ElevenLabs API endpoint
            url = f"https://api.elevenlabs.io/v1/text-to-speech/{self.elevenlabs_voice_id}"
            
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": self.elevenlabs_api_key
            }
            
            # Prepare request data
            data = {
                "text": text,
                "model_id": "eleven_multilingual_v2",  # Supports multiple languages including Bangla
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.5,
                    "style": 0.0,
                    "use_speaker_boost": True
                }
            }
            
            # Make request to ElevenLabs API
            response = requests.post(url, json=data, headers=headers, timeout=30)
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "audio_data": response.content,
                    "content_type": "audio/mpeg",
                    "text": text,
                    "language": language
                }
            else:
                logger.error(f"ElevenLabs API error: {response.status_code} - {response.text}")
                return {
                    "success": False,
                    "error": f"ElevenLabs API error: {response.status_code}",
                    "audio_data": None,
                    "content_type": "audio/mpeg"
                }
                
        except Exception as e:
            logger.error(f"Error in text-to-speech conversion: {e}")
            return {
                "success": False,
                "error": str(e),
                "audio_data": None,
                "content_type": "audio/mpeg"
            }

    def detect_language(self, text: str) -> str:
        """
        Simple language detection for Bangla vs English
        
        Args:
            text: Text to analyze
            
        Returns:
            Language code ('bn' or 'en')
        """
        try:
            # Count Bangla Unicode characters
            bangla_chars = sum(1 for char in text if '\u0980' <= char <= '\u09FF')
            total_chars = len([char for char in text if char.isalpha()])
            
            if total_chars == 0:
                return 'en'  # Default to English if no alphabetic characters
            
            # If more than 30% of characters are Bangla, consider it Bangla text
            bangla_ratio = bangla_chars / total_chars
            return 'bn' if bangla_ratio > 0.3 else 'en'
            
        except Exception as e:
            logger.error(f"Error in language detection: {e}")
            return 'en'  # Default to English on error

    async def process_voice_message(self, audio_data: bytes) -> Dict[str, Any]:
        """
        Complete voice message processing: speech-to-text with language detection
        
        Args:
            audio_data: Audio file bytes
            
        Returns:
            Dict containing transcribed text and detected language
        """
        try:
            # First, try to transcribe without specifying language (auto-detect)
            result = await self.speech_to_text(audio_data, language=None)
            
            if result["success"]:
                # Detect language from transcribed text
                detected_language = self.detect_language(result["text"])
                result["detected_language"] = detected_language
                
                # If confidence is low or language detection suggests different language,
                # retry with specific language
                if result.get("confidence", 0) < 0.8:
                    if detected_language == 'bn':
                        retry_result = await self.speech_to_text(audio_data, language="bn")
                        if retry_result["success"] and len(retry_result["text"]) > len(result["text"]):
                            result = retry_result
                            result["detected_language"] = detected_language
            
            return result
            
        except Exception as e:
            logger.error(f"Error in voice message processing: {e}")
            return {
                "success": False,
                "error": str(e),
                "text": "",
                "detected_language": "en"
            }

# Global voice service instance - initialized when needed
voice_service = None

def get_voice_service():
    """Get or create voice service instance"""
    global voice_service
    if voice_service is None:
        voice_service = VoiceService()
    return voice_service