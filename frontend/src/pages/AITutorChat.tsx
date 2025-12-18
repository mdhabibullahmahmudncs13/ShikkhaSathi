import React, { useState, useEffect } from 'react';
import ChatContainer from '../components/chat/ChatContainer';

const AITutorChat: React.FC = () => {
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [userId] = useState('demo_user'); // In real app, get from auth context
  const [token] = useState('demo_token'); // In real app, get from auth context

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)]">
        <ChatContainer 
          className="h-full"
          userId={userId}
          sessionId={sessionId}
          token={token}
        />
      </div>
    </div>
  );
};

export default AITutorChat;