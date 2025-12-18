import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, ChatState, QuickAction } from '../../types/chat';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import TypingIndicator from './TypingIndicator';
import ConnectionStatus from './ConnectionStatus';
import { useWebSocket } from '../../hooks/useWebSocket';

interface ChatContainerProps {
  className?: string;
  userId?: string;
  sessionId?: string;
  token?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  className = '',
  userId = 'demo_user',
  sessionId = `session_${Date.now()}`,
  token = 'demo_token'
}) => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isTyping: false,
    connectionStatus: 'disconnected',
    voiceRecording: {
      isRecording: false,
      duration: 0,
    },
    isVoiceMode: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // WebSocket message handlers
  const handleMessage = useCallback((message: ChatMessage) => {
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }, []);

  const handleTypingChange = useCallback((isTyping: boolean) => {
    setChatState(prev => ({
      ...prev,
      isTyping,
    }));
  }, []);

  const handleMessageStatusUpdate = useCallback((messageId: string, status: string) => {
    setChatState(prev => ({
      ...prev,
      messages: prev.messages.map(msg =>
        msg.id === messageId ? { ...msg, status: status as any } : msg
      ),
    }));
  }, []);

  // Initialize WebSocket connection
  const { connectionStatus, sendMessage: wsSendMessage, isConnected } = useWebSocket({
    sessionId,
    token,
    onMessage: handleMessage,
    onTypingChange: handleTypingChange,
    onMessageStatusUpdate: handleMessageStatusUpdate,
  });

  // Update connection status in state
  useEffect(() => {
    setChatState(prev => ({
      ...prev,
      connectionStatus,
    }));
  }, [connectionStatus]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  const handleSendMessage = async (content: string, isVoice: boolean = false) => {
    if (!isConnected) {
      // Show error message if not connected
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Unable to send message. Please check your connection and try again.',
        timestamp: new Date(),
        status: 'error',
      };
      
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
      return;
    }

    try {
      // Send message via WebSocket
      const messageId = wsSendMessage(content, isVoice);
      
      if (messageId) {
        // Add user message to local state
        const newMessage: ChatMessage = {
          id: messageId,
          role: 'user',
          content,
          timestamp: new Date(),
          voiceInput: isVoice,
          status: 'sending',
        };

        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, newMessage],
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error message
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Failed to send message. Please try again.',
        timestamp: new Date(),
        status: 'error',
      };
      
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.question);
  };

  const toggleVoiceMode = () => {
    setChatState(prev => ({
      ...prev,
      isVoiceMode: !prev.isVoiceMode,
    }));
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">AI</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">ShikkhaSathi AI Tutor</h3>
            <p className="text-sm text-gray-500">Always here to help you learn</p>
          </div>
        </div>
        <ConnectionStatus status={chatState.connectionStatus} />
      </div>

      {/* Quick Actions */}
      <QuickActions onActionClick={handleQuickAction} />

      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
      >
        {chatState.messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Welcome to ShikkhaSathi!</h4>
            <p className="text-gray-600">Ask me anything about your studies. I'm here to help you learn better.</p>
          </div>
        )}

        {chatState.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {chatState.isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isVoiceMode={chatState.isVoiceMode}
        onToggleVoiceMode={toggleVoiceMode}
        voiceRecording={chatState.voiceRecording}
        disabled={chatState.connectionStatus === 'disconnected'}
      />
    </div>
  );
};

export default ChatContainer;