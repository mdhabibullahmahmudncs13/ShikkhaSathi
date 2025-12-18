"""
Document Processing Pipeline for NCTB Content
Handles PDF text extraction, OCR processing, and text chunking
"""

import os
import logging
from typing import List, Dict, Any, Optional
from pathlib import Path
import PyPDF2
import pytesseract
from PIL import Image
import io
import re
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from pydantic import BaseModel

logger = logging.getLogger(__name__)

class DocumentMetadata(BaseModel):
    """Metadata structure for processed documents"""
    subject: str
    grade: int
    chapter: Optional[int] = None
    topic: Optional[str] = None
    language: str = "bangla"
    page_number: Optional[int] = None
    textbook_name: Optional[str] = None
    source_file: str
    chunk_index: int = 0

class ProcessedChunk(BaseModel):
    """Processed document chunk with metadata"""
    content: str
    metadata: DocumentMetadata
    chunk_id: str

class DocumentProcessor:
    """Main document processing pipeline for NCTB content"""
    
    def __init__(self, chunk_size: int = 800, chunk_overlap: int = 150):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", "।", ".", " ", ""]
        )
        
    def extract_text_from_pdf(self, pdf_path: str) -> List[Dict[str, Any]]:
        """
        Extract text from PDF file with page-level metadata
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            List of dictionaries containing text and page metadata
        """
        try:
            pages_data = []
            
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                for page_num, page in enumerate(pdf_reader.pages, 1):
                    try:
                        text = page.extract_text()
                        if text.strip():  # Only include pages with text
                            pages_data.append({
                                'text': text,
                                'page_number': page_num,
                                'source_file': os.path.basename(pdf_path)
                            })
                    except Exception as e:
                        logger.warning(f"Failed to extract text from page {page_num}: {e}")
                        continue
                        
            logger.info(f"Extracted text from {len(pages_data)} pages from {pdf_path}")
            return pages_data
            
        except Exception as e:
            logger.error(f"Failed to process PDF {pdf_path}: {e}")
            raise
    
    def process_with_ocr(self, image_path: str, language: str = "ben+eng") -> str:
        """
        Process image with OCR for Bangla text extraction
        
        Args:
            image_path: Path to the image file
            language: Tesseract language code (ben for Bangla, eng for English)
            
        Returns:
            Extracted text from image
        """
        try:
            image = Image.open(image_path)
            
            # Configure Tesseract for better Bangla recognition
            custom_config = f'--oem 3 --psm 6 -l {language}'
            text = pytesseract.image_to_string(image, config=custom_config)
            
            return self._clean_ocr_text(text)
            
        except Exception as e:
            logger.error(f"OCR processing failed for {image_path}: {e}")
            raise
    
    def _clean_ocr_text(self, text: str) -> str:
        """Clean and normalize OCR extracted text"""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove common OCR artifacts
        text = re.sub(r'[^\w\s\u0980-\u09FF।,;:.!?()-]', '', text)
        
        # Normalize Bangla punctuation
        text = text.replace('|', '।')
        
        return text.strip()
    
    def extract_metadata_from_filename(self, filename: str) -> Dict[str, Any]:
        """
        Extract metadata from standardized filename patterns
        Expected format: subject_grade_chapter_topic.pdf
        Example: physics_9_3_newtons_laws.pdf
        """
        try:
            base_name = Path(filename).stem
            parts = base_name.split('_')
            
            metadata = {
                'source_file': filename,
                'subject': parts[0].title() if len(parts) > 0 else 'Unknown',
                'grade': int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else 9,
                'chapter': int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else None,
                'topic': ' '.join(parts[3:]).replace('_', ' ').title() if len(parts) > 3 else None,
                'language': 'bangla',  # Default to Bangla for NCTB content
                'textbook_name': f"{parts[0].title()} for Class {parts[1] if len(parts) > 1 else 'IX'}"
            }
            
            return metadata
            
        except Exception as e:
            logger.warning(f"Could not extract metadata from filename {filename}: {e}")
            return {
                'source_file': filename,
                'subject': 'Unknown',
                'grade': 9,
                'language': 'bangla'
            }
    
    def detect_language(self, text: str) -> str:
        """
        Detect if text is primarily Bangla or English
        
        Args:
            text: Text to analyze
            
        Returns:
            'bangla' or 'english'
        """
        # Count Bangla Unicode characters
        bangla_chars = len(re.findall(r'[\u0980-\u09FF]', text))
        english_chars = len(re.findall(r'[a-zA-Z]', text))
        
        # If more than 30% Bangla characters, consider it Bangla
        total_chars = bangla_chars + english_chars
        if total_chars > 0 and bangla_chars / total_chars > 0.3:
            return 'bangla'
        else:
            return 'english'
    
    def chunk_text(self, text: str, metadata: Dict[str, Any]) -> List[ProcessedChunk]:
        """
        Split text into chunks with metadata preservation
        
        Args:
            text: Text to chunk
            metadata: Base metadata to attach to chunks
            
        Returns:
            List of ProcessedChunk objects
        """
        try:
            # Create LangChain document
            doc = Document(page_content=text, metadata=metadata)
            
            # Split into chunks
            chunks = self.text_splitter.split_documents([doc])
            
            processed_chunks = []
            for i, chunk in enumerate(chunks):
                # Create chunk metadata
                chunk_metadata = DocumentMetadata(
                    **metadata,
                    chunk_index=i
                )
                
                # Generate unique chunk ID
                chunk_id = f"{metadata.get('source_file', 'unknown')}_{metadata.get('page_number', 0)}_{i}"
                
                processed_chunk = ProcessedChunk(
                    content=chunk.page_content,
                    metadata=chunk_metadata,
                    chunk_id=chunk_id
                )
                
                processed_chunks.append(processed_chunk)
            
            return processed_chunks
            
        except Exception as e:
            logger.error(f"Text chunking failed: {e}")
            raise
    
    def validate_document(self, file_path: str) -> bool:
        """
        Validate document before processing
        
        Args:
            file_path: Path to document file
            
        Returns:
            True if document is valid for processing
        """
        try:
            if not os.path.exists(file_path):
                return False
                
            file_size = os.path.getsize(file_path)
            
            # Check file size (max 50MB)
            if file_size > 50 * 1024 * 1024:
                logger.warning(f"File {file_path} too large: {file_size} bytes")
                return False
            
            # Check file extension
            valid_extensions = {'.pdf', '.png', '.jpg', '.jpeg', '.tiff'}
            if Path(file_path).suffix.lower() not in valid_extensions:
                logger.warning(f"Unsupported file type: {file_path}")
                return False
                
            return True
            
        except Exception as e:
            logger.error(f"Document validation failed for {file_path}: {e}")
            return False
    
    def process_document(self, file_path: str) -> List[ProcessedChunk]:
        """
        Main document processing pipeline
        
        Args:
            file_path: Path to document file
            
        Returns:
            List of processed chunks with metadata
        """
        try:
            # Validate document
            if not self.validate_document(file_path):
                raise ValueError(f"Invalid document: {file_path}")
            
            # Extract base metadata from filename
            base_metadata = self.extract_metadata_from_filename(file_path)
            
            all_chunks = []
            file_extension = Path(file_path).suffix.lower()
            
            if file_extension == '.pdf':
                # Process PDF
                pages_data = self.extract_text_from_pdf(file_path)
                
                for page_data in pages_data:
                    # Update metadata with page info
                    page_metadata = {**base_metadata, **page_data}
                    
                    # Detect language
                    page_metadata['language'] = self.detect_language(page_data['text'])
                    
                    # Chunk the page text
                    page_chunks = self.chunk_text(page_data['text'], page_metadata)
                    all_chunks.extend(page_chunks)
                    
            elif file_extension in {'.png', '.jpg', '.jpeg', '.tiff'}:
                # Process image with OCR
                text = self.process_with_ocr(file_path)
                
                if text.strip():
                    # Update metadata
                    base_metadata['language'] = self.detect_language(text)
                    base_metadata['page_number'] = 1
                    
                    # Chunk the extracted text
                    chunks = self.chunk_text(text, base_metadata)
                    all_chunks.extend(chunks)
            
            logger.info(f"Processed {file_path} into {len(all_chunks)} chunks")
            return all_chunks
            
        except Exception as e:
            logger.error(f"Document processing failed for {file_path}: {e}")
            raise

    def batch_process_documents(self, directory_path: str) -> List[ProcessedChunk]:
        """
        Process all documents in a directory
        
        Args:
            directory_path: Path to directory containing documents
            
        Returns:
            List of all processed chunks
        """
        try:
            all_chunks = []
            directory = Path(directory_path)
            
            if not directory.exists():
                raise ValueError(f"Directory does not exist: {directory_path}")
            
            # Find all supported files
            supported_extensions = {'.pdf', '.png', '.jpg', '.jpeg', '.tiff'}
            files = [f for f in directory.rglob('*') if f.suffix.lower() in supported_extensions]
            
            logger.info(f"Found {len(files)} documents to process in {directory_path}")
            
            for file_path in files:
                try:
                    chunks = self.process_document(str(file_path))
                    all_chunks.extend(chunks)
                except Exception as e:
                    logger.error(f"Failed to process {file_path}: {e}")
                    continue
            
            logger.info(f"Batch processing complete: {len(all_chunks)} total chunks")
            return all_chunks
            
        except Exception as e:
            logger.error(f"Batch processing failed: {e}")
            raise