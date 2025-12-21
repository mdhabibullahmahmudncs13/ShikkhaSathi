# 📄 Text Extraction Pipeline - Complete Guide

## 🎯 **Overview**

The ShikkhaSathi RAG system now includes comprehensive text file saving functionality. Every step of the document processing pipeline saves intermediate text files for debugging, review, and backup purposes.

## 📁 **Directory Structure**

```
backend/data/extracted_text/
├── README.md                           # Documentation
├── pages/                              # Individual page text files
│   ├── english_page_001.txt           # Page 1 from english.pdf
│   ├── english_page_002.txt           # Page 2 from english.pdf
│   ├── physics_grade_9_page_001.txt   # Page 1 from physics textbook
│   └── metadata/                       # Page metadata (JSON files)
│       ├── english_page_001_metadata.json
│       └── physics_grade_9_page_001_metadata.json
├── chunks/                             # Text chunks (800 chars each)
│   ├── english_chunk_001.txt          # First chunk from english.pdf
│   ├── english_chunk_002.txt          # Second chunk from english.pdf
│   ├── physics_grade_9_chunk_001.txt  # First chunk from physics textbook
│   └── metadata/                       # Chunk metadata (JSON files)
│       ├── english_chunk_001_metadata.json
│       └── physics_grade_9_chunk_001_metadata.json
├── full_documents/                     # Complete document text
│   ├── english_full.txt               # Complete text from english.pdf
│   ├── physics_grade_9_full.txt       # Complete physics textbook text
│   └── metadata/                       # Document metadata (JSON files)
│       ├── english_full_metadata.json
│       └── physics_grade_9_full_metadata.json
└── processing_logs/                    # Processing logs and statistics
    ├── english_processing_log.txt     # Processing log for english.pdf
    ├── physics_grade_9_processing_log.txt
    └── extraction_stats.json          # Overall extraction statistics
```

## 🔄 **Pipeline Flow with File Saving**

### **Step 1: PDF Input** 📄
```
Location: backend/data/nctb/
Files: english.pdf, physics_grade_9.pdf, etc.
```

### **Step 2: Text Extraction** 🔤
```
Function: extract_text_from_pdf()
File: backend/app/services/rag/document_processor.py
```

**What gets saved:**
- ✅ **Individual page files**: `english_page_001.txt`, `english_page_002.txt`
- ✅ **Complete document file**: `english_full.txt`
- ✅ **Page metadata**: JSON files with extraction statistics
- ✅ **Processing log**: Detailed extraction log with statistics

### **Step 3: Text Chunking** ✂️
```
Function: chunk_text()
File: backend/app/services/rag/document_processor.py
```

**What gets saved:**
- ✅ **Individual chunk files**: `english_chunk_001.txt`, `english_chunk_002.txt`
- ✅ **Chunk metadata**: JSON files with chunk information
- ✅ **Processing statistics**: Character counts, word counts, etc.

### **Step 4: Vector Storage** 🗄️
```
Function: ingest_pdf()
File: backend/app/services/rag/rag_service.py
Storage: backend/data/chroma_db/
```

## 📝 **File Content Examples**

### **Page File Example** (`english_page_001.txt`):
```
# Page 1 from english
# Extracted on: 2024-12-21T10:30:00
# Character count: 1,245
# Language: english

==================================================

CHAPTER 1: INTRODUCTION TO ENGLISH LITERATURE

English literature encompasses a rich tradition of written works...
[Full page text content here]
```

### **Chunk File Example** (`english_chunk_001.txt`):
```
# Chunk 0 from english
# Page: 1
# Subject: English
# Grade: 9
# Language: english
# Created on: 2024-12-21T10:30:00
# Character count: 800
# Chunk ID: english.pdf_1_0

========================================

CHAPTER 1: INTRODUCTION TO ENGLISH LITERATURE

English literature encompasses a rich tradition of written works
that spans centuries of human expression and creativity...
[Chunk text content - exactly 800 characters with 150 overlap]
```

### **Metadata File Example** (`english_page_001_metadata.json`):
```json
{
  "subject": "English",
  "grade": 9,
  "chapter": 1,
  "topic": "Introduction",
  "language": "english",
  "page_number": 1,
  "textbook_name": "English for Class IX",
  "source_file": "english.pdf",
  "extraction_timestamp": "2024-12-21T10:30:00",
  "character_count": 1245,
  "word_count": 234,
  "line_count": 45,
  "text_file_path": "/path/to/english_page_001.txt"
}
```

### **Processing Log Example** (`english_processing_log.txt`):
```
# Processing Log for english
# Processed on: 2024-12-21T10:30:00

==================================================

## Processing Statistics:
- source_file: data/nctb/english.pdf
- total_pages_in_pdf: 150
- pages_with_text: 148
- pages_skipped: 2
- extraction_success_rate: 98.7%
- total_characters: 245,678
- average_chars_per_page: 1,659

## File Locations:
- Pages directory: data/extracted_text/pages
- Chunks directory: data/extracted_text/chunks
- Full document: data/extracted_text/full_documents

## Processing Configuration:
- Chunk size: 800
- Chunk overlap: 150
```

## 🚀 **How to Use**

### **1. Process a Single PDF:**
```bash
cd backend
python ingest_documents.py --file data/nctb/english.pdf
```

### **2. Process All PDFs:**
```bash
cd backend
python ingest_documents.py --directory data/nctb/
```

### **3. Test Text Extraction:**
```bash
cd backend
python test_text_extraction.py
```

### **4. View Extracted Files:**
```bash
# List all extracted text files
find backend/data/extracted_text -name "*.txt" | head -10

# View a page file
cat backend/data/extracted_text/pages/english_page_001.txt

# View a chunk file
cat backend/data/extracted_text/chunks/english_chunk_001.txt

# View processing log
cat backend/data/extracted_text/processing_logs/english_processing_log.txt
```

## 🔍 **Benefits of Text File Saving**

### **1. Debugging & Quality Control**
- **Review extraction quality**: Check if PDF text extraction is accurate
- **Identify issues**: Find pages with poor OCR or formatting problems
- **Compare versions**: Track changes in extraction algorithms

### **2. Manual Review & Editing**
- **Content verification**: Manually review extracted content for accuracy
- **Text cleaning**: Apply additional cleaning to specific files if needed
- **Quality assurance**: Ensure curriculum content is properly extracted

### **3. Backup & Recovery**
- **Data preservation**: Keep extracted text even if vector database is lost
- **Reprocessing**: Quickly reprocess text without re-extracting from PDFs
- **Version control**: Track different versions of extracted content

### **4. Analysis & Statistics**
- **Content analysis**: Analyze text structure, language distribution
- **Processing metrics**: Track extraction success rates and performance
- **Curriculum mapping**: Understand content distribution across subjects

### **5. Development & Testing**
- **Unit testing**: Use saved text files for testing chunking algorithms
- **Performance testing**: Measure processing speed with known content
- **Algorithm tuning**: Optimize text processing parameters

## 📊 **File Size Estimates**

### **Typical File Sizes:**
- **Page file**: 1-5 KB per page (depending on content density)
- **Chunk file**: 800-1000 bytes per chunk (as configured)
- **Full document**: 100 KB - 2 MB per textbook
- **Metadata files**: 1-2 KB per file
- **Processing logs**: 2-5 KB per document

### **Storage Requirements:**
- **Small textbook** (50 pages): ~500 KB total
- **Large textbook** (200 pages): ~2 MB total
- **Complete curriculum** (20 textbooks): ~40 MB total

## 🧹 **Maintenance**

### **Cleanup Commands:**
```bash
# Remove old extracted text files
rm -rf backend/data/extracted_text/pages/*
rm -rf backend/data/extracted_text/chunks/*
rm -rf backend/data/extracted_text/full_documents/*

# Keep only recent processing logs
find backend/data/extracted_text/processing_logs -name "*.txt" -mtime +30 -delete
```

### **Archive Commands:**
```bash
# Archive old extracted text
tar -czf extracted_text_backup_$(date +%Y%m%d).tar.gz backend/data/extracted_text/

# Compress large text files
gzip backend/data/extracted_text/full_documents/*.txt
```

## 🎯 **Integration with RAG Pipeline**

The text file saving is seamlessly integrated with the existing RAG pipeline:

1. **PDF Processing** → Saves page and full document files
2. **Text Chunking** → Saves individual chunk files  
3. **Embedding Generation** → Uses chunks (can read from saved files)
4. **Vector Storage** → Stores in ChromaDB (with text file backup)
5. **Query Processing** → Retrieves from vector DB (can fallback to text files)

## 🔧 **Configuration**

### **Customize Text Saving:**
```python
# In document_processor.py
class DocumentProcessor:
    def __init__(self, 
                 chunk_size: int = 800,           # Chunk size
                 chunk_overlap: int = 150,        # Chunk overlap
                 save_pages: bool = True,         # Save individual pages
                 save_chunks: bool = True,        # Save individual chunks
                 save_full_docs: bool = True,     # Save full documents
                 save_logs: bool = True):         # Save processing logs
```

### **Directory Customization:**
```python
# Custom directories
self.extracted_text_dir = Path("custom/path/extracted_text")
self.pages_dir = self.extracted_text_dir / "pages"
self.chunks_dir = self.extracted_text_dir / "chunks"
```

## 🎉 **Summary**

The enhanced text extraction pipeline now provides:

✅ **Complete text file backup** for all processing steps  
✅ **Detailed metadata** for every extracted piece of content  
✅ **Processing logs** with statistics and performance metrics  
✅ **Organized directory structure** for easy navigation  
✅ **Debugging capabilities** for quality control  
✅ **Backup and recovery** options for data preservation  

This makes the ShikkhaSathi RAG system more robust, debuggable, and maintainable while providing complete transparency into the document processing pipeline! 🇧🇩📚🤖