"""
Main RAG Service
Orchestrates document processing, embedding generation, and query processing
"""

import logging
from typing import List, Dict, Any, Optional
import asyncio
from pathlib import Path

from .document_processor import DocumentProcessor, ProcessedChunk
from .embedding_service import EmbeddingService, EmbeddingConfig
from .query_processor import QueryProcessor, UserContext, ConversationContext, RAGResponse

logger = logging.getLogger(__name__)

class RAGServiceConfig:
    """Configuration for RAG service"""
    def __init__(
        self,
        openai_api_key: str,
        pinecone_api_key: str,
        pinecone_environment: str = "us-west1-gcp-free",
        index_name: str = "shikkhasathi-nctb"
    ):
        self.openai_api_key = openai_api_key
        self.pinecone_api_key = pinecone_api_key
        self.pinecone_environment = pinecone_environment
        self.index_name = index_name

class RAGService:
    """Main RAG service orchestrating all components"""
    
    def __init__(self, config: RAGServiceConfig):
        self.config = config
        
        # Initialize components
        self.document_processor = DocumentProcessor()
        
        embedding_config = EmbeddingConfig(
            openai_api_key=config.openai_api_key,
            pinecone_api_key=config.pinecone_api_key,
            pinecone_environment=config.pinecone_environment,
            index_name=config.index_name
        )
        self.embedding_service = EmbeddingService(embedding_config)
        
        self.query_processor = QueryProcessor(
            embedding_service=self.embedding_service,
            openai_api_key=config.openai_api_key
        )
        
        logger.info("RAG Service initialized successfully")
    
    async def process_and_upload_document(
        self, 
        file_path: str,
        progress_callback: Optional[callable] = None
    ) -> Dict[str, Any]:
        """
        Process a single document and upload to vector database
        
        Args:
            file_path: Path to document file
            progress_callback: Optional progress callback
            
        Returns:
            Processing statistics
        """
        try:
            logger.info(f"Processing document: {file_path}")
            
            # Process document into chunks
            chunks = self.document_processor.process_document(file_path)
            
            if not chunks:
                return {
                    "success": False,
                    "error": "No chunks generated from document",
                    "chunks_processed": 0
                }
            
            # Upload chunks to vector database
            upload_stats = await self.embedding_service.upload_chunks_to_vector_db(
                chunks=chunks,
                progress_callback=progress_callback
            )
            
            return {
                "success": True,
                "file_path": file_path,
                "chunks_generated": len(chunks),
                "upload_stats": upload_stats
            }
            
        except Exception as e:
            logger.error(f"Document processing failed for {file_path}: {e}")
            return {
                "success": False,
                "file_path": file_path,
                "error": str(e),
                "chunks_processed": 0
            }
    
    async def batch_process_documents(
        self,
        directory_path: str,
        progress_callback: Optional[callable] = None
    ) -> Dict[str, Any]:
        """
        Process all documents in a directory
        
        Args:
            directory_path: Path to directory containing documents
            progress_callback: Optional progress callback
            
        Returns:
            Batch processing statistics
        """
        try:
            logger.info(f"Starting batch processing of directory: {directory_path}")
            
            # Get all supported files
            directory = Path(directory_path)
            supported_extensions = {'.pdf', '.png', '.jpg', '.jpeg', '.tiff'}
            files = [f for f in directory.rglob('*') if f.suffix.lower() in supported_extensions]
            
            if not files:
                return {
                    "success": False,
                    "error": "No supported files found in directory",
                    "total_files": 0,
                    "processed_files": 0
                }
            
            total_files = len(files)
            processed_files = 0
            failed_files = 0
            total_chunks = 0
            
            results = []
            
            for i, file_path in enumerate(files):
                try:
                    # Process individual file
                    result = await self.process_and_upload_document(
                        str(file_path),
                        progress_callback
                    )
                    
                    results.append(result)
                    
                    if result["success"]:
                        processed_files += 1
                        total_chunks += result.get("chunks_generated", 0)
                    else:
                        failed_files += 1
                    
                    # Overall progress callback
                    if progress_callback:
                        progress_callback(i + 1, total_files)
                    
                    logger.info(f"Processed {i + 1}/{total_files}: {file_path}")
                    
                except Exception as e:
                    logger.error(f"Failed to process {file_path}: {e}")
                    failed_files += 1
                    results.append({
                        "success": False,
                        "file_path": str(file_path),
                        "error": str(e)
                    })
            
            return {
                "success": True,
                "directory_path": directory_path,
                "total_files": total_files,
                "processed_files": processed_files,
                "failed_files": failed_files,
                "total_chunks": total_chunks,
                "results": results
            }
            
        except Exception as e:
            logger.error(f"Batch processing failed: {e}")
            return {
                "success": False,
                "directory_path": directory_path,
                "error": str(e),
                "total_files": 0,
                "processed_files": 0
            }
    
    async def query(
        self,
        question: str,
        user_id: str,
        grade: int,
        subject: Optional[str] = None,
        language_preference: str = "bangla",
        conversation_context: Optional[ConversationContext] = None
    ) -> RAGResponse:
        """
        Process a user query and return AI-generated response
        
        Args:
            question: User question
            user_id: User identifier
            grade: Student grade level
            subject: Optional subject filter
            language_preference: User's language preference
            conversation_context: Optional conversation history
            
        Returns:
            RAG response with answer and sources
        """
        try:
            # Create user context
            user_context = UserContext(
                user_id=user_id,
                grade=grade,
                subject=subject,
                language_preference=language_preference
            )
            
            # Process query
            response = await self.query_processor.process_query(
                query=question,
                user_context=user_context,
                conversation=conversation_context
            )
            
            logger.info(f"Query processed for user {user_id}: {question[:50]}...")
            return response
            
        except Exception as e:
            logger.error(f"Query processing failed: {e}")
            raise
    
    def get_system_stats(self) -> Dict[str, Any]:
        """Get system statistics"""
        try:
            index_stats = self.embedding_service.get_index_stats()
            
            return {
                "vector_database": index_stats,
                "embedding_model": self.embedding_service.config.embedding_model,
                "index_name": self.embedding_service.config.index_name,
                "chunk_size": self.document_processor.chunk_size,
                "chunk_overlap": self.document_processor.chunk_overlap
            }
            
        except Exception as e:
            logger.error(f"Failed to get system stats: {e}")
            return {"error": str(e)}
    
    async def search_documents(
        self,
        query: str,
        subject: Optional[str] = None,
        grade: Optional[int] = None,
        top_k: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Search for documents without generating AI response
        
        Args:
            query: Search query
            subject: Optional subject filter
            grade: Optional grade filter
            top_k: Number of results to return
            
        Returns:
            List of matching document chunks
        """
        try:
            results = await self.embedding_service.search_similar_chunks(
                query=query,
                subject=subject,
                grade=grade,
                top_k=top_k,
                score_threshold=0.5
            )
            
            return results
            
        except Exception as e:
            logger.error(f"Document search failed: {e}")
            raise
    
    def delete_documents_by_subject(self, subject: str, grade: Optional[int] = None):
        """Delete all documents for a specific subject and grade"""
        try:
            filter_dict = {"subject": subject}
            if grade:
                filter_dict["grade"] = grade
            
            namespace = None
            if grade:
                namespace = self.embedding_service.create_namespace(subject, grade)
            
            self.embedding_service.delete_vectors_by_filter(
                filter_dict=filter_dict,
                namespace=namespace
            )
            
            logger.info(f"Deleted documents for subject: {subject}, grade: {grade}")
            
        except Exception as e:
            logger.error(f"Failed to delete documents: {e}")
            raise