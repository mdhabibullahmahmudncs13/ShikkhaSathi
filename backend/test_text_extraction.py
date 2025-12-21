#!/usr/bin/env python3
"""
Test Script for Text Extraction and File Saving
Demonstrates the enhanced document processor with text file saving
"""

import asyncio
import sys
import os
from pathlib import Path

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.rag.document_processor import DocumentProcessor
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def test_text_extraction():
    """Test the enhanced text extraction with file saving"""
    
    # Initialize document processor
    processor = DocumentProcessor()
    
    # Test file path
    test_pdf = "data/nctb/english.pdf"
    
    if not Path(test_pdf).exists():
        logger.error(f"❌ Test file not found: {test_pdf}")
        logger.info("📝 Please add a PDF file to data/nctb/ directory")
        return
    
    logger.info("🚀 Testing Enhanced Text Extraction with File Saving")
    logger.info("="*60)
    
    try:
        # Step 1: Extract text from PDF (saves page and full document files)
        logger.info("📄 Step 1: Extracting text from PDF...")
        pages_data = processor.extract_text_from_pdf(test_pdf)
        
        if not pages_data:
            logger.error("❌ No text extracted from PDF")
            return
        
        logger.info(f"✅ Extracted text from {len(pages_data)} pages")
        
        # Step 2: Process first page for chunking demonstration
        logger.info("\n✂️ Step 2: Chunking text from first page...")
        
        first_page = pages_data[0]
        base_metadata = processor.extract_metadata_from_filename(test_pdf)
        page_metadata = {**base_metadata, **first_page}
        page_metadata['language'] = processor.detect_language(first_page['text'])
        
        # Chunk the text (saves chunk files)
        chunks = processor.chunk_text(first_page['text'], page_metadata)
        
        logger.info(f"✅ Created {len(chunks)} text chunks")
        
        # Step 3: Show file locations
        logger.info("\n📁 Generated Files:")
        logger.info("-" * 40)
        
        extracted_dir = Path("data/extracted_text")
        
        # Count files in each directory
        pages_files = list((extracted_dir / "pages").glob("*.txt"))
        chunks_files = list((extracted_dir / "chunks").glob("*.txt"))
        full_doc_files = list((extracted_dir / "full_documents").glob("*.txt"))
        log_files = list((extracted_dir / "processing_logs").glob("*.txt"))
        
        logger.info(f"📄 Page files: {len(pages_files)} files in data/extracted_text/pages/")
        logger.info(f"✂️ Chunk files: {len(chunks_files)} files in data/extracted_text/chunks/")
        logger.info(f"📚 Full document files: {len(full_doc_files)} files in data/extracted_text/full_documents/")
        logger.info(f"📋 Log files: {len(log_files)} files in data/extracted_text/processing_logs/")
        
        # Show sample file contents
        if pages_files:
            logger.info(f"\n📖 Sample page file: {pages_files[0].name}")
            with open(pages_files[0], 'r', encoding='utf-8') as f:
                sample_content = f.read()[:200] + "..." if len(f.read()) > 200 else f.read()
                logger.info(f"Content preview: {sample_content}")
        
        if chunks_files:
            logger.info(f"\n🧩 Sample chunk file: {chunks_files[0].name}")
            with open(chunks_files[0], 'r', encoding='utf-8') as f:
                sample_content = f.read()[:200] + "..." if len(f.read()) > 200 else f.read()
                logger.info(f"Content preview: {sample_content}")
        
        logger.info("\n🎉 Text extraction and file saving test completed successfully!")
        logger.info(f"📁 All extracted text files are saved in: {extracted_dir.absolute()}")
        
    except Exception as e:
        logger.error(f"❌ Test failed: {str(e)}")
        raise

def show_directory_structure():
    """Show the directory structure for extracted text files"""
    
    logger.info("\n📁 Directory Structure for Extracted Text:")
    logger.info("="*50)
    
    extracted_dir = Path("data/extracted_text")
    
    if not extracted_dir.exists():
        logger.info("❌ Extracted text directory doesn't exist yet")
        logger.info("💡 Run the text extraction test first")
        return
    
    def print_tree(directory, prefix="", max_files=5):
        """Print directory tree structure"""
        items = list(directory.iterdir())
        dirs = [item for item in items if item.is_dir()]
        files = [item for item in items if item.is_file()]
        
        # Print directories first
        for i, dir_item in enumerate(dirs):
            is_last_dir = i == len(dirs) - 1 and len(files) == 0
            current_prefix = "└── " if is_last_dir else "├── "
            logger.info(f"{prefix}{current_prefix}{dir_item.name}/")
            
            next_prefix = prefix + ("    " if is_last_dir else "│   ")
            print_tree(dir_item, next_prefix, max_files)
        
        # Print files
        for i, file_item in enumerate(files):
            if i >= max_files:
                logger.info(f"{prefix}├── ... and {len(files) - max_files} more files")
                break
            
            is_last = i == len(files) - 1
            current_prefix = "└── " if is_last else "├── "
            file_size = file_item.stat().st_size
            size_str = f" ({file_size:,} bytes)" if file_size < 1024*1024 else f" ({file_size/(1024*1024):.1f} MB)"
            logger.info(f"{prefix}{current_prefix}{file_item.name}{size_str}")
    
    logger.info(f"data/extracted_text/")
    print_tree(extracted_dir, "")

if __name__ == "__main__":
    print("🧪 ShikkhaSathi Text Extraction Test")
    print("="*50)
    
    # Show current directory structure
    show_directory_structure()
    
    # Run the test
    asyncio.run(test_text_extraction())
    
    # Show updated directory structure
    print("\n" + "="*50)
    show_directory_structure()