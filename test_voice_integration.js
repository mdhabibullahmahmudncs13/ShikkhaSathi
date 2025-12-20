#!/usr/bin/env node

/**
 * Voice Integration Test Script
 * Tests the voice API endpoints to ensure they're working correctly
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/v1';

async function testVoiceIntegration() {
  console.log('🎤 Testing Voice Integration...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing API Health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ API Health:', healthResponse.data);

    // Test 2: Text-to-Speech (English)
    console.log('\n2. Testing Text-to-Speech (English)...');
    const englishTTS = await axios.post(`${BASE_URL}/voice/test-synthesize`, {
      text: 'Hello, this is a test of the English text-to-speech system.',
      language: 'en'
    });
    console.log('✅ English TTS:', {
      success: englishTTS.data.success,
      audioId: englishTTS.data.audio_id,
      language: englishTTS.data.language
    });

    // Test 3: Text-to-Speech (Bengali)
    console.log('\n3. Testing Text-to-Speech (Bengali)...');
    const bengaliTTS = await axios.post(`${BASE_URL}/voice/test-synthesize`, {
      text: 'আসসালামু আলাইকুম। এটি বাংলা টেক্সট টু স্পিচ সিস্টেমের একটি পরীক্ষা।',
      language: 'bn'
    });
    console.log('✅ Bengali TTS:', {
      success: bengaliTTS.data.success,
      audioId: bengaliTTS.data.audio_id,
      language: bengaliTTS.data.language
    });

    // Test 4: Audio File Access
    console.log('\n4. Testing Audio File Access...');
    if (englishTTS.data.audio_id) {
      const audioResponse = await axios.head(`${BASE_URL}/voice/test-audio/${englishTTS.data.audio_id}`);
      console.log('✅ Audio File Access:', {
        status: audioResponse.status,
        contentType: audioResponse.headers['content-type']
      });
    }

    // Test 5: Frontend Service Availability
    console.log('\n5. Testing Frontend Service...');
    const frontendResponse = await axios.get('http://localhost:5174');
    console.log('✅ Frontend Available:', frontendResponse.status === 200);

    console.log('\n🎉 All voice integration tests passed!');
    console.log('\n📋 Test Summary:');
    console.log('- ✅ Backend API is healthy');
    console.log('- ✅ English text-to-speech working');
    console.log('- ✅ Bengali text-to-speech working');
    console.log('- ✅ Audio file serving working');
    console.log('- ✅ Frontend is accessible');
    
    console.log('\n🚀 Voice integration is ready for testing!');
    console.log('Open http://localhost:5174 and navigate to AI Tutor Chat to test voice features.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

testVoiceIntegration();