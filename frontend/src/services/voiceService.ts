const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface TranscriptionResult {
  text: string;
  language: string;
  confidence: number;
}

export interface SynthesisResult {
  audioBlob: Blob;
  audioUrl: string;
}

export class VoiceService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch(`${API_BASE_URL}/chat/voice/transcribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        text: result.text || '',
        language: result.language || 'en',
        confidence: result.confidence || 0,
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to transcribe audio');
    }
  }

  async synthesizeSpeech(text: string, language: string = 'bn'): Promise<SynthesisResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/voice/synthesize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text,
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        audioBlob,
        audioUrl,
      };
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to synthesize speech');
    }
  }

  // Utility method to check if browser supports audio recording
  static isRecordingSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  // Utility method to check if browser supports audio playback
  static isPlaybackSupported(): boolean {
    return !!(window.Audio || window.HTMLAudioElement);
  }

  // Utility method to request microphone permission
  static async requestMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately as we just wanted to check permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  // Convert audio blob to different format if needed
  static async convertAudioFormat(audioBlob: Blob, _targetFormat: string = 'audio/wav'): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const audioContext = new AudioContext();
      
      audio.onloadeddata = async () => {
        try {
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          // Create offline context for rendering
          const offlineContext = new OfflineAudioContext(
            audioBuffer.numberOfChannels,
            audioBuffer.length,
            audioBuffer.sampleRate
          );
          
          const source = offlineContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(offlineContext.destination);
          source.start();
          
          const renderedBuffer = await offlineContext.startRendering();
          
          // Convert to WAV format (simplified)
          const wavBlob = this.audioBufferToWav(renderedBuffer);
          resolve(wavBlob);
        } catch (error) {
          reject(error);
        }
      };
      
      audio.onerror = () => reject(new Error('Failed to load audio'));
      audio.src = URL.createObjectURL(audioBlob);
    });
  }

  // Helper method to convert AudioBuffer to WAV Blob
  private static audioBufferToWav(buffer: AudioBuffer): Blob {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }
}