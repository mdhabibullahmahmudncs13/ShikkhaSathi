"""
Voice Learning Service for ShikkhaSathi
Handles speech-to-text and text-to-speech functionality
"""

import os
import asyncio
import aiofiles
import aiohttp
from typing import Optional, Dict, Any
from pathlib import Path
import tempfile
import uuid
from app.core.config import settings

class VoiceService:
    """Service for handling voice input/output operations"""
    
    def __init__(self):
        self.whisper_api_key = settings.OPENAI_API_KEY
        self.elevenlabs_api_key = getattr(settings, 'ELEVENLABS_API_KEY', None)
        self.audio_storage_path = Path("data/audio")
        self.audio_storage_path.mkdir(parents=True, exist_ok=True)
        
        # Supported languages
        self.supported_languages = {
            'bn': 'Bengali',
            'en': 'English'
        }
        
        # ElevenLabs voice IDs (you'll need to get these from ElevenLabs)
        self.voice_ids = {
            'en': 'EXAVITQu4vr4xnSDxMaL',  # Default English voice
            'bn': 'EXAVITQu4vr4xnSDxMaL'   # For now, use same voice (can be changed)
        }
    
    async def speech_to_text(
        self, 
        audio_file_path: str, 
        language: str = 'auto'
    ) -> Dict[str, Any]:
        """
        Convert speech to text using OpenAI Whisper API
        
        Args:
            audio_file_path: Path to the audio file
            language: Language code ('bn', 'en', or 'auto' for detection)
            
        Returns:
            Dict with transcribed text and detected language
        """
        try:
            if not self.whisper_api_key:
                raise ValueError("OpenAI API key not configured")
            
            # Read audio file
            async with aiofiles.open(audio_file_path, 'rb') as audio_file:
                audio_data = await audio_file.read()
            
            # Prepare request to Whisper API
            url = "https://api.openai.com/v1/audio/transcriptions"
            headers = {
                "Authorization": f"Bearer {self.whisper_api_key}"
            }
            
            # Create form data
            data = aiohttp.FormData()
            data.add_field('file', audio_data, filename='audio.wav', content_type='audio/wav')
            data.add_field('model', 'whisper-1')
            
            if language != 'auto' and language in self.supported_languages:
                # Map our language codes to Whisper language codes
                whisper_lang = 'bn' if language == 'bn' else 'en'
                data.add_field('language', whisper_lang)
            
            data.add_field('response_format', 'json')
            
            # Make API request
            async with aiohttp.ClientSession() as session:
                async with session.post(url, headers=headers, data=data) as response:
                    if response.status == 200:
                        result = await response.json()
                        
                        # Detect language if not specified
                        detected_language = self._detect_language(result.get('text', ''))
                        
                        return {
                            'success': True,
                            'text': result.get('text', ''),
                            'language': detected_language,
                            'confidence': 1.0  # Whisper doesn't provide confidence scores
                        }
                    else:
                        error_text = await response.text()
                        return {
                            'success': False,
                            'error': f"Whisper API error: {response.status} - {error_text}"
                        }
                        
        except Exception as e:
            return {
                'success': False,
                'error': f"Speech-to-text error: {str(e)}"
            }
    
    async def text_to_speech(
        self, 
        text: str, 
        language: str = 'en',
        voice_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Convert text to speech using ElevenLabs API
        
        Args:
            text: Text to convert to speech
            language: Language code ('bn' or 'en')
            voice_id: Specific voice ID (optional)
            
        Returns:
            Dict with audio file path and metadata
        """
        try:
            if not self.elevenlabs_api_key:
                # Fallback: Return text without audio
                return {
                    'success': True,
                    'audio_path': None,
                    'text': text,
                    'language': language,
                    'fallback': True,
                    'message': 'ElevenLabs API not configured, text-only response'
                }
            
            # Select voice
            selected_voice_id = voice_id or self.voice_ids.get(language, self.voice_ids['en'])
            
            # Prepare request to ElevenLabs API
            url = f"https://api.elevenlabs.io/v1/text-to-speech/{selected_voice_id}"
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": self.elevenlabs_api_key
            }
            
            payload = {
                "text": text,
                "model_id": "eleven_multilingual_v2",  # Supports multiple languages
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.5
                }
            }
            
            # Make API request
            async with aiohttp.ClientSession() as session:
                async with session.post(url, headers=headers, json=payload) as response:
                    if response.status == 200:
                        # Generate unique filename
                        audio_id = str(uuid.uuid4())
                        audio_filename = f"{audio_id}.mp3"
                        audio_path = self.audio_storage_path / audio_filename
                        
                        # Save audio file
                        audio_data = await response.read()
                        async with aiofiles.open(audio_path, 'wb') as audio_file:
                            await audio_file.write(audio_data)
                        
                        return {
                            'success': True,
                            'audio_path': str(audio_path),
                            'audio_id': audio_id,
                            'audio_url': f"/api/v1/voice/audio/{audio_id}",
                            'text': text,
                            'language': language,
                            'voice_id': selected_voice_id
                        }
                    else:
                        error_text = await response.text()
                        return {
                            'success': False,
                            'error': f"ElevenLabs API error: {response.status} - {error_text}"
                        }
                        
        except Exception as e:
            return {
                'success': False,
                'error': f"Text-to-speech error: {str(e)}"
            }
    
    def _detect_language(self, text: str) -> str:
        """
        Simple language detection based on character patterns
        
        Args:
            text: Text to analyze
            
        Returns:
            Language code ('bn' or 'en')
        """
        if not text:
            return 'en'
        
        # Count Bengali characters (Unicode range for Bengali)
        bengali_chars = sum(1 for char in text if '\u0980' <= char <= '\u09FF')
        total_chars = len([char for char in text if char.isalpha()])
        
        if total_chars == 0:
            return 'en'
        
        # If more than 30% Bengali characters, consider it Bengali
        bengali_ratio = bengali_chars / total_chars
        return 'bn' if bengali_ratio > 0.3 else 'en'
    
    async def get_audio_file(self, audio_id: str) -> Optional[str]:
        """
        Get audio file path by ID
        
        Args:
            audio_id: Audio file ID
            
        Returns:
            File path if exists, None otherwise
        """
        audio_path = self.audio_storage_path / f"{audio_id}.mp3"
        return str(audio_path) if audio_path.exists() else None
    
    async def cleanup_old_audio_files(self, max_age_hours: int = 24):
        """
        Clean up old audio files to save storage space
        
        Args:
            max_age_hours: Maximum age of files to keep (in hours)
        """
        try:
            import time
            current_time = time.time()
            max_age_seconds = max_age_hours * 3600
            
            for audio_file in self.audio_storage_path.glob("*.mp3"):
                file_age = current_time - audio_file.stat().st_mtime
                if file_age > max_age_seconds:
                    audio_file.unlink()
                    
        except Exception as e:
            print(f"Error cleaning up audio files: {e}")
    
    def get_supported_languages(self) -> Dict[str, str]:
        """Get list of supported languages"""
        return self.supported_languages.copy()
    
    def get_available_voices(self) -> Dict[str, str]:
        """Get list of available voice IDs"""
        return self.voice_ids.copy()

# Global service instance
voice_service = VoiceService()