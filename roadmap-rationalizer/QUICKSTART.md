# Quick Start Guide

## Setting Up Environment

### Option 1: Mock Data Mode (Recommended for Development)

1. Create a `.env` file in the project root:
```bash
cd roadmap-rationalizer
```

2. Add to `.env`:
```
VITE_USE_MOCK_DATA=true
```

**Benefits:**
- No API key required
- No token costs
- Fast development
- Uses realistic mock data based on E Ink case study

### Option 2: Production Mode (Real API)

1. Get your Perplexity API key from [https://www.perplexity.ai/api](https://www.perplexity.ai/api)

2. Create a `.env` file in the project root:
```bash
cd roadmap-rationalizer
```

3. Edit `.env` and add:
```
VITE_PERPLEXITY_API_KEY=pk-your-actual-key-here
VITE_USE_MOCK_DATA=false
```

4. Restart the dev server if it's already running

## Running the Application

```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

## Testing with Sample Data

The project includes sample data in the `sample-data/` directory:

1. Navigate to the app at `http://localhost:5173`
2. Drag and drop the following files into the upload area:
   - `sample-data/product-context.txt`
   - `sample-data/decision-options.md`
3. Wait for the AI analysis to complete (typically 30-60 seconds for 3-6 branches)
4. Review the risk analysis for each branch
5. Export a report using the buttons at the top

## How the Agentic Workflow Works

The application uses a sophisticated multi-step approach:

1. **Context Setting** (1 LLM call)
   - Reads and analyzes all uploaded files
   - Extracts key information about goals, markets, features, financials, etc.

2. **Branch Identification** (1 LLM call)
   - Identifies decision branches from the context
   - Creates 3-6 distinct roadmap options

3. **Risk Analysis** (4 parallel calls per branch)
   - Financial Risk Analysis
   - Technical Risk Analysis
   - Competitive Risk Analysis
   - Ecosystemic Risk Analysis

4. **Risk Level Determination** (1 LLM call per branch)
   - Synthesizes all risk analyses
   - Assigns overall risk level (HIGH/MEDIUM/LOW)
   - Generates mitigation strategies

**Total LLM calls**: 2 + (branches × 5)

For 6 branches: 2 + (6 × 5) = 32 API calls

## Understanding the Results

### Risk Levels

- **🔴 HIGH**: Significant risks across multiple dimensions. Proceed with caution and strong mitigation plans.
- **🟡 MEDIUM**: Manageable risks with proper planning. Standard due diligence recommended.
- **🟢 LOW**: Low-risk option. Minimal concerns, good for quick decisions.

### Risk Categories

Each branch is analyzed across four dimensions:

1. **Financial Risks**: Investment required, ROI uncertainty, market size validation, cash flow
2. **Technical Risks**: Complexity, team capabilities, integration challenges, scalability
3. **Competitive Risks**: Market positioning, differentiation, competitor responses, defensibility
4. **Ecosystemic Risks**: Initiative risks, interdependence risks with partners, and integration risks across the value chain

### Mitigation Strategies

Each branch receives 3 specific, actionable mitigation strategies based on the identified risks.

## Exporting Reports

### HTML Export
- Full interactive report with all details
- Easy to share via email or web
- Preserves formatting and styles

### PDF Export
- Professional document for presentations
- Print-ready format
- Suitable for stakeholder reviews

## Troubleshooting

### API Key Issues
- Make sure your `.env` file exists in the project root
- Ensure `VITE_PERPLEXITY_API_KEY` is set correctly
- Restart the dev server after changing `.env`
- Check the browser console for API errors

### Analysis Takes Too Long
- Each branch requires 5 API calls (4 risk analyses + 1 risk level determination)
- Network latency can affect timing
- 6 branches typically take 45-75 seconds
- Progress is shown in real-time

### No Branches Identified
- Check that your files contain decision/option information
- Try with the included sample data
- Ensure files are readable text format

### Export Not Working
- Check browser console for errors
- Ensure you have at least one branch analyzed
- Try refreshing the page and re-analyzing

## Next Steps

- Customize the analysis prompts in `src/services/perplexityApi.js`
- Add more risk categories in the service layer
- Integrate with other LLM providers
- Add support for more file formats

## Support

For issues or questions, refer to the main README.md or open an issue on the repository.

