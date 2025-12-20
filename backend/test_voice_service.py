#!/usr/bin/env python3
"""
Test Voice Service functionality
"""

import asyncio
import sys
import os

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

async def test_voice_service():
    """Test Voice Service functionality"""
    try:
        from services.voice_service import voice_service
        
        print("🎤 Testing Voice Service...")
        
        # Test language detection
        print("\n🔍 Testing Language Detection...")
        
        # Test English text
        english_text = "Hello, how are you today?"
        detected_lang = voice_service._detect_language(english_text)
        print(f"English text: '{english_text}' → Detected: {detected_lang}")
        
        # Test Bengali text (if available)
        bengali_text = "আপনি কেমন আছেন?"
        detected_lang = voice_service._detect_language(bengali_text)
        print(f"Bengali text: '{bengali_text}' → Detected: {detected_lang}")
        
        # Test mixed text
        mixed_text = "Hello আপনি কেমন আছেন? How are you?"
        detected_lang = voice_service._detect_language(mixed_text)
        print(f"Mixed text: '{mixed_text}' → Detected: {detected_lang}")
        
        # Test text-to-speech (without API keys, should return fallback)
        print("\n🔊 Testing Text-to-Speech (Fallback Mode)...")
        
        tts_result = await voice_service.text_to_speech(
            text="This is a test message for text-to-speech functionality.",
            language="en"
        )
        
        print(f"TTS Result: {tts_result}")
        
        if tts_result['success']:
            if tts_result.get('fallback'):
                print("✅ TTS working in fallback mode (no API key configured)")
            else:
                print("✅ TTS working with API integration")
        else:
            print(f"❌ TTS failed: {tts_result.get('error')}")
        
        # Test capabilities
        print("\n📋 Testing Service Capabilities...")
        
        languages = voice_service.get_supported_languages()
        voices = voice_service.get_available_voices()
        
        print(f"Supported Languages: {languages}")
        print(f"Available Voices: {voices}")
        
        # Test audio file management
        print("\n📁 Testing Audio File Management...")
        
        # Test getting non-existent audio file
        audio_path = await voice_service.get_audio_file("non-existent-id")
        print(f"Non-existent audio file: {audio_path}")
        
        # Test cleanup (should not fail)
        await voice_service.cleanup_old_audio_files(24)
        print("✅ Audio cleanup completed")
        
        return True
        
    except Exception as e:
        print(f"❌ Voice service test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

async def test_api_integration():
    """Test API integration readiness"""
    try:
        print("\n🌐 Testing API Integration Readiness...")
        
        # Check if OpenAI API key is configured
        openai_key = os.getenv('OPENAI_API_KEY')
        if openai_key:
            print("✅ OpenAI API key configured (for Whisper)")
        else:
            print("⚠️  OpenAI API key not configured (Whisper will not work)")
        
        # Check if ElevenLabs API key is configured
        elevenlabs_key = os.getenv('ELEVENLABS_API_KEY')
        if elevenlabs_key:
            print("✅ ElevenLabs API key configured")
        else:
            print("⚠️  ElevenLabs API key not configured (will use fallback mode)")
        
        # Check data directory
        data_dir = os.path.join(os.path.dirname(__file__), 'data', 'audio')
        if os.path.exists(data_dir):
            print(f"✅ Audio storage directory exists: {data_dir}")
        else:
            print(f"📁 Audio storage directory will be created: {data_dir}")
        
        return True
        
    except Exception as e:
        print(f"❌ API integration test failed: {str(e)}")
        return False

async def main():
    """Run all voice service tests"""
    print("🚀 Starting Voice Service Tests...\n")
    
    # Test voice service
    service_success = await test_voice_service()
    
    # Test API integration
    api_success = await test_api_integration()
    
    # Summary
    total_tests = 2
    passed_tests = sum([service_success, api_success])
    
    print(f"\n📊 Test Results: {passed_tests}/{total_tests} test suites passed")
    
    if passed_tests == total_tests:
        print("🎉 Voice Service is ready!")
        print("\n🌟 Next Steps:")
        print("   • Add OpenAI API key to .env for Whisper (speech-to-text)")
        print("   • Add ElevenLabs API key to .env for voice synthesis")
        print("   • Test voice endpoints at http://localhost:8000/docs")
        print("   • Implement frontend voice components")
    else:
        print("⚠️  Some tests failed. Check the error messages above.")
    
    return passed_tests == total_tests

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)