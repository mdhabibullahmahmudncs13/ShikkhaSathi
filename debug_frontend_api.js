// Debug script to test frontend API calls directly
// Run this in browser console on http://localhost:5173

console.log('🔍 Debugging Frontend API Calls...');

// Get the token from localStorage
const token = localStorage.getItem('access_token');
console.log('Token found:', !!token);

if (!token) {
    console.error('❌ No access token found. Please login first.');
} else {
    // Test the subjects API call
    fetch('/api/v1/quiz/subjects', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Subjects API Response:', data);
        
        // Check ICT specifically
        const ictSubject = data.subjects?.find(s => s.subject === 'ICT');
        if (ictSubject) {
            console.log('🎯 ICT Subject Data:', ictSubject);
            console.log('ICT Questions:', ictSubject.total_questions);
            console.log('ICT Available:', ictSubject.available);
        } else {
            console.error('❌ ICT subject not found in response');
        }
    })
    .catch(error => {
        console.error('❌ API Error:', error);
    });
}