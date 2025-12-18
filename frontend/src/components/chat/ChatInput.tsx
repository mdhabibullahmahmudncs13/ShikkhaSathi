import React, { useState, useRef, useEffect } from 'react';
import { VoiceRecording } from '../../types/chat';

interface ChatInputProps {
  onSendMessage: (message: string, isVoice?: boolean) => void;
  isVoiceMode: boolean;
  onToggleVoiceMode: () => void;
  voiceRecording: VoiceRecording;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isVoiceMode,
  onToggleVoiceMode,
  voiceRecording: _voiceRecording,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        // const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // TODO: Implement speech-to-text conversion with audioBlob
        // For now, simulate transcription
        setTimeout(() => {
          onSendMessage('This is a simulated voice transcription. Whisper API integration will be implemented in subtask 8.3.', true);
          setIsRecording(false);
        }, 1000);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        {/* Voice mode toggle */}
        <button
          type="button"
          onClick={onToggleVoiceMode}
          disabled={disabled}
          className={`p-2 rounded-full transition-colors ${
            isVoiceMode
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isVoiceMode ? 'Switch to text mode' : 'Switch to voice mode'}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Text input area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isVoiceMode ? "Voice mode active - click mic to record" : "Type your question here..."}
            disabled={disabled || (isVoiceMode && !isRecording)}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              disabled ? 'bg-gray-100 cursor-not-allowed' : ''
            } ${isVoiceMode && !isRecording ? 'bg-gray-50' : ''}`}
            rows={1}
            maxLength={1000}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {message.length}/1000
          </div>
        </div>

        {/* Voice recording button (when in voice mode) */}
        {isVoiceMode && (
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled}
            className={`p-3 rounded-full transition-all ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        )}

        {/* Send button (when in text mode) */}
        {!isVoiceMode && (
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className={`p-3 rounded-full transition-colors ${
              message.trim() && !disabled
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title="Send message"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        )}
      </form>

      {/* Recording indicator */}
      {isRecording && (
        <div className="mt-2 flex items-center justify-center text-red-500 text-sm">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
          Recording... Click stop when finished
        </div>
      )}
    </div>
  );
};

export default ChatInput;