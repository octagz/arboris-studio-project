# Ecosystemic Risk Analysis Implementation

## Overview

This document describes the implementation of **Ecosystemic Risk Analysis** in the Roadmap Rationalizer application, based on Ron Adner's framework from "Match Your Innovation Strategy to Your Innovation Ecosystem".

## Implementation Date

October 31, 2025

## What Was Implemented

### 1. New Risk Analysis Function

**File:** `src/services/perplexityApi.js`

Added `analyzeEcosystemicRisk()` function that analyzes three fundamental types of ecosystemic risks:

#### 1.1 Initiative Risks
Uncertainties related to managing the focal project itself:
- **Product feasibility**: Can the product/service be delivered on time and to specification?
- **Customer benefit**: What is the likely benefit to target customers?
- **Competition**: What competitive threats exist?
- **Supply chain appropriateness**: Is the supply chain adequate?
- **Project team quality**: Does the team have the necessary capabilities?

#### 1.2 Interdependence Risks
Uncertainties of coordinating with complementary innovators:
- **Partner dependencies**: Which partners' projects must succeed before yours can?
- **Joint probability of success**: What is the likelihood all partners will deliver on time?
- **Weak links**: Are there any particularly challenging dependencies?
- **Delay factors**: What could cause partner delays?

The function calculates joint probability by multiplying individual partner success probabilities, highlighting the multiplicative nature of interdependence risk.

#### 1.3 Integration Risks
Uncertainties presented by the adoption process across the value chain:
- **Intermediary adoption**: Who must adopt before end consumers can access it?
- **Adoption cycles**: How long will each intermediary take to adopt?
- **Cost-benefit analysis**: Do benefits exceed costs at every adoption step?
- **Switching costs**: What indirect costs exist?
- **Processing time**: How long will integration take?

The function maps the complete value chain and estimates cumulative adoption delays by adding adoption cycles at each step.

### 2. Mock Data Implementation

**File:** `src/services/mockData.js`

Added comprehensive mock ecosystemic risk analyses for all 6 decision branches:
- Manufacturing Scale-Up
- Market Sequencing
- Technology Platform Evolution
- Partnership and Go-To-Market Strategy
- Funding and Resource Allocation
- Patent and IP Strategy

Each mock analysis includes:
- Detailed assessment of initiative, interdependence, and integration risks
- Severity ratings (High/Medium/Low) for each risk component
- Joint probability calculations for interdependence risks
- Value chain mapping for integration risks
- Cumulative timeline estimates

### 3. Application Integration

**File:** `src/App.jsx`

Modified the main application to:
- Import the new `analyzeEcosystemicRisk` function
- Include ecosystemic risk in parallel risk analysis calls (now 4 parallel calls instead of 3)
- Store ecosystemic risk data in the branch state
- Pass ecosystemic risk to the `determineRiskLevel` function for overall risk assessment
- Updated UI description to mention four risk dimensions

### 4. Visualization Updates

**File:** `src/components/TreeDiagram.jsx`

Enhanced the tree diagram visualization to:
- Display a 4th risk node for ecosystemic risk with a 🌐 icon
- Use orange color scheme for ecosystemic risk nodes
- Adjust vertical spacing to accommodate 4 risk nodes per decision branch
- Add appropriate styling and icons for the new risk type
- Display ecosystemic risk analysis in the side panel with proper formatting

### 5. Export Functionality

**File:** `src/utils/exportReport.js`

Updated both HTML and PDF export functions to:
- Include ecosystemic risk section in reports
- Update executive summary to mention four risk dimensions
- Maintain consistent formatting with other risk categories

### 6. Documentation Updates

**File:** `QUICKSTART.md`

Updated documentation to reflect:
- 4 parallel risk analysis calls per branch (instead of 3)
- New total API call count: 2 + (branches × 5)
- Updated timing estimates (45-75 seconds for 6 branches)
- Description of the new ecosystemic risk category

## Key Features

### Comprehensive Analysis

The ecosystemic risk analysis provides:
- **Structured assessment** across three distinct risk categories
- **Quantitative insights** through joint probability calculations
- **Visual mapping** of value chains and dependencies
- **Timeline estimates** for adoption cycles

### Ron Adner Framework Alignment

The implementation closely follows Adner's research:
- Initiative risks assess project execution capability
- Interdependence risks use multiplicative probability to show compounding partner dependencies
- Integration risks map the full value chain from innovation to consumer
- Each risk type receives severity ratings and detailed justification

### Example Output

For "Manufacturing Scale-Up" branch:
- **Initiative Risk: High** - Product feasibility and supply chain concerns
- **Interdependence Risk: High** - 4 critical partners with 41% joint success probability (0.8^4)
- **Integration Risk: High** - 21-36 months cumulative adoption delay across equipment suppliers, OEMs, and retailers

## Technical Details

### API Integration

The `analyzeEcosystemicRisk` function:
- Uses Perplexity's `sonar-pro` model
- Temperature: 0.6 for balanced creativity and consistency
- Max tokens: 2000 to accommodate detailed analysis
- Processes context and branch name to generate targeted risk assessment

### Mock Data Mode

When `VITE_USE_MOCK_DATA=true`:
- Uses pre-generated realistic ecosystemic risk analyses
- 800ms artificial delay to simulate API latency
- Based on E Ink case study for authenticity
- Allows testing without API costs

### State Management

Ecosystemic risk data flows through the application as:
```javascript
branch.riskAnalyses = {
  financial: string,
  technical: string,
  competitive: string,
  ecosystemic: string  // NEW
}
```

## Testing

The implementation has been tested with:
- ✅ No linter errors
- ✅ Proper TypeScript/JSX syntax
- ✅ Mock data mode functionality
- ✅ Development server successfully running
- ✅ All 6 branches include ecosystemic risk data
- ✅ Export functionality includes new risk type

## Usage

### For Users

1. Upload your strategic documents
2. Wait for analysis (now includes 4 risk dimensions per branch)
3. Click on the 🌐 Ecosystemic Risk node in the tree diagram
4. Review the detailed analysis in three sections:
   - Initiative Risks
   - Interdependence Risks
   - Integration Risks
5. Export reports that include ecosystemic risk analysis

### For Developers

The ecosystemic risk analysis can be customized by editing the prompt in:
```javascript
// src/services/perplexityApi.js
export async function analyzeEcosystemicRisk(context, branchName) {
  // Modify the prompt in messages[1].content
}
```

## Impact on Performance

- **Additional API calls**: +1 per branch (now 5 total per branch instead of 4)
- **Token usage**: ~2000 additional tokens per branch
- **Analysis time**: +10-15 seconds per branch (with parallelization)
- **Total time for 6 branches**: 45-75 seconds (up from 30-60 seconds)

## Future Enhancements

Potential improvements:
1. Add interactive calculators for joint probability
2. Visualize value chain dependencies as a separate diagram
3. Add risk heat maps showing severity across all dimensions
4. Create comparative analysis across branches for ecosystemic risks
5. Add risk scenario modeling for different partner success probabilities

## References

- Adner, Ron. "Match Your Innovation Strategy to Your Innovation Ecosystem." Harvard Business Review, 2006.
- The implementation follows the three fundamental ecosystemic risk types identified in Adner's framework

## Summary

The ecosystemic risk analysis adds a critical fourth dimension to the Roadmap Rationalizer, enabling users to assess not just internal risks (financial, technical) and market risks (competitive), but also systemic risks arising from partner dependencies and value chain adoption challenges. This provides a more complete picture of strategic decision risks and helps identify potential bottlenecks and failure points in the broader innovation ecosystem.

