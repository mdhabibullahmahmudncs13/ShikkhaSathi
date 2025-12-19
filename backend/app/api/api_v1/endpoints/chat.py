import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, Query, UploadFile, File
from fastapi.responses import Response
from app.services.websocket_manager import manager
from app.services.voice_service import get_voice_service
from app.core.deps import get_current_user
from app.models.user import User
from app.db.mongodb import get_mongodb
from typing import Optional
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str, token: str = Query(...)):
    """WebSocket endpoint for real-time chat communication"""
    try:
        # Verify user authentication using token
        # Note: In a real implementation, you'd validate the JWT token here
        # For now, we'll extract user_id from the token parameter
        user_id = token  # Simplified for demo - should be JWT validation
        
        await manager.connect(websocket, user_id, session_id)
        
        # Send connection confirmation
        await manager.send_personal_message({
            "type": "connection_status",
            "status": "connected",
            "session_id": session_id
        }, session_id)
        
        try:
            while True:
                # Receive message from client
                data = await websocket.receive_text()
                message_data = json.loads(data)
                
                # Process different message types
                message_type = message_data.get("type", "message")
                
                if message_type == "message":
                    await manager.process_user_message(message_data, user_id, session_id)
                elif message_type == "ping":
                    # Respond to ping with pong for connection health check
                    await manager.send_personal_message({
                        "type": "pong",
                        "timestamp": message_data.get("timestamp")
                    }, session_id)
                
        except WebSocketDisconnect:
            manager.disconnect(session_id, user_id)
            logger.info(f"WebSocket disconnected for user {user_id}")
        except Exception as e:
            logger.error(f"WebSocket error for user {user_id}: {e}")
            manager.disconnect(session_id, user_id)
            
    except Exception as e:
        logger.error(f"WebSocket connection error: {e}")
        await websocket.close(code=1008, reason="Authentication failed")

@router.get("/history/{session_id}")
async def get_chat_history(
    session_id: str,
    current_user: User = Depends(get_current_user),
    limit: int = Query(50, ge=1, le=100)
):
    """Get chat history for a specific session"""
    try:
        db = get_mongodb()
        chat_collection = db.chat_history
        
        session_doc = await chat_collection.find_one(
            {"user_id": str(current_user.id), "session_id": session_id}
        )
        
        if not session_doc:
            return {"messages": [], "session_id": session_id}
        
        messages = session_doc.get("messages", [])
        # Return last 'limit' messages
        recent_messages = messages[-limit:] if len(messages) > limit else messages
        
        return {
            "messages": recent_messages,
            "session_id": session_id,
            "total_messages": len(messages)
        }
        
    except Exception as e:
        logger.error(f"Error retrieving chat history: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve chat history")

@router.get("/sessions")
async def get_user_sessions(current_user: User = Depends(get_current_user)):
    """Get all chat sessions for the current user"""
    try:
        db = get_mongodb()
        chat_collection = db.chat_history
        
        sessions = await chat_collection.find(
            {"user_id": str(current_user.id)},
            {"session_id": 1, "created_at": 1, "updated_at": 1, "messages": {"$slice": -1}}
        ).to_list(length=100)
        
        # Format sessions with last message preview
        formatted_sessions = []
        for session in sessions:
            last_message = session.get("messages", [{}])[-1] if session.get("messages") else {}
            formatted_sessions.append({
                "session_id": session["session_id"],
                "created_at": session.get("created_at"),
                "updated_at": session.get("updated_at"),
                "last_message_preview": last_message.get("content", "")[:100] if last_message else "",
                "last_message_timestamp": last_message.get("timestamp") if last_message else None
            })
        
        return {"sessions": formatted_sessions}
        
    except Exception as e:
        logger.error(f"Error retrieving user sessions: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve sessions")

@router.delete("/sessions/{session_id}")
async def delete_chat_session(
    session_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a specific chat session"""
    try:
        db = get_mongodb()
        chat_collection = db.chat_history
        
        result = await chat_collection.delete_one({
            "user_id": str(current_user.id),
            "session_id": session_id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return {"message": "Session deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting chat session: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete session")

@router.post("/voice/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Transcribe audio to text using Whisper API"""
    try:
        # Validate file type
        if not audio.content_type or not audio.content_type.startswith('audio/'):
            raise HTTPException(status_code=400, detail="Invalid audio file format")
        
        # Read audio data
        audio_data = await audio.read()
        
        if len(audio_data) == 0:
            raise HTTPException(status_code=400, detail="Empty audio file")
        
        # Process voice message
        voice_service = get_voice_service()
        result = await voice_service.process_voice_message(audio_data)
        
        if result["success"]:
            return {
                "text": result["text"],
                "language": result.get("detected_language", "en"),
                "confidence": result.get("confidence", 0.0)
            }
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "Transcription failed"))
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error transcribing audio: {e}")
        raise HTTPException(status_code=500, detail="Failed to transcribe audio")

@router.post("/voice/synthesize")
async def synthesize_speech(
    text: str,
    language: str = "bn",
    current_user: User = Depends(get_current_user)
):
    """Convert text to speech using ElevenLabs API"""
    try:
        if not text or len(text.strip()) == 0:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        if len(text) > 5000:  # Limit text length
            raise HTTPException(status_code=400, detail="Text too long (max 5000 characters)")
        
        # Generate speech
        voice_service = get_voice_service()
        result = await voice_service.text_to_speech(text, language)
        
        if result["success"] and result["audio_data"]:
            return Response(
                content=result["audio_data"],
                media_type=result["content_type"],
                headers={
                    "Content-Disposition": "attachment; filename=speech.mp3",
                    "X-Text-Length": str(len(text)),
                    "X-Language": language
                }
            )
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "Speech synthesis failed"))
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error synthesizing speech: {e}")
        raise HTTPException(status_code=500, detail="Failed to synthesize speech")