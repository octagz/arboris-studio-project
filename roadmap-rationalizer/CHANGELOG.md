# Changelog

## [0.1.1] - 2024-10-31

### Added
- **PDF Support**: Added ability to upload and parse PDF files using pdfjs-dist
- PDF files are now automatically detected and parsed to extract text content
- PDF parsing uses Mozilla's pdfjs-dist library with worker from CDN

### Changed
- Updated FileUpload component to accept `.pdf` files
- Updated file parser to handle PDF format
- Documentation updated to reflect PDF support

## [0.1.0] - 2024-10-31

### Initial Release
- React 19 + Vite application
- File upload with drag-and-drop
- Support for `.txt`, `.md`, and `.json` files
- Perplexity AI integration for risk analysis
- Agentic workflow with multiple LLM calls
- Risk analysis across three dimensions (Financial, Technical, Competitive)
- Interactive option tree visualization
- Export to HTML and PDF reports
- Tailwind CSS styling
- Sample data included

