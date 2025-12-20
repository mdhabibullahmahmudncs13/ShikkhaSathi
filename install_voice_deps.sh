#!/bin/bash
# Quick installation script for local voice dependencies

echo "🚀 Installing Local Voice Dependencies for ShikkhaSathi"
echo "========================================================"

# Check Python version
echo ""
echo "📋 Checking Python version..."
python3 --version

# Navigate to backend
cd backend

# Install PyTorch (CPU version for compatibility)
echo ""
echo "🔧 Installing PyTorch (CPU version)..."
pip3 install torch torchaudio --index-url https://download.pytorch.org/whl/cpu

# Install Whisper
echo ""
echo "🎤 Installing OpenAI Whisper..."
pip3 install openai-whisper

# Install audio processing libraries
echo ""
echo "🔊 Installing audio processing libraries..."
pip3 install soundfile pydub numpy

# Install TTS (optional - can be heavy)
echo ""
echo "🗣️ Installing Coqui TTS (this may take a while)..."
pip3 install TTS

# Install other dependencies
echo ""
echo "📦 Installing remaining dependencies..."
pip3 install langchain-ollama ollama

echo ""
echo "✅ Installation complete!"
echo ""
echo "📚 Next steps:"
echo "1. Test the installation: python3 test_local_voice.py"
echo "2. Start Ollama if not running: ollama serve"
echo "3. Start the backend: python3 run.py"
echo ""
echo "💡 Note: Models will download automatically on first use"
echo "   - Whisper base model: ~74 MB"
echo "   - TTS models: ~100-200 MB"
