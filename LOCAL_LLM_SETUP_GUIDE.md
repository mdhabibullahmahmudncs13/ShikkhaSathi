# ShikkhaSathi Local LLM Setup Guide

**Complete guide to set up ShikkhaSathi with local AI models - no external API dependencies**

## 🎯 Overview

This guide will help you migrate ShikkhaSathi from external AI APIs (OpenAI, ElevenLabs) to completely local AI models. After following this guide, your ShikkhaSathi installation will:

- ✅ Use local Ollama for AI tutoring (already working)
- ✅ Use local Whisper for speech-to-text
- ✅ Use local TTS for text-to-speech
- ✅ Work completely offline
- ✅ Have no API costs
- ✅ Maintain all existing functionality

## 📋 Prerequisites

### System Requirements
- **OS**: Linux, macOS, or Windows
- **Python**: 3.9 or higher
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 5GB free space for AI models
- **CPU**: Multi-core processor (GPU optional but recommended)

### Software Dependencies
- Python 3.9+
- Node.js 16+ (for frontend)
- Docker (for databases)
- Git

## 🚀 Quick Setup (Automated)

### Option 1: Automated Setup Script

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd ShikkhaSathi

# Run the automated setup script
python setup_local_voice.py
```

The script will:
1. Check system compatibility
2. Install all required Python packages
3. Download AI models (Whisper, TTS)
4. Configure environment settings
5. Test the installation

### Option 2: Manual Setup

If you prefer manual control or the automated script fails, follow the manual steps below.

## 🔧 Manual Setup Steps

### Step 1: Install Python Dependencies

```bash
cd backend

# Install the updated requirements
pip install -r requirements.txt

# Or install specific packages:
pip install openai-whisper torch torchaudio TTS soundfile pydub numpy
```

### Step 2: Install System Dependencies

#### On Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install ffmpeg sox libsndfile1
```

#### On macOS:
```bash
brew install ffmpeg sox
```

#### On Windows:
- Install Visual Studio Build Tools
- FFmpeg will be installed automatically with Python packages

### Step 3: Download AI Models

The models will download automatically on first use, but you can pre-download them:

```bash
# Test Whisper installation and download base model
python -c "import whisper; whisper.load_model('base')"

# Test TTS installation and download model
python -c "from TTS.api import TTS; TTS('tts_models/en/ljspeech/tacotron2-DDC')"
```

### Step 4: Configure Environment

Create or update `backend/.env`:

```bash
# Local Voice Services Configuration
USE_LOCAL_VOICE_SERVICES=true
VOICE_API_FALLBACK=false
WHISPER_MODEL_SIZE=base
WHISPER_DEVICE=auto
TTS_ENGINE=coqui

# Ollama Configuration (if not already set)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# Database Configuration (existing)
POSTGRES_SERVER=localhost
POSTGRES_USER=shikkhasathi
POSTGRES_PASSWORD=password
POSTGRES_DB=shikkhasathi
MONGODB_URL=mongodb://localhost:27017
REDIS_URL=redis://localhost:6379
```

### Step 5: Test Installation

```bash
cd backend

# Test local voice services
python test_local_voice.py

# Test Ollama integration (should already work)
python test_ollama.py
```

## 🎮 Usage Guide

### Starting the System

1. **Start Databases** (if using Docker):
   ```bash
   docker-compose up -d
   ```

2. **Start Ollama** (if not running):
   ```bash
   ollama serve
   ```

3. **Start Backend**:
   ```bash
   cd backend
   python run.py
   ```

4. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

### Using Voice Features

1. **Voice Input**: Click the microphone button in the chat interface
2. **Voice Output**: AI responses will automatically include audio (if enabled)
3. **Language Support**: Supports both Bengali and English
4. **Settings**: Configure voice preferences in the chat interface

## 🔧 Configuration Options

### Whisper Configuration

In `backend/.env`:

```bash
# Model sizes: tiny, base, small, medium, large
WHISPER_MODEL_SIZE=base

# Device: auto, cpu, cuda
WHISPER_DEVICE=auto
```

**Model Size Comparison:**
- `tiny`: Fastest, least accurate (~39 MB)
- `base`: Good balance (~74 MB) - **Recommended**
- `small`: Better accuracy (~244 MB)
- `medium`: High accuracy (~769 MB)
- `large`: Best accuracy (~1550 MB)

### TTS Configuration

```bash
# TTS Engine
TTS_ENGINE=coqui

# Voice models (will be expanded for Bengali)
TTS_VOICE_EN=ljspeech
TTS_VOICE_BN=custom-bengali
```

### Performance Tuning

```bash
# Concurrent voice requests
MAX_CONCURRENT_VOICE_REQUESTS=3

# Voice cache size
VOICE_CACHE_SIZE=100
```

## 🧪 Testing and Validation

### Test Voice Services

```bash
cd backend
python test_local_voice.py
```

Expected output:
```
🚀 Starting Local Voice Services Tests...

✅ PASSED: Local Whisper Service
✅ PASSED: Local TTS Service  
✅ PASSED: Voice Service Integration
✅ PASSED: Speech-to-Text Sample
✅ PASSED: Text-to-Speech Samples

📊 Test Results: 5/5 tests passed
🎉 All local voice service tests passed!
```

### Test AI Tutor

```bash
cd backend
python test_ollama.py
```

### Test Frontend Integration

1. Open http://localhost:5173/chat
2. Click the microphone button
3. Speak a question in English or Bengali
4. Verify the AI responds with both text and audio

## 🐛 Troubleshooting

### Common Issues

#### 1. "No module named 'whisper'"
```bash
pip install openai-whisper
```

#### 2. "TTS model not found"
```bash
pip install TTS
python -c "from TTS.api import TTS; TTS('tts_models/en/ljspeech/tacotron2-DDC')"
```

#### 3. "CUDA out of memory"
Set device to CPU:
```bash
WHISPER_DEVICE=cpu
```

#### 4. "Audio file not supported"
Install audio dependencies:
```bash
pip install soundfile pydub
```

#### 5. "Ollama connection failed"
Start Ollama:
```bash
ollama serve
```

### Performance Issues

#### Slow Speech Recognition
- Use smaller Whisper model: `WHISPER_MODEL_SIZE=tiny`
- Use CPU if GPU memory is limited: `WHISPER_DEVICE=cpu`

#### Slow Speech Synthesis
- TTS models are CPU-intensive by default
- Consider using simpler TTS engines for faster response

#### High Memory Usage
- Reduce concurrent requests: `MAX_CONCURRENT_VOICE_REQUESTS=1`
- Use smaller models
- Clear cache regularly

### Bengali Language Support

Currently, Bengali TTS uses English models as fallback. To improve Bengali support:

1. **Find Bengali TTS Models**: Look for Coqui TTS Bengali models
2. **Train Custom Models**: Train on Bengali speech data
3. **Use Alternative Engines**: Consider eSpeak-ng for Bengali

## 📊 Performance Comparison

### Before (External APIs)
- **Cost**: $0.006 per minute (Whisper) + $0.30 per 1K chars (ElevenLabs)
- **Latency**: 2-5 seconds (network dependent)
- **Privacy**: Data sent to external services
- **Reliability**: Dependent on internet and API availability

### After (Local Models)
- **Cost**: $0 (only hardware costs)
- **Latency**: 1-3 seconds (hardware dependent)
- **Privacy**: All data processed locally
- **Reliability**: Works offline, no external dependencies

## 🔄 Migration Checklist

- [ ] ✅ Install local voice dependencies
- [ ] ✅ Configure environment variables
- [ ] ✅ Test local Whisper service
- [ ] ✅ Test local TTS service
- [ ] ✅ Test voice service integration
- [ ] ✅ Verify Ollama is still working
- [ ] ✅ Test frontend voice features
- [ ] ✅ Test Bengali language support
- [ ] ✅ Performance optimization
- [ ] ✅ Documentation updates

## 🎯 Next Steps

### Immediate
1. **Test with Real Users**: Get feedback from Bengali and English speakers
2. **Optimize Performance**: Tune models for your hardware
3. **Improve Bengali Support**: Find or train better Bengali TTS models

### Future Enhancements
1. **Custom Voice Training**: Train voices specific to Bangladesh context
2. **Model Fine-tuning**: Fine-tune Whisper for Bengali accents
3. **GPU Acceleration**: Optimize for GPU if available
4. **Edge Deployment**: Deploy on edge devices for schools

## 📚 Additional Resources

### Documentation
- [OpenAI Whisper](https://github.com/openai/whisper)
- [Coqui TTS](https://github.com/coqui-ai/TTS)
- [Ollama](https://ollama.ai/)

### Bengali Language Resources
- [Bengali Speech Datasets](https://commonvoice.mozilla.org/bn)
- [Bengali TTS Research](https://arxiv.org/search/?query=bengali+text+speech)

### Hardware Optimization
- [PyTorch Performance Tuning](https://pytorch.org/tutorials/recipes/recipes/tuning_guide.html)
- [CUDA Setup Guide](https://pytorch.org/get-started/locally/)

## 🆘 Support

If you encounter issues:

1. **Check Logs**: Look at backend console output for errors
2. **Run Tests**: Use the provided test scripts
3. **Check Dependencies**: Ensure all packages are installed
4. **Hardware Requirements**: Verify your system meets requirements
5. **Community Support**: Check project documentation and issues

---

**Congratulations! 🎉 Your ShikkhaSathi now runs completely locally with no external AI API dependencies!**