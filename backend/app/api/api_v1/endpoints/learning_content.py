"""
Learning Content API endpoints
Serves real NCTB textbook content instead of dummy data
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session

from app.core import deps
from app.services.content_ingestion_service import content_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/textbooks", response_model=List[str])
def get_available_textbooks():
    """Get list of available NCTB textbooks"""
    try:
        textbooks = content_service.get_available_textbooks()
        return textbooks
    except Exception as e:
        logger.error(f"Error fetching textbooks: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch textbooks")

@router.get("/arenas", response_model=Dict[str, Any])
def get_learning_arenas(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_user)
):
    """Get learning arenas based on real NCTB textbook content"""
    try:
        arenas = []
        textbook_files = content_service.get_available_textbooks()
        
        # Process textbooks that have proper chapter structure
        for filename in textbook_files:
            textbook = content_service.parse_textbook_file(filename)
            if textbook and len(textbook.chapters) > 0:
                arena_data = content_service.generate_learning_content(textbook)
                arenas.append(arena_data)
        
        # Add fallback arenas for subjects without proper chapter structure
        fallback_arenas = create_fallback_arenas()
        
        # Only add fallback arenas if we don't have real content for those subjects
        existing_subjects = {arena['subject'].lower() for arena in arenas}
        for fallback in fallback_arenas:
            if fallback['subject'].lower() not in existing_subjects:
                arenas.append(fallback)
        
        # Add mock progress data
        progress = []
        stats = {
            'totalXP': 500,
            'currentLevel': 3,
            'arenasUnlocked': len(arenas),
            'adventuresCompleted': 1,
            'topicsCompleted': 5,
            'averageBloomLevel': 2.2,
            'streak': 7,
            'achievements': [
                {
                    'id': 'first-adventure',
                    'name': 'First Adventure',
                    'description': 'Complete your first adventure',
                    'icon': '🎯',
                    'type': 'adventure',
                    'requirement': 1,
                    'progress': 1,
                    'isUnlocked': True,
                    'unlockedAt': '2024-12-20T00:00:00Z'
                }
            ]
        }
        
        return {
            'arenas': arenas,
            'progress': progress,
            'stats': stats
        }
        
    except Exception as e:
        logger.error(f"Error generating learning arenas: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate learning content")

def create_fallback_arenas():
    """Create fallback learning arenas for subjects without proper textbook parsing"""
    fallback_arenas = [
        {
            'id': 'arena-bangla',
            'name': 'বাংলা সাহিত্য Arena',
            'subject': 'Bangla',
            'description': 'বাংলা সাহিত্যের গল্প, কবিতা ও প্রবন্ধ অধ্যয়ন করুন',
            'icon': '📚',
            'color': 'yellow',
            'bgGradient': 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20',
            'totalAdventures': 5,
            'completedAdventures': 0,
            'totalXP': 2500,
            'earnedXP': 0,
            'isUnlocked': True,
            'adventures': [
                {
                    'id': 'adventure-bangla-1',
                    'arenaId': 'arena-bangla',
                    'name': 'গল্প সংকলন',
                    'chapter': 'গদ্য অংশ',
                    'description': 'বিখ্যাত লেখকদের গল্প পড়ুন ও বিশ্লেষণ করুন',
                    'difficulty': 'Beginner',
                    'estimatedTime': 45,
                    'totalTopics': 6,
                    'completedTopics': 0,
                    'totalXP': 500,
                    'earnedXP': 0,
                    'isUnlocked': True,
                    'isCompleted': False,
                    'topics': [
                        {
                            'id': 'topic-bangla-1-1',
                            'adventureId': 'adventure-bangla-1',
                            'name': 'ফুলের বিবাহ',
                            'description': 'বঙ্কিমচন্দ্র চট্টোপাধ্যায়ের গল্প',
                            'content': 'বঙ্কিমচন্দ্র চট্টোপাধ্যায়ের "ফুলের বিবাহ" একটি সামাজিক গল্প...',
                            'bloomLevel': 1,
                            'xpReward': 100,
                            'isCompleted': False,
                            'isUnlocked': True,
                            'questions': []
                        }
                    ],
                    'chapterBonus': 100
                }
            ]
        },
        {
            'id': 'arena-chemistry',
            'name': 'Chemistry Arena',
            'subject': 'Chemistry',
            'description': 'রসায়নের মৌলিক ধারণা ও বিক্রিয়া শিখুন',
            'icon': '🧪',
            'color': 'green',
            'bgGradient': 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
            'totalAdventures': 4,
            'completedAdventures': 0,
            'totalXP': 2000,
            'earnedXP': 0,
            'isUnlocked': True,
            'adventures': [
                {
                    'id': 'adventure-chemistry-1',
                    'arenaId': 'arena-chemistry',
                    'name': 'পরমাণুর গঠন',
                    'chapter': 'Chapter 1',
                    'description': 'পরমাণুর গঠন ও ইলেকট্রন বিন্যাস',
                    'difficulty': 'Beginner',
                    'estimatedTime': 60,
                    'totalTopics': 4,
                    'completedTopics': 0,
                    'totalXP': 500,
                    'earnedXP': 0,
                    'isUnlocked': True,
                    'isCompleted': False,
                    'topics': [
                        {
                            'id': 'topic-chemistry-1-1',
                            'adventureId': 'adventure-chemistry-1',
                            'name': 'পরমাণুর মৌলিক কণিকা',
                            'description': 'প্রোটন, নিউট্রন ও ইলেকট্রন সম্পর্কে জানুন',
                            'content': 'পরমাণু তিনটি মৌলিক কণিকা দিয়ে গঠিত: প্রোটন, নিউট্রন ও ইলেকট্রন...',
                            'bloomLevel': 1,
                            'xpReward': 100,
                            'isCompleted': False,
                            'isUnlocked': True,
                            'questions': []
                        }
                    ],
                    'chapterBonus': 100
                }
            ]
        },
        {
            'id': 'arena-biology',
            'name': 'Biology Arena',
            'subject': 'Biology',
            'description': 'জীববিজ্ঞানের বিভিন্ন শাখা অধ্যয়ন করুন',
            'icon': '🧬',
            'color': 'red',
            'bgGradient': 'bg-gradient-to-br from-red-500/20 to-orange-500/20',
            'totalAdventures': 5,
            'completedAdventures': 0,
            'totalXP': 2500,
            'earnedXP': 0,
            'isUnlocked': True,
            'adventures': [
                {
                    'id': 'adventure-biology-1',
                    'arenaId': 'arena-biology',
                    'name': 'কোশ বিজ্ঞান',
                    'chapter': 'Chapter 1',
                    'description': 'কোশের গঠন ও কার্যাবলী',
                    'difficulty': 'Beginner',
                    'estimatedTime': 50,
                    'totalTopics': 5,
                    'completedTopics': 0,
                    'totalXP': 500,
                    'earnedXP': 0,
                    'isUnlocked': True,
                    'isCompleted': False,
                    'topics': [
                        {
                            'id': 'topic-biology-1-1',
                            'adventureId': 'adventure-biology-1',
                            'name': 'কোশের আবিষ্কার',
                            'description': 'কোশ আবিষ্কারের ইতিহাস ও কোশ তত্ত্ব',
                            'content': 'রবার্ট হুক ১৬৬৫ সালে প্রথম কোশ আবিষ্কার করেন...',
                            'bloomLevel': 1,
                            'xpReward': 100,
                            'isCompleted': False,
                            'isUnlocked': True,
                            'questions': []
                        }
                    ],
                    'chapterBonus': 100
                }
            ]
        }
    ]
    
    return fallback_arenas

@router.get("/arena/{arena_id}", response_model=Dict[str, Any])
def get_arena_detail(
    arena_id: str,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_user)
):
    """Get detailed information about a specific arena"""
    try:
        # First, get all arenas (same logic as get_learning_arenas)
        arenas = []
        textbook_files = content_service.get_available_textbooks()
        
        # Process textbooks that have proper chapter structure
        for filename in textbook_files:
            textbook = content_service.parse_textbook_file(filename)
            if textbook and len(textbook.chapters) > 0:
                arena_data = content_service.generate_learning_content(textbook)
                arenas.append(arena_data)
        
        # Add fallback arenas for subjects without proper chapter structure
        fallback_arenas = create_fallback_arenas()
        
        # Only add fallback arenas if we don't have real content for those subjects
        existing_subjects = {arena['subject'].lower() for arena in arenas}
        for fallback in fallback_arenas:
            if fallback['subject'].lower() not in existing_subjects:
                arenas.append(fallback)
        
        # Find the requested arena
        target_arena = None
        for arena in arenas:
            if arena['id'] == arena_id:
                target_arena = arena
                break
        
        if not target_arena:
            raise HTTPException(status_code=404, detail="Arena not found")
        
        # Add mock progress data
        progress = []
        
        return {
            'arena': target_arena,
            'adventures': target_arena['adventures'],
            'progress': progress
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching arena detail: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch arena details")

@router.get("/adventure/{adventure_id}", response_model=Dict[str, Any])
def get_adventure_detail(
    adventure_id: str,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_user)
):
    """Get detailed information about a specific adventure (chapter)"""
    try:
        # Parse adventure_id to extract subject and chapter
        # Format: "adventure-mathematics-1"
        parts = adventure_id.split('-')
        if len(parts) < 3:
            raise HTTPException(status_code=400, detail="Invalid adventure ID format")
        
        subject = parts[1].title()
        chapter_num = int(parts[2])
        
        # Find matching textbook file
        textbook_files = content_service.get_available_textbooks()
        matching_file = None
        
        for filename in textbook_files:
            if subject.lower() in filename.lower():
                matching_file = filename
                break
        
        if not matching_file:
            raise HTTPException(status_code=404, detail="Adventure not found")
        
        # Parse textbook
        textbook = content_service.parse_textbook_file(matching_file)
        if not textbook:
            raise HTTPException(status_code=500, detail="Failed to parse textbook content")
        
        # Find the specific chapter
        target_chapter = None
        for chapter in textbook.chapters:
            if chapter.number == chapter_num:
                target_chapter = chapter
                break
        
        if not target_chapter:
            raise HTTPException(status_code=404, detail="Chapter not found")
        
        # Generate adventure data
        arena_data = content_service.generate_learning_content(textbook)
        adventure_data = None
        
        for adventure in arena_data['adventures']:
            if adventure['id'] == adventure_id:
                adventure_data = adventure
                break
        
        if not adventure_data:
            raise HTTPException(status_code=404, detail="Adventure not found")
        
        # Mock progress data
        progress = {
            'adventureId': adventure_id,
            'isStarted': True,
            'isCompleted': False,
            'currentTopicIndex': 0,
            'totalScore': 0,
            'earnedXP': 0,
            'topicProgress': [],
            'startedAt': '2024-12-25T00:00:00Z'
        }
        
        return {
            'adventure': adventure_data,
            'topics': adventure_data['topics'],
            'progress': progress
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching adventure detail: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch adventure details")

@router.get("/topic/{topic_id}", response_model=Dict[str, Any])
def get_topic_detail(
    topic_id: str,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_user)
):
    """Get detailed information about a specific topic"""
    try:
        # Parse topic_id to extract subject, chapter, and topic
        # Format: "topic-mathematics-1-1"
        parts = topic_id.split('-')
        if len(parts) < 4:
            raise HTTPException(status_code=400, detail="Invalid topic ID format")
        
        subject = parts[1].title()
        chapter_num = int(parts[2])
        topic_num = int(parts[3])
        
        # Find matching textbook file
        textbook_files = content_service.get_available_textbooks()
        matching_file = None
        
        for filename in textbook_files:
            if subject.lower() in filename.lower():
                matching_file = filename
                break
        
        if not matching_file:
            raise HTTPException(status_code=404, detail="Topic not found")
        
        # Parse textbook and generate content
        textbook = content_service.parse_textbook_file(matching_file)
        if not textbook:
            raise HTTPException(status_code=500, detail="Failed to parse textbook content")
        
        arena_data = content_service.generate_learning_content(textbook)
        
        # Find the specific topic
        topic_data = None
        for adventure in arena_data['adventures']:
            if adventure['id'] == f"adventure-{subject.lower()}-{chapter_num}":
                if topic_num <= len(adventure['topics']):
                    topic_data = adventure['topics'][topic_num - 1]
                break
        
        if not topic_data:
            raise HTTPException(status_code=404, detail="Topic not found")
        
        return {
            'topic': topic_data,
            'content': topic_data['content'],
            'nextTopic': None,  # Would be calculated based on progress
            'previousTopic': None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching topic detail: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch topic details")

@router.post("/topic/{topic_id}/submit-quiz")
def submit_topic_quiz(
    topic_id: str,
    quiz_data: Dict[str, Any],
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_user)
):
    """Submit quiz answers for a topic"""
    try:
        # In a real system, this would evaluate answers and update progress
        # For now, return mock results
        
        answers = quiz_data.get('answers', [])
        time_spent = quiz_data.get('timeSpent', 0)
        
        # Mock evaluation
        total_questions = len(answers)
        correct_answers = max(1, int(total_questions * 0.7))  # Assume 70% correct
        score_percentage = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        
        result = {
            'score': correct_answers * 10,  # 10 points per correct answer
            'totalPoints': total_questions * 10,
            'xpEarned': int(score_percentage),
            'bloomScores': {
                '1': score_percentage,
                '2': score_percentage * 0.8
            },
            'feedback': [
                {
                    'questionId': answer.get('questionId', ''),
                    'isCorrect': i < correct_answers,
                    'userAnswer': answer.get('answer', ''),
                    'correctAnswer': 'Sample correct answer',
                    'explanation': 'This is the correct answer because...',
                    'bloomLevel': 1
                }
                for i, answer in enumerate(answers)
            ],
            'isTopicCompleted': score_percentage >= 70,
            'isAdventureCompleted': False,
            'nextTopic': None
        }
        
        return result
        
    except Exception as e:
        logger.error(f"Error submitting quiz: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit quiz")