# Roadmap Plan Feature

## Overview
A new "Roadmap Plan" tab has been added to the Roadmap Rationalizer application that generates AI-powered strategic recommendations based on the risk analysis of decision branches.

## What Was Added

### 1. New Component: `RoadmapPlan.jsx`
Location: `/src/components/RoadmapPlan.jsx`

A comprehensive React component that displays:
- **Executive Summary**: 2-3 paragraph overview of the strategic situation
- **Recommended Prioritization**: Decision branches ranked by priority with rationale and timeline
- **Strategic Action Items**: 5-8 specific actions with owners and timeframes
- **Risk Mitigation Priorities**: 3-5 key risks with specific mitigation actions
- **Success Metrics & KPIs**: 4-6 metrics to track progress
- **Immediate Next Steps**: 3-5 actionable next steps

### 2. API Function: `generateRoadmapRecommendations()`
Location: `/src/services/perplexityApi.js`

New function that:
- Takes the context and analyzed branches as input
- Calls the Perplexity AI API with a strategic planning prompt
- Returns structured JSON with comprehensive roadmap recommendations
- Includes a mock data function for testing without API calls

### 3. Updated App Component
Location: `/src/App.jsx`

Changes:
- Added import for `RoadmapPlan` component
- Extended `viewMode` state to include 'plan' option
- Added new "Roadmap Plan" button to the view mode selector
- Updated conditional rendering to show `RoadmapPlan` when 'plan' view is selected

## Features

### Visual Design
- Beautiful card-based layout with gradient accents
- Priority-based color coding (green, blue, amber)
- Clear visual hierarchy with icons and badges
- Responsive design that works on all screen sizes

### AI-Powered Recommendations
The LLM analyzes:
- All decision branches and their risk profiles
- The original strategic context
- Risk analysis across Financial, Technical, Organizational, and Ecosystem dimensions

And generates:
- Intelligent prioritization based on risk levels
- Specific, actionable recommendations
- Timeline suggestions
- Risk mitigation strategies
- Success metrics

### Error Handling
- Loading spinner during generation
- Error display with retry functionality
- Fallback recommendations if API fails

## Setup

### Environment Configuration

Create a `.env` file in the project root with the following content:

```
# Set to 'true' to use mock data (recommended for testing)
VITE_USE_MOCK_DATA=true

# OR set your Perplexity API key to use real AI
# VITE_PERPLEXITY_API_KEY=your_api_key_here
```

**Note:** After creating or modifying the `.env` file, restart the dev server for changes to take effect.

## How to Use

1. Upload documents and complete the risk analysis (or load demo data)
2. Click the "Roadmap Plan" tab in the view mode selector
3. The component will automatically generate recommendations using the LLM
4. Review the executive summary, priorities, and action items
5. Export the results using the HTML or PDF export buttons

## Mock Mode

The feature fully supports mock mode (when `VITE_USE_MOCK_DATA=true`):
- Generates realistic sample recommendations without API calls
- Includes diverse action items, metrics, and next steps
- Useful for development and testing

## Technical Details

### Dependencies
- React hooks (useState, useEffect)
- Perplexity API integration
- Existing LoadingSpinner component

### Data Flow
1. Component receives `branches` and `context` as props
2. useEffect triggers on mount when data is available
3. Calls `generateRoadmapRecommendations()` API function
4. Displays loading state while waiting
5. Renders structured recommendations when complete

### JSON Structure
```json
{
  "executiveSummary": "string",
  "prioritizedOptions": [
    {
      "name": "string",
      "priority": number,
      "rationale": "string",
      "timeline": "string"
    }
  ],
  "actionItems": [
    {
      "title": "string",
      "description": "string",
      "owner": "string",
      "timeframe": "string"
    }
  ],
  "riskMitigationPriorities": [
    {
      "area": "string",
      "action": "string"
    }
  ],
  "successMetrics": [
    {
      "name": "string",
      "description": "string",
      "target": "string"
    }
  ],
  "nextSteps": ["string"]
}
```

## Future Enhancements

Possible additions:
- Edit/customize recommendations
- Save multiple roadmap scenarios
- Compare different prioritization approaches
- Export roadmap plan as standalone document
- Timeline visualization (Gantt chart)
- Resource allocation calculator
- Interactive action item checklist

## Testing

To test the feature:
1. Start the dev server: `npm run dev`
2. Load demo data or upload files
3. Navigate to the "Roadmap Plan" tab
4. Verify recommendations are generated and displayed correctly
5. Test error handling by disconnecting network during generation
6. Verify responsive design on different screen sizes

