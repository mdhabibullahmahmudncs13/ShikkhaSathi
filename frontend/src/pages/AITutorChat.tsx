import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, BookOpen, Lightbulb, HelpCircle, Volume2, Download, Settings } from 'lucide-react';
import apiClient from '../services/apiClient';
import { VoiceInputButton } from '../components/voice/VoiceInputButton';
import { VoicePlayer } from '../components/voice/VoicePlayer';
import { VoiceControls } from '../components/voice/VoiceControls';
import { ConversationExport } from '../components/chat/ConversationExport';
import { useVoice } from '../hooks/useVoice';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
  audioUrl?: string;
  isVoiceMessage?: boolean;
}

interface ChatResponse {
  response: string;
  sources: string[];
  context_used: boolean;
  model: string;
}

const AITutorChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m ShikkhaSathi, your AI tutor. I\'m here to help you learn Physics, Chemistry, Mathematics, Biology, Bangla, and English. What would you like to learn about today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice functionality
  const {
    state: voiceState,
    settings: voiceSettings,
    transcribeAudio,
    synthesizeText,
    toggleInput,
    toggleOutput,
    changeLanguage,
    clearError
  } = useVoice();

  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Bangla', 'English'];

  const quickQuestions = [
    "Explain Newton's laws of motion",
    "What is photosynthesis?",
    "How do you solve quadratic equations?",
    "What are the parts of speech in English?",
    "Explain the periodic table",
    "What is the water cycle?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Voice input handlers
  const handleVoiceInput = async (audioBlob: Blob) => {
    try {
      const transcriptionResult = await transcribeAudio(audioBlob);
      
      if (transcriptionResult.success && transcriptionResult.text) {
        const voiceMessage: ChatMessage = {
          role: 'user',
          content: transcriptionResult.text,
          timestamp: new Date().toISOString(),
          isVoiceMessage: true
        };
        
        setMessages(prev => [...prev, voiceMessage]);
        
        // Send the transcribed message to AI
        await sendMessageToAI(transcriptionResult.text);
      } else {
        console.error('Voice transcription failed:', transcriptionResult.error);
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
    }
  };

  const handleStartRecording = () => {
    clearError();
  };

  const handleStopRecording = () => {
    // Recording stopped, waiting for audio processing
  };

  const sendMessageToAI = async (message: string) => {
    setIsLoading(true);

    try {
      const response = await apiClient.post<ChatResponse>('/chat/chat', {
        message,
        conversation_history: messages.slice(-10), // Send last 10 messages for context
        subject: selectedSubject || undefined
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString(),
        sources: response.data.sources
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Generate voice output if enabled
      if (voiceSettings.outputEnabled && voiceState.serviceAvailable) {
        try {
          const synthesisResult = await synthesizeText(response.data.response);
          if (synthesisResult.success && synthesisResult.audioId) {
            // Update the message with audio URL
            setMessages(prev => prev.map(msg => 
              msg === assistantMessage 
                ? { ...msg, audioUrl: synthesisResult.audioId }
                : msg
            ));
          }
        } catch (error) {
          console.error('Voice synthesis failed:', error);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I\'m sorry, I\'m having trouble processing your question right now. Please try again in a moment.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const message = messageText || inputMessage.trim();
    if (!message) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    await sendMessageToAI(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AI Tutor</h1>
              <p className="text-sm text-gray-500">ShikkhaSathi Learning Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Export Button */}
            <button
              onClick={() => setShowExportModal(true)}
              disabled={messages.length <= 1}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export Conversation"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Voice Settings Button */}
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Voice Settings"
            >
              <Settings className="w-5 h-5" />
              <span className="hidden sm:inline">Voice</span>
            </button>

            {/* Voice Controls */}
            <VoiceControls
              voiceInputEnabled={voiceState.voiceInputEnabled}
              voiceOutputEnabled={voiceState.voiceOutputEnabled}
              selectedLanguage={voiceState.selectedLanguage}
              onToggleInput={toggleInput}
              onToggleOutput={toggleOutput}
              onLanguageChange={changeLanguage}
              serviceStatus={{
                whisperAvailable: voiceState.serviceAvailable,
                ttsAvailable: voiceState.serviceAvailable,
                processing: voiceState.isProcessing
              }}
              className="hidden md:block"
            />
            
            {/* Subject Selector */}
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Voice Controls */}
        <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
          <VoiceControls
            voiceInputEnabled={voiceState.voiceInputEnabled}
            voiceOutputEnabled={voiceState.voiceOutputEnabled}
            selectedLanguage={voiceState.selectedLanguage}
            onToggleInput={toggleInput}
            onToggleOutput={toggleOutput}
            onLanguageChange={changeLanguage}
            serviceStatus={{
              whisperAvailable: voiceState.serviceAvailable,
              ttsAvailable: voiceState.serviceAvailable,
              processing: voiceState.isProcessing
            }}
          />
        </div>

        {/* Error Display */}
        {voiceState.lastError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-red-700 text-sm">{voiceState.lastError}</span>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-3xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-green-600' 
                    : 'bg-blue-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-lg px-4 py-2 max-w-full ${
                  message.role === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-900 shadow-sm border'
                }`}>
                  <div className="flex items-start space-x-2">
                    <p className="whitespace-pre-wrap flex-1">{message.content}</p>
                    {message.isVoiceMessage && (
                      <div title="Voice message">
                        <Volume2 className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                      </div>
                    )}
                  </div>
                  
                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Sources:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.sources.map((source, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Voice Player for AI responses */}
                {message.role === 'assistant' && message.audioUrl && (
                  <div className="mt-2 w-full max-w-md">
                    <VoicePlayer
                      audioUrl={message.audioUrl}
                      text={message.content}
                      autoPlay={voiceSettings.autoPlay}
                      showControls={true}
                    />
                  </div>
                )}
                
                <span className="text-xs text-gray-500 mt-1">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex mr-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-6 py-2">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Quick Questions:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => sendMessage(question)}
                className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors text-sm"
              >
                <HelpCircle className="w-4 h-4 text-blue-500 inline mr-2" />
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex space-x-3">
          {/* Voice Input Button */}
          {voiceState.voiceInputEnabled && (
            <VoiceInputButton
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onAudioReady={handleVoiceInput}
              isEnabled={voiceState.serviceAvailable && !isLoading}
              isProcessing={voiceState.isProcessing}
              className="flex-shrink-0"
            />
          )}
          
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                voiceState.voiceInputEnabled 
                  ? "Type your message or use voice input..." 
                  : "Ask me anything about your studies..."
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Export Modal */}
      <ConversationExport
        messages={messages}
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      {/* Voice Settings Panel */}
      {showVoiceSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Voice Settings</h3>
              <button
                onClick={() => setShowVoiceSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
            
            <VoiceControls
              voiceInputEnabled={voiceState.voiceInputEnabled}
              voiceOutputEnabled={voiceState.voiceOutputEnabled}
              selectedLanguage={voiceState.selectedLanguage}
              onToggleInput={toggleInput}
              onToggleOutput={toggleOutput}
              onLanguageChange={changeLanguage}
              serviceStatus={{
                whisperAvailable: voiceState.serviceAvailable,
                ttsAvailable: voiceState.serviceAvailable,
                processing: voiceState.isProcessing
              }}
              showLabels={true}
            />

            {voiceState.lastError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{voiceState.lastError}</p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowVoiceSettings(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITutorChat;