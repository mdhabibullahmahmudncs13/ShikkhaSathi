import React, { useState, useEffect } from 'react';
import ChatContainer from '../components/chat/ChatContainer';
import { useWebSocket } from '../hooks/useWebSocket';
import { useChatMessage } from '../hooks/useAPI';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { LoadingOverlay } from '../components/common/LoadingIndicator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  voice_input?: boolean;
}

export default function AITutorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [isConnected, setIsConnected] = useState(false);

  const { sendMessage: sendWebSocketMessage, isConnected: wsConnected } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'chat_response') {
        const newMessage: Message = {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: message.content,
          timestamp: new Date(),
          sources: message.sources || []
        };
        setMessages(prev => [...prev, newMessage]);
      }
    },
    onConnect: () => setIsConnected(true),
    onDisconnect: () => setIsConnected(false)
  });

  const { mutate: sendChatMessage, loading: sendingMessage } = useChatMessage();

  const handleSendMessage = async (content: string, isVoiceInput = false) => {
    // Add user message immediately
    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content,
      timestamp: new Date(),
      voice_input: isVoiceInput
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      if (wsConnected) {
        // Use WebSocket for real-time communication
        sendWebSocketMessage({
          type: 'chat_message',
          content,
          session_id: sessionId,
          voice_input: isVoiceInput
        });
      } else {
        // Fallback to HTTP API
        const response = await sendChatMessage({
          message: content,
          sessionId
        });

        const assistantMessage: Message = {
          id: `msg_${Date.now()}_assistant`,
          role: 'assistant',
          content: response.content,
          timestamp: new Date(),
          sources: response.sources || []
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: 'দুঃখিত, আপনার বার্তা পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleVoiceInput = async (audioBlob: Blob) => {
    try {
      // Process voice input through API
      const { chatAPI } = require('../services/apiClient');
      const response = await chatAPI.processVoiceInput(audioBlob);
      
      if (response.text) {
        await handleSendMessage(response.text, true);
      }
    } catch (error) {
      console.error('Voice input failed:', error);
    }
  };

  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const { chatAPI } = require('../services/apiClient');
        const history = await chatAPI.getChatHistory(sessionId);
        
        if (history.messages) {
          const formattedMessages: Message[] = history.messages.map((msg: any) => ({
            id: msg.id || `msg_${Date.now()}_${Math.random()}`,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
            sources: msg.sources,
            voice_input: msg.voice_input
          }));
          
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };

    loadChatHistory();
  }, [sessionId]);

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI টিউটর চ্যাট</h1>
              <p className="text-sm text-gray-600">
                আপনার ব্যক্তিগত AI শিক্ষক - যেকোনো প্রশ্ন করুন
              </p>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'সংযুক্ত' : 'সংযোগ বিচ্ছিন্ন'}
              </span>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-hidden">
          <LoadingOverlay 
            isLoading={sendingMessage} 
            message="বার্তা পাঠানো হচ্ছে..."
          >
            <ChatContainer
              messages={messages}
              onSendMessage={handleSendMessage}
              onVoiceInput={handleVoiceInput}
              isConnected={isConnected}
              loading={sendingMessage}
            />
          </LoadingOverlay>
        </div>

        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-16 h-16 mx-auto mb-4 text-blue-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                AI টিউটরের সাথে কথা বলুন
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                গণিত, বিজ্ঞান, বাংলা, ইংরেজি - যেকোনো বিষয়ে প্রশ্ন করুন। 
                আমি NCTB পাঠ্যক্রম অনুযায়ী আপনাকে সাহায্য করব।
              </p>
              <div className="text-xs text-gray-500">
                💡 টিপস: আপনি টাইপ করতে পারেন অথবা ভয়েস ব্যবহার করতে পারেন
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}