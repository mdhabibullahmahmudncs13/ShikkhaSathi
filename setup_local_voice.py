#!/usr/bin/env python3
"""
Setup script for local voice services in ShikkhaSathi
"""

import os
import sys
import subprocess
import platform

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"   Command: {command}")
        print(f"   Error: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 9):
        print(f"❌ Python 3.9+ required, found {version.major}.{version.minor}")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def check_system_dependencies():
    """Check system-level dependencies"""
    print("🔍 Checking system dependencies...")
    
    system = platform.system().lower()
    
    if system == "linux":
        # Check for common audio libraries
        deps = ["ffmpeg", "sox"]
        for dep in deps:
            if subprocess.run(f"which {dep}", shell=True, capture_output=True).returncode != 0:
                print(f"⚠️  {dep} not found - audio processing may be limited")
                print(f"   Install with: sudo apt-get install {dep}")
    
    elif system == "darwin":  # macOS
        if subprocess.run("which brew", shell=True, capture_output=True).returncode != 0:
            print("⚠️  Homebrew not found - some audio dependencies may be missing")
            print("   Install from: https://brew.sh/")
        else:
            print("✅ Homebrew found")
    
    elif system == "windows":
        print("ℹ️  Windows detected - ensure you have Visual Studio Build Tools installed")
    
    return True

def install_pytorch():
    """Install PyTorch with appropriate configuration"""
    print("🔧 Installing PyTorch...")
    
    # Check if CUDA is available
    try:
        import torch
        if torch.cuda.is_available():
            print("✅ PyTorch with CUDA already installed")
            return True
    except ImportError:
        pass
    
    # Install CPU version by default (safer for most systems)
    command = "pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu"
    return run_command(command, "Installing PyTorch (CPU version)")

def install_whisper():
    """Install OpenAI Whisper"""
    return run_command("pip install openai-whisper", "Installing OpenAI Whisper")

def install_tts():
    """Install Coqui TTS"""
    return run_command("pip install TTS", "Installing Coqui TTS")

def install_audio_dependencies():
    """Install audio processing dependencies"""
    deps = [
        "soundfile",
        "pydub",
        "numpy"
    ]
    
    for dep in deps:
        if not run_command(f"pip install {dep}", f"Installing {dep}"):
            return False
    
    return True

def download_models():
    """Download required models"""
    print("📥 Downloading AI models...")
    
    # Download Whisper base model
    try:
        import whisper
        print("🔧 Downloading Whisper base model...")
        whisper.load_model("base")
        print("✅ Whisper base model downloaded")
    except Exception as e:
        print(f"⚠️  Failed to download Whisper model: {e}")
        print("   Model will be downloaded on first use")
    
    # Download TTS model
    try:
        from TTS.api import TTS
        print("🔧 Downloading TTS model...")
        TTS("tts_models/en/ljspeech/tacotron2-DDC")
        print("✅ TTS model downloaded")
    except Exception as e:
        print(f"⚠️  Failed to download TTS model: {e}")
        print("   Model will be downloaded on first use")
    
    return True

def test_installation():
    """Test the installation"""
    print("🧪 Testing installation...")
    
    try:
        # Test Whisper
        import whisper
        model = whisper.load_model("base")
        print("✅ Whisper test passed")
        
        # Test TTS
        from TTS.api import TTS
        tts = TTS("tts_models/en/ljspeech/tacotron2-DDC")
        print("✅ TTS test passed")
        
        return True
        
    except Exception as e:
        print(f"❌ Installation test failed: {e}")
        return False

def create_env_file():
    """Create or update .env file with local voice settings"""
    env_path = "backend/.env"
    
    # Read existing .env if it exists
    env_vars = {}
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if '=' in line and not line.strip().startswith('#'):
                    key, value = line.strip().split('=', 1)
                    env_vars[key] = value
    
    # Add local voice service settings
    env_vars.update({
        'USE_LOCAL_VOICE_SERVICES': 'true',
        'VOICE_API_FALLBACK': 'false',
        'WHISPER_MODEL_SIZE': 'base',
        'WHISPER_DEVICE': 'auto',
        'TTS_ENGINE': 'coqui'
    })
    
    # Write updated .env file
    with open(env_path, 'w') as f:
        f.write("# ShikkhaSathi Configuration\n")
        f.write("# Local Voice Services Configuration\n")
        for key, value in env_vars.items():
            f.write(f"{key}={value}\n")
    
    print(f"✅ Updated {env_path} with local voice settings")
    return True

def main():
    """Main setup function"""
    print("🚀 ShikkhaSathi Local Voice Services Setup")
    print("=" * 50)
    
    steps = [
        ("Checking Python version", check_python_version),
        ("Checking system dependencies", check_system_dependencies),
        ("Installing PyTorch", install_pytorch),
        ("Installing Whisper", install_whisper),
        ("Installing TTS", install_tts),
        ("Installing audio dependencies", install_audio_dependencies),
        ("Downloading models", download_models),
        ("Testing installation", test_installation),
        ("Creating configuration", create_env_file)
    ]
    
    failed_steps = []
    
    for step_name, step_func in steps:
        print(f"\n📋 Step: {step_name}")
        if not step_func():
            failed_steps.append(step_name)
            print(f"❌ {step_name} failed")
        else:
            print(f"✅ {step_name} completed")
    
    print("\n" + "=" * 50)
    
    if not failed_steps:
        print("🎉 Setup completed successfully!")
        print("\n📚 Next steps:")
        print("1. Start the backend: cd backend && python run.py")
        print("2. Test voice services: cd backend && python test_local_voice.py")
        print("3. Start the frontend: cd frontend && npm run dev")
        print("\n🎯 Your ShikkhaSathi now uses local AI models!")
        return True
    else:
        print(f"⚠️  Setup completed with {len(failed_steps)} issues:")
        for step in failed_steps:
            print(f"   - {step}")
        print("\n💡 You may need to:")
        print("1. Install system dependencies manually")
        print("2. Check your internet connection for model downloads")
        print("3. Ensure you have sufficient disk space (2-3 GB for models)")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)