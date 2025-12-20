/**
 * VoiceInputButton Component
 * Microphone button with recording states and visual feedback
 */

import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { VoiceInputButtonProps, RecordingStatus } from '../../types/voice';

interface ExtendedVoiceInputButtonProps extends VoiceInputButtonProps {
  status?: RecordingStatus;
  duration?: number;
}

const VoiceInputButton: React.FC<ExtendedVoiceInputButtonProps> = ({
  onStartRecording,
  onStopRecording,
  isRecording,
  isEnabled,
  status = RecordingStatus.IDLE,
  duration = 0,
  className = ''
}) => {
  const handleClick = () => {
    if (!isEnabled) return;
    
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getButtonStyle = () => {
    if (!isEnabled) {
      return 'bg-gray-300 cursor-not-allowed';
    }
    if (isRecording) {
      return 'bg-red-600 hover:bg-red-700 animate-pulse';
    }
    return 'bg-blue-600 hover:bg-blue-700';
  };

  const getIcon = () => {
    if (status === RecordingStatus.PROCESSING) {
      return <Loader2 className="w-5 h-5 text-white animate-spin" />;
    }
    if (!isEnabled) {
      return <MicOff className="w-5 h-5 text-gray-500" />;
    }
    return <Mic className="w-5 h-5 text-white" />;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={handleClick}
        disabled={!isEnabled || status === RecordingStatus.PROCESSING}
        className={`
          p-3 rounded-full transition-all duration-200 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${getButtonStyle()}
        `}
        title={isRecording ? 'Stop recording' : 'Start recording'}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {getIcon()}
      </button>
      
      {isRecording && duration > 0 && (
        <span className="text-sm font-mono text-gray-700">
          {formatDuration(duration)}
        </span>
      )}
      
      {status === RecordingStatus.REQUESTING_PERMISSION && (
        <span className="text-xs text-gray-500">
          Requesting microphone access...
        </span>
      )}
    </div>
  );
};

export default VoiceInputButton;
