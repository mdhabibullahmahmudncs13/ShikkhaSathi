#!/usr/bin/env node
/**
 * Test script to verify frontend chat functionality
 * This simulates what the frontend does
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/v1';

async function testFrontendChat() {
    console.log('🔐 Testing frontend chat simulation...');
    
    try {
        // Step 1: Login
        console.log('📝 Logging in...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'student1@shikkhasathi.com',
            password: 'student123'
        });
        
        const token = loginResponse.data.access_token;
        console.log('✅ Login successful!');
        
        // Step 2: Set up headers like frontend
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        
        // Step 3: Simulate frontend message format
        const messages = [
            {
                role: 'assistant',
                content: 'Hello! I\'m ShikkhaSathi, your AI tutor. I\'m here to help you learn Physics, Chemistry, Mathematics, Biology, Bangla, and English. What would you like to learn about today?',
                timestamp: new Date().toISOString()
            }
        ];
        
        // Step 4: Send first message
        console.log('\n💬 Sending first message...');
        const firstMessage = 'What is force in physics?';
        
        const firstResponse = await axios.post(`${BASE_URL}/chat/chat`, {
            message: firstMessage,
            conversation_history: messages.slice(-10).map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            subject: 'Physics'
        }, { headers });
        
        console.log('✅ First response received!');
        console.log(`📝 Response: ${firstResponse.data.response.substring(0, 100)}...`);
        
        // Add messages to history
        messages.push({
            role: 'user',
            content: firstMessage,
            timestamp: new Date().toISOString()
        });
        
        messages.push({
            role: 'assistant',
            content: firstResponse.data.response,
            timestamp: new Date().toISOString(),
            sources: firstResponse.data.sources
        });
        
        // Step 5: Send second message (this is where the issue might be)
        console.log('\n💬 Sending second message...');
        const secondMessage = 'Can you give me an example?';
        
        const secondResponse = await axios.post(`${BASE_URL}/chat/chat`, {
            message: secondMessage,
            conversation_history: messages.slice(-10).map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            subject: 'Physics'
        }, { headers });
        
        console.log('✅ Second response received!');
        console.log(`📝 Response: ${secondResponse.data.response.substring(0, 100)}...`);
        
        // Step 6: Send third message
        console.log('\n💬 Sending third message...');
        const thirdMessage = 'What about Newton\'s laws?';
        
        messages.push({
            role: 'user',
            content: secondMessage,
            timestamp: new Date().toISOString()
        });
        
        messages.push({
            role: 'assistant',
            content: secondResponse.data.response,
            timestamp: new Date().toISOString(),
            sources: secondResponse.data.sources
        });
        
        const thirdResponse = await axios.post(`${BASE_URL}/chat/chat`, {
            message: thirdMessage,
            conversation_history: messages.slice(-10).map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            subject: 'Physics'
        }, { headers });
        
        console.log('✅ Third response received!');
        console.log(`📝 Response: ${thirdResponse.data.response.substring(0, 100)}...`);
        
        console.log('\n🎉 Frontend chat simulation successful!');
        console.log(`📊 Total conversation length: ${messages.length + 2} messages`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Frontend chat test failed:', error.response?.data || error.message);
        return false;
    }
}

// Run the test
testFrontendChat().then(success => {
    if (success) {
        console.log('\n✅ Frontend chat functionality is working correctly');
        console.log('🔍 The issue might be in the React component state management or UI updates');
    } else {
        console.log('\n❌ Frontend chat test failed - backend issue detected');
    }
});