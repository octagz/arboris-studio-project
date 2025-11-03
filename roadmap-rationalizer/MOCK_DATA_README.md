# Mock Data Feature

This document explains the mock data feature for the Roadmap Rationalizer.

## Overview

The mock data feature allows you to develop and test the application without making actual API calls to Perplexity. This saves tokens, reduces development costs, and enables faster iteration.

## How to Enable Mock Data

Set the `VITE_USE_MOCK_DATA` environment variable to `true` in your `.env` file:

```bash
VITE_USE_MOCK_DATA=true
```

When this is enabled, all API functions will use pre-generated mock data instead of making real API calls.

## Mock Data Sources

The mock data is based on the comprehensive analysis found in `roadmap-risk-analysis.html`. It includes:

- **6 decision branches**: Manufacturing Scale-Up, Market Sequencing, Technology Platform Evolution, Partnership and Go-To-Market Strategy, Funding and Resource Allocation, and Patent and IP Strategy
- **Complete risk analyses**: Financial, technical, and competitive risk assessments for each branch
- **Risk level determinations**: Overall risk levels with reasoning and mitigation strategies
- **Context summary**: Realistic project context for the E Ink electronic paper technology

## Benefits

1. **No API Costs**: Avoid spending money on Perplexity API tokens during development
2. **Fast Development**: No network latency, instant responses
3. **Realistic Data**: Based on a real-world case study
4. **Consistent Results**: Same data every time, easier to debug UI/UX
5. **Offline Development**: Work without internet connection

## Mock Data Structure

The mock data file (`src/services/mockData.js`) exports:

- `mockContext`: A summary of the project context
- `mockBranches`: Array of decision branch objects with names and descriptions
- `mockRiskAnalyses`: Object mapping branch names to their risk analyses
- `mockRiskLevels`: Object mapping branch names to risk level determinations

## Console Logging

When mock data is enabled, you'll see helpful console messages:

```
🧪 Mock Data Mode Enabled - Using mock data instead of API calls
📋 Using mock data for setContext
🌳 Using mock data for identifyDecisionBranches
💰 Using mock data for analyzeFinancialRisk: Manufacturing Scale-Up
🔧 Using mock data for analyzeTechnicalRisk: Manufacturing Scale-Up
⚔️ Using mock data for analyzeCompetitiveRisk: Manufacturing Scale-Up
🎯 Using mock data for determineRiskLevel: Manufacturing Scale-Up
```

## Production Mode

To use the real Perplexity API:

```bash
VITE_USE_MOCK_DATA=false
VITE_PERPLEXITY_API_KEY=your_actual_api_key_here
```

You'll see:
```
🚀 Production Mode - Using Perplexity API
```

## Testing

The mock data has been designed to match the structure and content of real API responses, so switching between mock and production modes should be seamless. The UI and all features work identically with both modes.

## Customizing Mock Data

To add or modify mock data, edit `src/services/mockData.js`. The structure should match the expected API response formats:

- Branches: `{ name: string, description: string }`
- Risk analyses: `string` (markdown-formatted text)
- Risk levels: `{ level: string, reasoning: string, mitigation: string[] }`

## Future Enhancements

Potential improvements to the mock data system:

- Multiple scenario sets (different case studies)
- Randomized data variations for testing
- Configurable delays to simulate network latency
- More comprehensive test coverage
- Faker.js integration for generating varied mock data

