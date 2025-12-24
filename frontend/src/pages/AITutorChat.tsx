import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb, HelpCircle, Volume2, Download, Settings, Mic, ChevronDown, Image, Plus, Rocket, Leaf, Calculator, BookText, Beaker, Droplets } from 'lucide-react';
import apiClient from '../services/apiClient';
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
  const [selectedSubject] = useState<string>('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice functionality
  const {
    state: voiceState,
    settings: voiceSettings,
    synthesizeText,
    toggleInput,
    toggleOutput,
    changeLanguage
  } = useVoice();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const quickQuestions = [
    { 
      title: "Newton's Laws", 
      description: "Understand the fundamental principles of motion.",
      icon: Rocket,
      color: "blue"
    },
    { 
      title: "Photosynthesis", 
      description: "How plants convert light energy into chemical energy.",
      icon: Leaf,
      color: "green"
    },
    { 
      title: "Algebra", 
      description: "Solving quadratic equations and inequalities.",
      icon: Calculator,
      color: "orange"
    },
    { 
      title: "English Grammar", 
      description: "Master parts of speech and sentence structure.",
      icon: BookText,
      color: "pink"
    },
    { 
      title: "Periodic Table", 
      description: "Elements, atomic numbers, and chemical groups.",
      icon: Beaker,
      color: "purple"
    },
    { 
      title: "Water Cycle", 
      description: "Evaporation, condensation, and precipitation processes.",
      icon: Droplets,
      color: "cyan"
    }
  ];

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
    <div className="bg-[#F8F9FB] text-slate-700 font-sans h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="bg-indigo-600 h-10 w-10 rounded-full flex items-center justify-center text-white shadow-md">
              <Bot className="w-6 h-6" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              AI Tutor
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600 border border-indigo-200 uppercase tracking-wider">Beta</span>
            </h1>
            <span className="text-xs text-slate-500 font-medium">Shikshasathi Assistant</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button 
              onClick={() => setShowExportModal(true)}
              disabled={messages.length <= 1}
              className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all text-slate-600 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              Export
            </button>
            <div className="w-px h-4 bg-slate-200"></div>
            <button className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all text-slate-600 group">
              <Settings className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              History
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden lg:block"></div>

          <div className="flex items-center gap-2 bg-white rounded-full border border-slate-200 p-1 shadow-sm">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-600 border border-indigo-200 transition-all">
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Auto-detect</span>
            </button>
            <button 
              onClick={() => toggleInput()}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" 
              title="Voice Input"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button 
              onClick={() => toggleOutput()}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" 
              title="Voice Output"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 ml-2">
            <button className="p-2 hover:bg-white rounded-full transition-all text-slate-500 hover:text-indigo-600 hover:shadow-sm border border-transparent hover:border-slate-200">
              <Settings className="w-5 h-5" />
            </button>
            <div className="relative group hidden md:block ml-1">
              <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 hover:border-indigo-300 hover:shadow-sm transition-all bg-white w-36 justify-between text-sm text-slate-600">
                <span className="truncate font-medium">{selectedSubject || 'All Subjects'}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-grow flex flex-col overflow-y-auto px-4">
        <div className="w-full max-w-4xl mx-auto py-8 flex-grow flex flex-col">
          {messages.length === 1 ? (
            // Welcome Message
            <div className="flex gap-5 mb-auto group">
              <div className="shrink-0 mt-1">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
              </div>
              <div className="max-w-2xl w-full">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-6 shadow-sm text-slate-700 leading-relaxed">
                  <h2 className="font-bold text-lg mb-3 text-slate-800 flex items-center gap-2">
                    Hi there! I'm <span className="text-indigo-600 font-extrabold">Shikshasathi</span>
                    <span className="text-2xl">👋</span>
                  </h2>
                  <p className="text-[15px] text-slate-600 mb-4 leading-7">
                    I'm your AI tutor here to help you master Physics, Chemistry, Mathematics, Biology, Bangla, and English. What topic shall we explore today?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 text-xs font-semibold border border-indigo-200">#Physics</span>
                    <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-600 text-xs font-semibold border border-purple-200">#Math</span>
                    <span className="px-2.5 py-1 rounded-md bg-pink-50 text-pink-600 text-xs font-semibold border border-pink-200">#Biology</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 pl-1 opacity-60">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Just now</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                  <span className="text-[10px] font-medium text-slate-400">AI Tutor</span>
                </div>
              </div>
            </div>
          ) : (
            // Chat Messages
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-3xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                        message.role === 'user' 
                          ? 'bg-green-600' 
                          : 'bg-indigo-600'
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
                      <div className={`rounded-2xl px-4 py-3 max-w-full shadow-sm ${
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                      }`}>
                        <div className="flex items-start space-x-2">
                          <p className="whitespace-pre-wrap flex-1 text-[15px] leading-relaxed">{message.content}</p>
                          {message.isVoiceMessage && (
                            <div title="Voice message">
                              <Volume2 className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                            </div>
                          )}
                        </div>
                        
                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-xs text-slate-500 mb-2 font-medium">Sources:</p>
                            <div className="flex flex-wrap gap-1">
                              {message.sources.map((source, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md font-medium"
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
                      
                      <span className="text-[10px] text-slate-400 mt-2 font-medium">
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
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-slate-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Suggested Topics */}
          {messages.length === 1 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 p-1.5 rounded-lg text-orange-600 shadow-sm">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Suggested Topics</h3>
                </div>
                <button className="text-xs text-indigo-600 font-medium hover:underline">View all</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickQuestions.map((question, index) => {
                  const IconComponent = question.icon;
                  const colorClasses = {
                    blue: "hover:border-blue-400 hover:shadow-blue-500/10 text-blue-600 bg-blue-50 border-blue-100 hover:text-blue-700",
                    green: "hover:border-green-400 hover:shadow-green-500/10 text-green-600 bg-green-50 border-green-100 hover:text-green-700",
                    orange: "hover:border-orange-400 hover:shadow-orange-500/10 text-orange-600 bg-orange-50 border-orange-100 hover:text-orange-700",
                    pink: "hover:border-pink-400 hover:shadow-pink-500/10 text-pink-600 bg-pink-50 border-pink-100 hover:text-pink-700",
                    purple: "hover:border-purple-400 hover:shadow-purple-500/10 text-purple-600 bg-purple-50 border-purple-100 hover:text-purple-700",
                    cyan: "hover:border-cyan-400 hover:shadow-cyan-500/10 text-cyan-600 bg-cyan-50 border-cyan-100 hover:text-cyan-700"
                  };
                  
                  return (
                    <button
                      key={index}
                      onClick={() => sendMessage(`Tell me about ${question.title}`)}
                      className={`flex flex-col items-start gap-3 p-4 bg-white border border-slate-200 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-left relative overflow-hidden h-full ${colorClasses[question.color as keyof typeof colorClasses]}`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0 border ${colorClasses[question.color as keyof typeof colorClasses]}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <HelpCircle className="text-slate-300 group-hover:text-slate-400 transition-colors text-lg" />
                      </div>
                      <div className="relative z-10 w-full">
                        <span className="block text-slate-800 font-bold mb-1 text-[15px] transition-colors">
                          {question.title}
                        </span>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {question.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input */}
      <footer className="bg-white border-t border-slate-200 p-4 shrink-0">
        <div className="w-full max-w-4xl mx-auto">
          <div className="relative">
            <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <button className="pl-4 pr-2 py-4 text-slate-400 hover:text-indigo-600 transition-colors rounded-l-xl">
                <Plus className="w-5 h-5" />
              </button>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your studies..."
                className="w-full bg-transparent border-none py-4 px-2 text-slate-800 placeholder-slate-400 focus:ring-0 text-[15px] resize-none"
                rows={1}
                disabled={isLoading}
              />
              <div className="flex items-center gap-1.5 pr-2">
                <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-slate-50" title="Upload Image">
                  <Image className="w-5 h-5" />
                </button>
                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                <button
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="text-center mt-3">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Shikshasathi AI can make mistakes. Verify important info.
            </p>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      <ConversationExport
        messages={messages}
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      {/* Voice Settings Panel */}
      {showVoiceSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Voice Settings</h3>
              <button
                onClick={() => setShowVoiceSettings(false)}
                className="text-slate-400 hover:text-slate-600"
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
            />

            {voiceState.lastError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{voiceState.lastError}</p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowVoiceSettings(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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