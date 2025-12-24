"""
Multi-Model AI Tutor Service for ShikkhaSathi
Uses specialized models for different subjects:
- Bangla: Specialized model for Bengali language and literature
- Math: Math-focused model for mathematical concepts
- General: General model for other subjects (Physics, Chemistry, Biology, English)
"""

import logging
from typing import List, Dict, Any, Optional, Union
from enum import Enum

# Optional imports for AI features
try:
    from langchain_ollama import ChatOllama
    from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
    LANGCHAIN_AVAILABLE = True
except ImportError:
    ChatOllama = None
    HumanMessage = None
    AIMessage = None
    SystemMessage = None
    LANGCHAIN_AVAILABLE = False

from .rag_service import rag_service
from .banglabert_service import banglabert_service

logger = logging.getLogger(__name__)

class SubjectCategory(Enum):
    BANGLA = "bangla"
    MATH = "math"
    GENERAL = "general"

class ModelConfig:
    """Configuration for different subject models"""
    
    MODELS = {
        SubjectCategory.BANGLA: {
            "model_name": "banglabert",  # Use BanglaBERT for Bengali language
            "model_type": "banglabert",
            "temperature": 0.6,
            "system_prompt_suffix": """
You are specialized in Bengali language and literature using BanglaBERT. You have deep knowledge of:
- Bengali grammar, syntax, and linguistics
- Bengali literature, poetry, and prose
- Cultural context of Bangladesh and Bengali heritage
- Writing techniques in Bengali
- Translation between Bengali and English

Always provide examples in Bengali script when relevant and explain cultural nuances.
Use proper Bengali language structure and cultural context in your responses.
"""
        },
        SubjectCategory.MATH: {
            "model_name": "phi3:mini",  # Phi-3-mini model for mathematical precision
            "model_type": "ollama",
            "temperature": 0.2,  # Very low temperature for mathematical precision
            "system_prompt_suffix": """
You are specialized in mathematics education using Phi-3-mini model. You excel at:
- Breaking down complex mathematical problems into clear steps
- Explaining mathematical concepts with precise reasoning
- Providing multiple solution approaches when applicable
- Connecting math to real-world applications
- Identifying common mathematical errors and misconceptions
- Using proper mathematical notation and terminology

Always show step-by-step solutions and explain the reasoning behind each step.
Use clear mathematical notation and provide practice problems when helpful.
Focus on accuracy and logical progression in mathematical problem-solving.
"""
        },
        SubjectCategory.GENERAL: {
            "model_name": "llama3.2:1b",  # Efficient model for general subjects
            "model_type": "ollama",
            "temperature": 0.7,
            "system_prompt_suffix": """
You are knowledgeable in science subjects (Physics, Chemistry, Biology) and English.
You provide clear explanations with:
- Scientific accuracy and proper terminology
- Real-world examples and applications
- Connections between different scientific concepts
- Practical demonstrations and experiments when relevant

For English, focus on grammar, vocabulary, comprehension, and writing skills.
"""
        }
    }

class MultiModelAITutorService:
    def __init__(self):
        """Initialize multi-model AI tutor service"""
        self.models = {}
        self.base_system_prompt = """You are ShikkhaSathi, an AI tutor designed specifically for Bangladesh students in Classes 9 & 10. You help students prepare for their SSC examinations.

Your role:
- Provide clear, educational explanations appropriate for SSC level
- Use examples relevant to Bangladesh context and NCTB curriculum
- Encourage critical thinking and problem-solving
- Be patient and supportive
- Adapt your language for both Bangla and English medium students
- Use provided curriculum context for accurate, curriculum-aligned answers

Guidelines:
- Always be encouraging and positive
- Break down complex concepts into simple steps
- Ask follow-up questions to check understanding
- Provide practical examples and SSC exam applications
- If unsure, admit it and suggest how to find the answer
- Keep responses concise but comprehensive
- Focus on SSC exam preparation strategies

Remember: Guide learning, don't just give answers. Help students understand concepts for long-term retention."""
        
        if not LANGCHAIN_AVAILABLE:
            logger.warning("LangChain dependencies not available. Multi-model AI Tutor will run in limited mode.")
            return
        
        # Initialize models for each category
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize specialized models for each subject category"""
        for category, config in ModelConfig.MODELS.items():
            try:
                if config.get("model_type") == "banglabert":
                    # BanglaBERT is handled by banglabert_service
                    self.models[category] = "banglabert"
                    logger.info(f"Initialized {category.value} model: BanglaBERT")
                else:
                    # Ollama models
                    self.models[category] = ChatOllama(
                        model=config["model_name"],
                        temperature=config["temperature"]
                    )
                    logger.info(f"Initialized {category.value} model: {config['model_name']}")
            except Exception as e:
                logger.error(f"Failed to initialize {category.value} model: {e}")
                # Fallback to a basic model
                try:
                    self.models[category] = ChatOllama(
                        model="llama3.2:1b",
                        temperature=0.7
                    )
                    logger.info(f"Using fallback model for {category.value}")
                except Exception as fallback_error:
                    logger.error(f"Failed to initialize fallback model for {category.value}: {fallback_error}")
                    self.models[category] = None
    
    def _categorize_subject(self, subject: Optional[str], message: str) -> SubjectCategory:
        """Determine which model category to use based on subject and message content"""
        if not subject:
            # Analyze message content for subject hints
            message_lower = message.lower()
            
            # Bengali language indicators
            bangla_keywords = ['বাংলা', 'bangla', 'bengali', 'সাহিত্য', 'কবিতা', 'গল্প', 'ব্যাকরণ', 'রচনা']
            if any(keyword in message_lower for keyword in bangla_keywords):
                return SubjectCategory.BANGLA
            
            # Math indicators
            math_keywords = ['গণিত', 'math', 'mathematics', 'equation', 'algebra', 'geometry', 'calculus', 
                           'সমীকরণ', 'বীজগণিত', 'জ্যামিতি', 'ত্রিকোণমিতি', 'solve', 'calculate']
            if any(keyword in message_lower for keyword in math_keywords):
                return SubjectCategory.MATH
            
            return SubjectCategory.GENERAL
        
        # Subject-based categorization
        subject_lower = subject.lower()
        
        if subject_lower in ['bangla', 'বাংলা', 'bengali']:
            return SubjectCategory.BANGLA
        elif subject_lower in ['mathematics', 'math', 'গণিত', 'algebra', 'geometry', 'trigonometry']:
            return SubjectCategory.MATH
        else:
            return SubjectCategory.GENERAL
    
    def _get_specialized_system_prompt(self, category: SubjectCategory, subject: Optional[str], grade: Optional[int], context: str) -> str:
        """Build specialized system prompt for the subject category"""
        base_prompt = self.base_system_prompt
        
        # Add category-specific specialization
        if category in ModelConfig.MODELS:
            base_prompt += ModelConfig.MODELS[category]["system_prompt_suffix"]
        
        if subject:
            base_prompt += f"\n\nCurrent subject focus: {subject}"
        
        if grade:
            base_prompt += f"\nStudent grade level: {grade} (SSC preparation)"
        
        if context and context != "No relevant context found in the curriculum documents.":
            base_prompt += f"\n\nRelevant NCTB curriculum context:\n{context}"
            base_prompt += "\n\nUse this context to provide accurate, curriculum-aligned responses for SSC preparation."
        
        return base_prompt
    
    async def chat(self, 
                   message: str, 
                   conversation_history: List[Dict[str, str]] = None,
                   subject: Optional[str] = None,
                   grade: Optional[int] = None,
                   model_category: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a chat message using the specified model category
        
        Args:
            message: User's message
            conversation_history: Previous conversation messages
            subject: Current subject context
            grade: Student's grade level
            model_category: Required model category ('bangla', 'math', 'general')
            
        Returns:
            Dict containing response and metadata
        """
        try:
            # Validate model category is provided
            if not model_category:
                return {
                    "response": "Please select a model category (Bangla, Math, or General) before asking your question.",
                    "sources": [],
                    "context_used": False,
                    "model": "none",
                    "category": "none",
                    "specialized": False,
                    "error": "Model category not specified"
                }
            
            # Convert string to enum
            try:
                if model_category.lower() == 'bangla':
                    category = SubjectCategory.BANGLA
                elif model_category.lower() == 'math':
                    category = SubjectCategory.MATH
                elif model_category.lower() == 'general':
                    category = SubjectCategory.GENERAL
                else:
                    return {
                        "response": "Invalid model category. Please select 'bangla', 'math', or 'general'.",
                        "sources": [],
                        "context_used": False,
                        "model": "invalid",
                        "category": model_category,
                        "specialized": False,
                        "error": "Invalid model category"
                    }
            except Exception as e:
                return {
                    "response": "Error processing model category selection.",
                    "sources": [],
                    "context_used": False,
                    "model": "error",
                    "category": "error",
                    "specialized": False,
                    "error": str(e)
                }
            
            # Get the specified model
            model = self.models.get(category)
            
            if not model:
                logger.error(f"No model available for category {category.value}")
                return {
                    "response": f"The {category.value} model is currently unavailable. Please try again later or select a different model.",
                    "sources": [],
                    "context_used": False,
                    "model": "unavailable",
                    "category": category.value,
                    "specialized": False,
                    "error": "Model not available"
                }
            
            # Get relevant context from RAG system
            context = await rag_service.get_context_for_query(message, subject)
            
            # Handle BanglaBERT separately
            if category == SubjectCategory.BANGLA and model == "banglabert":
                # Use BanglaBERT service for Bengali language processing
                if not banglabert_service.is_available():
                    # Fallback to Ollama model if BanglaBERT is not available
                    logger.warning("BanglaBERT not available, falling back to Ollama model")
                    try:
                        fallback_model = ChatOllama(model="llama3.2:3b", temperature=0.6)
                        system_prompt = self._get_specialized_system_prompt(category, subject, grade, context)
                        messages = [SystemMessage(content=system_prompt)]
                        
                        if conversation_history:
                            for msg in conversation_history[-10:]:
                                if msg['role'] == 'user':
                                    messages.append(HumanMessage(content=msg['content']))
                                elif msg['role'] == 'assistant':
                                    messages.append(AIMessage(content=msg['content']))
                        
                        messages.append(HumanMessage(content=message))
                        response = await fallback_model.ainvoke(messages)
                        
                        sources = self._extract_sources_from_context(context)
                        return {
                            "response": response.content,
                            "sources": sources,
                            "context_used": bool(context and context != "No relevant context found in the curriculum documents."),
                            "model": "llama3.2:3b (fallback)",
                            "category": category.value,
                            "specialized": True,
                            "user_selected": True
                        }
                    except Exception as e:
                        logger.error(f"Fallback model also failed: {e}")
                        return {
                            "response": "দুঃখিত, বাংলা মডেল এই মুহূর্তে উপলব্ধ নেই। অনুগ্রহ করে পরে চেষ্টা করুন।",
                            "sources": [],
                            "context_used": False,
                            "model": "unavailable",
                            "category": category.value,
                            "specialized": False,
                            "error": "BanglaBERT and fallback unavailable"
                        }
                
                # Use BanglaBERT for Bengali processing
                bangla_result = await banglabert_service.process_bangla_query(
                    message=message,
                    context=context,
                    subject=subject,
                    grade=grade
                )
                
                sources = self._extract_sources_from_context(context)
                return {
                    "response": bangla_result["response"],
                    "sources": sources,
                    "context_used": bool(context and context != "No relevant context found in the curriculum documents."),
                    "model": "banglabert",
                    "category": category.value,
                    "specialized": True,
                    "user_selected": True
                }
            
            # Handle Ollama models (Math and General)
            else:
                # Build specialized system prompt
                system_prompt = self._get_specialized_system_prompt(category, subject, grade, context)
                
                # Build conversation messages
                messages = [SystemMessage(content=system_prompt)]
                
                # Add conversation history
                if conversation_history:
                    for msg in conversation_history[-10:]:  # Keep last 10 messages for context
                        if msg['role'] == 'user':
                            messages.append(HumanMessage(content=msg['content']))
                        elif msg['role'] == 'assistant':
                            messages.append(AIMessage(content=msg['content']))
                
                # Add current message
                messages.append(HumanMessage(content=message))
                
                # Get response from specified model
                response = await model.ainvoke(messages)
                
                # Extract sources from context
                sources = self._extract_sources_from_context(context)
                
                # Get model name for this category
                model_name = ModelConfig.MODELS[category]["model_name"]
                
                return {
                    "response": response.content,
                    "sources": sources,
                    "context_used": bool(context and context != "No relevant context found in the curriculum documents."),
                    "model": model_name,
                    "category": category.value,
                    "specialized": True,
                    "user_selected": True
                }
            
        except Exception as e:
            logger.error(f"Error in multi-model AI tutor chat: {str(e)}")
            return {
                "response": "I'm sorry, I'm having trouble processing your question right now. Please try again in a moment.",
                "sources": [],
                "context_used": False,
                "model": "error",
                "category": model_category or "unknown",
                "specialized": False,
                "error": str(e)
            }
    
    async def explain_concept(self, 
                            concept: str, 
                            subject: str, 
                            grade: int,
                            difficulty_level: str = "basic",
                            model_category: Optional[str] = None) -> Dict[str, Any]:
        """
        Provide a detailed explanation using the specified model category
        """
        try:
            # Validate model category is provided
            if not model_category:
                return {
                    "explanation": "Please select a model category (Bangla, Math, or General) for concept explanation.",
                    "error": "Model category not specified"
                }
            
            # Convert string to enum
            try:
                if model_category.lower() == 'bangla':
                    category = SubjectCategory.BANGLA
                elif model_category.lower() == 'math':
                    category = SubjectCategory.MATH
                elif model_category.lower() == 'general':
                    category = SubjectCategory.GENERAL
                else:
                    return {
                        "explanation": "Invalid model category. Please select 'bangla', 'math', or 'general'.",
                        "error": "Invalid model category"
                    }
            except Exception as e:
                return {
                    "explanation": "Error processing model category selection.",
                    "error": str(e)
                }
            
            model = self.models.get(category)
            
            if not model:
                return {
                    "explanation": f"The {category.value} model is currently unavailable for concept explanation.",
                    "error": "Model not available"
                }
            
            # Get relevant context
            context = await rag_service.get_context_for_query(f"{concept} {subject}", subject)
            
            # Handle BanglaBERT for Bengali concepts
            if category == SubjectCategory.BANGLA and model == "banglabert":
                if banglabert_service.is_available():
                    bangla_result = await banglabert_service.explain_bangla_concept(
                        concept=concept,
                        difficulty_level=difficulty_level,
                        grade=grade
                    )
                    
                    sources = self._extract_sources_from_context(context)
                    return {
                        "explanation": bangla_result["explanation"],
                        "concept": concept,
                        "subject": subject,
                        "grade": grade,
                        "difficulty_level": difficulty_level,
                        "sources": sources,
                        "model": "banglabert",
                        "category": category.value
                    }
                else:
                    return {
                        "explanation": "BanglaBERT মডেল এই মুহূর্তে উপলব্ধ নেই। অনুগ্রহ করে পরে চেষ্টা করুন।",
                        "error": "BanglaBERT not available"
                    }
            
            # Handle Ollama models for other subjects
            
            # Handle Ollama models for other subjects
            # Build specialized prompt based on category
            if category == SubjectCategory.MATH:
                structure_prompt = """
1. Mathematical definition with proper notation
2. Step-by-step breakdown of the concept
3. Worked example with detailed solution steps
4. Common mistakes students make
5. Practice problem for SSC preparation
"""
            elif category == SubjectCategory.BANGLA:
                structure_prompt = """
1. বাংলায় সংজ্ঞা (Definition in Bengali)
2. মূল বিষয়গুলি (Key points)
3. বাংলাদেশের প্রেক্ষাপটে উদাহরণ (Example in Bangladesh context)
4. সাধারণ ভুলত্রুটি (Common mistakes)
5. SSC পরীক্ষার জন্য অনুশীলন পরামর্শ (SSC exam practice suggestion)
"""
            else:
                structure_prompt = """
1. Clear scientific definition
2. Key principles (3-5 main points)
3. Real-world application in Bangladesh context
4. Common misconceptions to avoid
5. SSC exam preparation tip
"""
            
            prompt = f"""Explain the concept of "{concept}" in {subject} for a Class {grade} student preparing for SSC.

Difficulty level: {difficulty_level}

Please structure your explanation as follows:
{structure_prompt}

Context from NCTB curriculum:
{context}

Make it engaging, accurate, and focused on SSC exam success."""

            system_prompt = self._get_specialized_system_prompt(category, subject, grade, context)
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=prompt)
            ]
            
            response = await model.ainvoke(messages)
            sources = self._extract_sources_from_context(context)
            model_name = ModelConfig.MODELS[category]["model_name"]
            
            return {
                "explanation": response.content,
                "concept": concept,
                "subject": subject,
                "grade": grade,
                "difficulty_level": difficulty_level,
                "sources": sources,
                "model": model_name,
                "category": category.value
            }
            
        except Exception as e:
            logger.error(f"Error explaining concept {concept}: {str(e)}")
            return {
                "explanation": f"I'm sorry, I couldn't generate an explanation for {concept} right now.",
                "error": str(e)
            }
    
    def _extract_sources_from_context(self, context: str) -> List[str]:
        """Extract source information from context"""
        sources = []
        if context and "Source" in context:
            lines = context.split('\n')
            for line in lines:
                if line.startswith("Source") and "(" in line and ")" in line:
                    # Extract filename from "Source 1 (filename.pdf):"
                    start = line.find("(") + 1
                    end = line.find(")")
                    if start > 0 and end > start:
                        sources.append(line[start:end])
        return sources
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about available models"""
        model_info = {}
        for category, config in ModelConfig.MODELS.items():
            if config.get("model_type") == "banglabert":
                # Get BanglaBERT info
                bangla_info = banglabert_service.get_model_info()
                model_info[category.value] = {
                    "model_name": "banglabert",
                    "temperature": config["temperature"],
                    "available": bangla_info["available"],
                    "specialization": "Bengali language and literature (BanglaBERT)",
                    "model_type": "transformers"
                }
            else:
                # Ollama models
                model_info[category.value] = {
                    "model_name": config["model_name"],
                    "temperature": config["temperature"],
                    "available": self.models.get(category) is not None,
                    "specialization": category.value,
                    "model_type": "ollama"
                }
        return model_info

# Global multi-model AI tutor service instance
multi_model_ai_tutor_service = MultiModelAITutorService()