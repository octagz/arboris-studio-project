# Roadmap Rationalizer 🎯

A web-based prototype tool that helps Product Managers visualize risk chains and evaluate roadmap decisions through an AI-powered Option Tree Simulator.

## Overview

The Roadmap Rationalizer addresses the critical challenge of understanding the *risk chain reaction* of each roadmap decision. It enables PMs to:

- **Visualize decision branches** - See all possible paths and their interconnections
- **Identify hidden risks** - Get AI-powered risk analysis across financial, technical, competitive, and ecosystemic dimensions
- **Generate actionable insights** - Receive specific mitigation strategies for each decision branch
- **Export professional reports** - Share findings with stakeholders via HTML or PDF reports

## Features

- 📊 **Interactive Option Tree** - Visual representation of decision branches
- 🤖 **AI-Powered Analysis** - Uses Perplexity AI for multi-dimensional risk assessment
- 🗺️ **Strategic Roadmap Plan** - AI-generated actionable recommendations and prioritized action items
- 🔄 **Agentic Workflow** - Sequential, specialized LLM calls for accurate analysis
- ⚡ **Real-time Processing** - Fast analysis with progress tracking
- 📄 **Export Capabilities** - Generate HTML and PDF reports
- 🎨 **Modern UI** - Beautiful Tailwind CSS interface
- 📈 **Multiple View Modes** - Decision Tree, Risk Radar, Card View, and Roadmap Plan

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **AI**: Perplexity API (sonar-pro)
- **File Handling**: react-dropzone
- **PDF Parsing**: pdfjs-dist
- **PDF Export**: jsPDF
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Perplexity API key ([Get one here](https://www.perplexity.ai/api))

### Installation

1. Clone the repository:
```bash
cd roadmap-rationalizer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:
```bash
# For development without API costs, use mock data:
VITE_USE_MOCK_DATA=true

# For production with real API:
# VITE_PERPLEXITY_API_KEY=your_actual_api_key_here
# VITE_USE_MOCK_DATA=false
```

**Mock Data Mode** (Recommended for development):
- Set `VITE_USE_MOCK_DATA=true` to use pre-generated mock data
- No API key required
- Avoids token costs during development
- Uses realistic data based on the E Ink case study

**Production Mode**:
- Get your Perplexity API key from: https://www.perplexity.ai/api
- Set `VITE_PERPLEXITY_API_KEY=your_actual_api_key_here`
- Set `VITE_USE_MOCK_DATA=false`

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

6. (Optional) Test with sample data by uploading files from the `sample-data/` directory

## Usage

1. **Upload Context Files**: Drag and drop or select files containing:
   - Product goals and objectives
   - Target markets and segments
   - Key features and capabilities
   - Financial projections
   - Technical requirements
   - Competitive landscape details

   Supported formats: `.txt`, `.md`, `.json`, `.pdf`

2. **Wait for Analysis**: The system will:
   - Extract key information from your files
   - Identify decision branches
   - Analyze risks across 4 dimensions (financial, technical, competitive, ecosystemic)
   - Determine overall risk levels
   - Generate mitigation strategies

3. **Review Results**: Explore the interactive tree with:
   - Risk ratings (High/Medium/Low)
   - Detailed analysis for each category
   - Specific mitigation recommendations

4. **Export Report**: Generate a professional report in HTML or PDF format

## Agentic Workflow

The system uses a sophisticated multi-step LLM workflow:

1. **Context Setting** - First LLM call extracts key information from uploaded files
2. **Branch Identification** - Second call identifies decision branches
3. **Parallel Risk Analysis** - Four simultaneous calls analyze:
   - Financial risks (investment, ROI, cash flow)
   - Technical risks (complexity, feasibility, scalability)
   - Competitive risks (market positioning, differentiation)
   - Ecosystemic risks (partner dependencies, value chain adoption)
4. **Risk Level Determination** - Final call synthesizes findings and assigns overall risk level

This approach ensures specialized, accurate analysis for each dimension.

### Ecosystemic Risk Analysis

Based on Ron Adner's framework, the ecosystemic risk analysis evaluates:
- **Initiative Risks**: Internal project execution capabilities
- **Interdependence Risks**: Partner coordination and joint probability of success
- **Integration Risks**: Value chain adoption barriers and cumulative delays

## Project Structure

```
roadmap-rationalizer/
├── src/
│   ├── components/          # React components
│   │   ├── FileUpload.jsx
│   │   ├── BranchCard.jsx
│   │   ├── OptionTree.jsx
│   │   └── LoadingSpinner.jsx
│   ├── services/            # API services
│   │   └── perplexityApi.js
│   ├── utils/               # Utility functions
│   │   ├── fileParser.js
│   │   └── exportReport.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── .env.example            # Environment template
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies

```

## Development

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

### Lint:
```bash
npm run lint
```

## Performance

- Processing time: ~10 seconds per branch for ≤ 20 nodes
- Supports real-time progress updates
- Optimized parallel API calls for faster analysis

## Limitations & Future Enhancements

**Current Prototype:**
- Uses sample data and rule-based heuristics
- No live API integrations
- Limited to Perplexity AI

**Future Improvements:**
- Live market data integration
- Multi-LLM support
- Collaborative features
- Historical risk tracking
- Custom risk frameworks
- Integration with project management tools

## License

This project is a prototype for demonstration purposes.

## Contributing

This is a prototype project. Contributions and suggestions are welcome!

## Support

For issues or questions, please open an issue on the repository.
