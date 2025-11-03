import axios from 'axios';
import {
  mockSetContext,
  mockIdentifyDecisionBranches,
  mockAnalyzeFinancialRisk,
  mockAnalyzeTechnicalRisk,
  mockAnalyzeOrganizationalRisk,
  mockAnalyzeEcosystemRisk,
  mockDetermineRiskLevel,
  mockGenerateRoadmapRecommendations,
} from './mockData';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

// Check if mock mode is enabled via environment variable
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const VALID_SEVERITIES = new Set(['LOW', 'MEDIUM', 'HIGH']);
const DEFAULT_SEVERITY = 'MEDIUM';
const DEFAULT_MODEL = 'sonar-pro';
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_TOP_P = 0.9;
const MAX_RESPONSE_TOKENS = 2000;

function stripCitationMarkers(input) {
  if (typeof input !== 'string') return input;
  return input.replace(/\[\d+\]/g, '');
}

function extractJson(content) {
  if (!content) return null;

  const sanitized = stripCitationMarkers(content);
  const trimmed = sanitized.trim();
  try {
    return JSON.parse(trimmed);
  } catch (error) {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (nestedError) {
        return null;
      }
    }
  }

  return null;
}

function normalizeSeverity(value) {
  if (!value || typeof value !== 'string') return null;
  const normalized = value.trim().toUpperCase();
  return VALID_SEVERITIES.has(normalized) ? normalized : null;
}

function parseRiskResponse(content, fallbackAnalysis = 'Analysis unavailable.') {
  const sanitizedContent = stripCitationMarkers(content || '');
  const parsed = extractJson(sanitizedContent);

  if (parsed && typeof parsed === 'object') {
    const severity = normalizeSeverity(parsed.severity) || DEFAULT_SEVERITY;
    const analysis = typeof parsed.analysis === 'string' && parsed.analysis.trim().length
      ? parsed.analysis.trim()
      : fallbackAnalysis;

    return {
      severity,
      analysis,
    };
  }

  const severityMatch = sanitizedContent.match(/severity\s*(rating)?\s*:?\s*(high|medium|low)/i);
  const severity = severityMatch ? severityMatch[2].toUpperCase() : DEFAULT_SEVERITY;

  return {
    severity,
    analysis: sanitizedContent.trim() || fallbackAnalysis,
  };
}

/**
 * Makes a call to Perplexity API with the agentic workflow
 * @param {string} model - Model to use (e.g., 'sonar-pro')
 * @param {Array} messages - Array of messages for the conversation
 * @param {Object} config - Additional configuration
 */
export async function callPerplexityAPI(model, messages, config = {}) {
  const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
  
  if (!apiKey) {
    throw new Error('Perplexity API key is not configured. Please set VITE_PERPLEXITY_API_KEY in your .env file');
  }

  const {
    temperature = DEFAULT_TEMPERATURE,
    maxTokens,
    topP = DEFAULT_TOP_P,
    stream = false,
  } = config;

  const resolvedMaxTokens = Math.min(
    typeof maxTokens === 'number' ? maxTokens : MAX_RESPONSE_TOKENS,
    MAX_RESPONSE_TOKENS,
  );

  const requestConfig = {
    model: model || DEFAULT_MODEL,
    messages,
    temperature,
    max_tokens: resolvedMaxTokens > 0 ? resolvedMaxTokens : MAX_RESPONSE_TOKENS,
    top_p: topP,
    stream,
  };

  try {
    const response = await axios.post(PERPLEXITY_API_URL, requestConfig, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Perplexity API Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Sets the context from uploaded files
 * @param {string} fileContent - Content from uploaded files
 * @returns {Promise<string>} - Context summary
 */
export async function setContext(fileContent) {
  if (USE_MOCK_DATA) {
    console.log('📋 Using mock data for setContext');
    return mockSetContext(fileContent);
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a strategic product management assistant expert in analyzing product roadmaps, market analysis, and risk assessment. You help identify decision branches and evaluate risks.',
    },
    {
      role: 'user',
      content: `### Task
Analyze the product roadmap materials and extract the requested strategic information.

### Context
${fileContent}

### Output Structure
Use the following Markdown headings and provide 2-4 concise bullet points under each:
- Goals and Objectives
- Target Markets and Segments
- Key Features and Capabilities
- Financial Constraints or Projections
- Technical Requirements or Constraints
- Competitive Landscape Insights

### Style Rules
- Keep the entire response under 350 words.
- Use plain Markdown (paragraphs and bullet points only).
- Do not include tables, code fences, or prose outside the requested headings.`,
    },
  ];

  const response = await callPerplexityAPI('sonar-pro', messages, {
    temperature: 0.5,
    maxTokens: 2000,
  });

  const rawContent = response.choices[0]?.message?.content || '';
  return stripCitationMarkers(rawContent);
}

/**
 * Analyzes financial risk for a given decision branch
 * @param {string} context - Project context
 * @param {string} branchName - Name of the decision branch
 * @returns {Promise<{severity: string, analysis: string}>}
 */
export async function analyzeFinancialRisk(context, branchName) {
  if (USE_MOCK_DATA) {
    console.log(`💰 Using mock data for analyzeFinancialRisk: ${branchName}`);
    return mockAnalyzeFinancialRisk(context, branchName);
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a financial strategist specializing in innovation investments, capital allocation, and runway management.',
    },
    {
      role: 'user',
      content: `### Task
Evaluate the FINANCIAL RISK for the decision branch "${branchName}" using the supplied context.

### Context
${context}

### Analysis Requirements
- Provide exactly two concise paragraphs covering capital requirements, cash flow exposure, ROI sensitivity, and funding risks.
- Add a bullet list with 3-5 critical financial risk factors.
- Keep the full narrative under 250 words.

### Output Format
Return a single JSON object that matches:
{
  "severity": "HIGH | MEDIUM | LOW",
  "analysis": "<markdown paragraphs and bullet list>"
}

### Rules
- Respond with valid JSON only; do not include any explanatory text outside the JSON object and do not use code fences.
- The value of "analysis" must include the two paragraphs followed by the bullet list, all in Markdown using newline characters.
- Do not introduce tables or additional sections.
- Choose the severity from HIGH, MEDIUM, or LOW and use uppercase.`,
    },
  ];

  const response = await callPerplexityAPI('sonar-pro', messages, {
    temperature: 0.5,
    maxTokens: 1300,
  });

  const rawContent = response.choices[0]?.message?.content || '';
  const sanitizedContent = stripCitationMarkers(rawContent);
  return parseRiskResponse(sanitizedContent, 'Financial risk analysis unavailable.');
}

/**
 * Analyzes technical risk for a given decision branch
 * @param {string} context - Project context
 * @param {string} branchName - Name of the decision branch
 * @returns {Promise<{severity: string, analysis: string}>}
 */
export async function analyzeTechnicalRisk(context, branchName) {
  if (USE_MOCK_DATA) {
    console.log(`⚙️ Using mock data for analyzeTechnicalRisk: ${branchName}`);
    return mockAnalyzeTechnicalRisk(context, branchName);
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a chief architect who evaluates technical feasibility, scalability, and engineering execution risks for complex programs.',
    },
    {
      role: 'user',
      content: `### Task
Assess the TECHNICAL RISK for the decision branch "${branchName}" using the supplied context.

### Context
${context}

### Analysis Requirements
- Write two concise paragraphs that cover engineering complexity, technology maturity, integration constraints, scalability, and delivery timeline exposure.
- Follow with a bullet list containing 3-5 critical technical risk factors.
- Keep the total analysis within 250 words.

### Output Format
Return a single JSON object of the form:
{
  "severity": "HIGH | MEDIUM | LOW",
  "analysis": "<markdown paragraphs and bullet list>"
}

### Rules
- Respond with valid JSON only; no commentary or code fences around the JSON.
- The "analysis" string must contain the two paragraphs followed by the bullet list, formatted in Markdown with newline characters.
- Do not introduce tables or additional sections.
- Select severity strictly from HIGH, MEDIUM, or LOW (uppercase).`,
    },
  ];

  const response = await callPerplexityAPI('sonar-pro', messages, {
    temperature: 0.5,
    maxTokens: 1300,
  });

  const rawContent = response.choices[0]?.message?.content || '';
  const sanitizedContent = stripCitationMarkers(rawContent);
  return parseRiskResponse(sanitizedContent, 'Technical risk analysis unavailable.');
}

/**
 * Analyzes organizational risk for a given decision branch
 * @param {string} context - Project context
 * @param {string} branchName - Name of the decision branch
 * @returns {Promise<{severity: string, analysis: string}>}
 */
export async function analyzeOrganizationalRisk(context, branchName) {
  if (USE_MOCK_DATA) {
    console.log(`👥 Using mock data for analyzeOrganizationalRisk: ${branchName}`);
    return mockAnalyzeOrganizationalRisk(context, branchName);
  }

  const messages = [
    {
      role: 'system',
      content: 'You are an organizational strategist focused on talent, process maturity, operating model, and change readiness.',
    },
    {
      role: 'user',
      content: `### Task
Assess the ORGANIZATIONAL RISK for the decision branch "${branchName}" using the supplied context.

### Context
${context}

### Analysis Requirements
- Craft two concise paragraphs addressing team expertise, capability gaps, process maturity, leadership alignment, structural dependencies, and cultural readiness.
- Follow with a bullet list of 3-5 critical organizational risk factors.
- Keep the complete analysis within 250 words.

### Output Format
Return a single JSON object exactly matching:
{
  "severity": "HIGH | MEDIUM | LOW",
  "analysis": "<markdown paragraphs and bullet list>"
}

### Rules
- Respond with valid JSON only; exclude commentary, explanations, or code fences outside the JSON.
- The "analysis" field must contain the two paragraphs followed by the bullet list, formatted in Markdown using newline characters.
- Do not use tables or extra headings.
- Choose severity strictly from HIGH, MEDIUM, or LOW (uppercase).`,
    },
  ];

  const response = await callPerplexityAPI('sonar-pro', messages, {
    temperature: 0.5,
    maxTokens: 1300,
  });

  const rawContent = response.choices[0]?.message?.content || '';
  const sanitizedContent = stripCitationMarkers(rawContent);
  return parseRiskResponse(sanitizedContent, 'Organizational risk analysis unavailable.');
}

/**
 * Analyzes ecosystem risk (partner + market) for a given decision branch
 * @param {string} context - Project context
 * @param {string} branchName - Name of the decision branch
 * @returns {Promise<{severity: string, analysis: string}>}
 */
export async function analyzeEcosystemRisk(context, branchName) {
  if (USE_MOCK_DATA) {
    console.log(`🌐 Using mock data for analyzeEcosystemRisk: ${branchName}`);
    return mockAnalyzeEcosystemRisk(context, branchName);
  }

  const messages = [
    {
      role: 'system',
      content: 'You are an ecosystem and market strategy expert who evaluates partner dependencies, supply chain resilience, adoption barriers, and competitive dynamics.',
    },
    {
      role: 'user',
      content: `### Task
Assess the ECOSYSTEM RISK (partners + market) for the decision branch "${branchName}" using the provided context.

### Context
${context}

### Analysis Requirements
- Produce two focused paragraphs covering partner interdependence, supplier reliability, go-to-market dependencies, adoption barriers, and competitive/market viability.
- Follow with a bullet list of 4-6 critical ecosystem threats (e.g., weakest partners, adoption chokepoints, expected competitive responses).
- Keep the full analysis within 275 words.

### Output Format
Return a single JSON object with the structure:
{
  "severity": "HIGH | MEDIUM | LOW",
  "analysis": "<markdown paragraphs and bullet list>"
}

### Rules
- Respond with valid JSON only; omit any narrative outside the JSON and avoid code fences.
- The "analysis" value must include the two paragraphs followed by the bullet list, formatted in Markdown using newline characters.
- Do not introduce tables or extra sections.
- Choose severity strictly from HIGH, MEDIUM, or LOW (uppercase).`,
    },
  ];

  const response = await callPerplexityAPI('sonar-pro', messages, {
    temperature: 0.6,
    maxTokens: 1600,
  });

  const rawContent = response.choices[0]?.message?.content || '';
  const sanitizedContent = stripCitationMarkers(rawContent);
  return parseRiskResponse(sanitizedContent, 'Ecosystem risk analysis unavailable.');
}

/**
 * Synthesizes overall risk level for a decision branch
 * @param {string} context - Project context
 * @param {string} branchName - Name of the decision branch
 * @param {Object} riskAnalyses - Object containing risk analyses for each dimension
 * @returns {Promise<{level: string, reasoning: string, mitigation: string[], dimensions: object}>}
 */
export async function determineRiskLevel(context, branchName, riskAnalyses) {
  if (USE_MOCK_DATA) {
    console.log(`🎯 Using mock data for determineRiskLevel: ${branchName}`);
    return mockDetermineRiskLevel(context, branchName, riskAnalyses);
  }

  const dimensionSummary = `
### Financial (Severity: ${riskAnalyses.financial?.severity || 'MEDIUM'})
${riskAnalyses.financial?.analysis || 'No analysis provided.'}

### Technical (Severity: ${riskAnalyses.technical?.severity || 'MEDIUM'})
${riskAnalyses.technical?.analysis || 'No analysis provided.'}

### Organizational (Severity: ${riskAnalyses.organizational?.severity || 'MEDIUM'})
${riskAnalyses.organizational?.analysis || 'No analysis provided.'}

### Ecosystem (Severity: ${riskAnalyses.ecosystem?.severity || 'MEDIUM'})
${riskAnalyses.ecosystem?.analysis || 'No analysis provided.'}
`;

  const messages = [
    {
      role: 'system',
      content: 'You are a senior innovation strategist who synthesizes multi-dimensional risk analyses into clear recommendations.',
    },
    {
      role: 'user',
      content: `### Task
Synthesize the overall risk profile for "${branchName}" using the supplied context and dimension analyses.

### Context
${context}

### Dimension Analyses
${dimensionSummary}

### Output Schema
Return a JSON object that matches exactly:
{
  "dimensions": {
    "financial": "HIGH | MEDIUM | LOW",
    "technical": "HIGH | MEDIUM | LOW",
    "organizational": "HIGH | MEDIUM | LOW",
    "ecosystem": "HIGH | MEDIUM | LOW"
  },
  "level": "HIGH | MEDIUM | LOW",
  "reasoning": "<2-3 sentence cross-dimensional synthesis>",
  "mitigation": ["<priority 1>", "<priority 2>", "<priority 3>"]
}

### Rules
- Preserve the provided severity for each dimension verbatim; do not alter them.
- Determine the overall level; use the highest severity unless a short rationale justifies a different level.
- Keep the reasoning concise (2-3 sentences, max 80 words) and reference the dominant risk drivers.
- Provide exactly three mitigation priorities ordered by urgency.
- Respond with valid JSON only (no extra commentary, code fences, or trailing text).`,
    },
  ];

  const response = await callPerplexityAPI('sonar-pro', messages, {
    temperature: 0.5,
    maxTokens: 1200,
  });

  const rawContent = response.choices[0]?.message?.content || '';
  const content = stripCitationMarkers(rawContent);
  
  try {
    // Try to parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback if JSON parsing fails
    const levelMatch = content.match(/(HIGH|MEDIUM|LOW)/i);
    const level = levelMatch ? levelMatch[1].toUpperCase() : 'MEDIUM';

    return {
      dimensions: {
        financial: riskAnalyses.financial?.severity || DEFAULT_SEVERITY,
        technical: riskAnalyses.technical?.severity || DEFAULT_SEVERITY,
        organizational: riskAnalyses.organizational?.severity || DEFAULT_SEVERITY,
        ecosystem: riskAnalyses.ecosystem?.severity || DEFAULT_SEVERITY,
      },
      level,
      reasoning: content.split('\n').slice(0, 3).join(' ').slice(0, 200) || 'Risk analysis completed',
      mitigation: ['Reinforce financial resilience', 'De-risk technical hurdles', 'Align ecosystem partners'],
    };
  } catch (error) {
    console.error('Error parsing risk level response:', error);
    return {
      dimensions: {
        financial: riskAnalyses.financial?.severity || DEFAULT_SEVERITY,
        technical: riskAnalyses.technical?.severity || DEFAULT_SEVERITY,
        organizational: riskAnalyses.organizational?.severity || DEFAULT_SEVERITY,
        ecosystem: riskAnalyses.ecosystem?.severity || DEFAULT_SEVERITY,
      },
      level: 'MEDIUM',
      reasoning: 'Unable to parse risk assessment',
      mitigation: ['Reinforce financial resilience', 'De-risk technical hurdles', 'Align ecosystem partners'],
    };
  }
}

/**
 * Identifies decision branches from context
 * @param {string} context - Project context
 * @returns {Promise<Array>} - List of decision branches
 */
export async function identifyDecisionBranches(context) {
  if (USE_MOCK_DATA) {
    console.log('🌳 Using mock data for identifyDecisionBranches');
    return mockIdentifyDecisionBranches(context);
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a strategic planner expert at identifying decision points and branching options in product roadmaps.',
    },
    {
      role: 'user',
      content: `### Task
Identify 3-6 high-impact decision branches for the product roadmap based on the supplied context.

### Context
${context}

### Output Format
Return a JSON array where each item includes:
{
  "name": "2-5 word branch title",
  "description": "One-sentence explanation of the option"
}

### Rules
- Provide between 3 and 6 branches ordered by strategic relevance (most important first).
- Use concise, action-oriented language.
- Respond with valid JSON only; do not include commentary, tables, or code fences.`,
    },
  ];

  const response = await callPerplexityAPI('sonar-pro', messages, {
    temperature: 0.7,
    maxTokens: 1500,
  });

  const rawContent = response.choices[0]?.message?.content || '';
  const content = stripCitationMarkers(rawContent);
  
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    // Fallback branches if parsing fails
    return [
      { name: 'Aggressive Expansion', description: 'Rapid market expansion with high investment' },
      { name: 'Conservative Growth', description: 'Steady, measured growth with lower risk' },
      { name: 'Feature Focus', description: 'Prioritize feature development over expansion' },
    ];
  } catch (error) {
    console.error('Error parsing branches:', error);
    return [
      { name: 'Aggressive Expansion', description: 'Rapid market expansion with high investment' },
      { name: 'Conservative Growth', description: 'Steady, measured growth with lower risk' },
      { name: 'Feature Focus', description: 'Prioritize feature development over expansion' },
    ];
  }
}

/**
 * Generates comprehensive roadmap recommendations based on risk analysis
 * @param {string} context - Project context
 * @param {Array} branches - Analyzed decision branches with risk data
 * @returns {Promise<Object>} - Structured recommendations
 */
export async function generateRoadmapRecommendations(context, branches, decisionYear) {
  if (USE_MOCK_DATA) {
    console.log('📋 Using mock data for generateRoadmapRecommendations');
    return mockGenerateRoadmapRecommendations(context, branches, decisionYear);
  }

  // Prepare branch summaries for the LLM
  const branchSummaries = branches.map(branch => ({
    name: branch.name,
    description: branch.description,
    riskLevel: branch.riskLevel,
    riskDimensions: branch.riskDimensions,
    reasoning: branch.reasoning,
    mitigation: branch.mitigation,
  }));

  const effectiveDecisionYear = Number.isFinite(decisionYear) ? decisionYear : 2025;

  const messages = [
    {
      role: 'system',
      content: 'You are a strategic product management consultant expert in roadmap planning and risk mitigation. You analyze complex strategic decisions and provide actionable, prioritized recommendations.',
    },
    {
      role: 'user',
      content: `### Task
Generate a strategic roadmap plan with prioritized recommendations using the provided context and branch risk analyses.

### Context
${context}

### Decision Branches Analysis
${JSON.stringify(branchSummaries, null, 2)}

### Decision Year Anchor
${effectiveDecisionYear}

### Output Schema
Return a JSON object with the exact structure below. Respect the field names and data types.
{
  "executiveSummary": "2-3 paragraph narrative (max 220 words)",
  "decisionTimeline": [
    {
      "sequence": number,
      "year": number,
      "quarter": "Q1 | Q2 | Q3 | Q4 | Full-Year",
      "decision": "string",
      "description": "1-2 sentence explanation",
      "linkedRisk": {
        "branch": "branch name",
        "riskDimension": "Financial | Technical | Organizational | Ecosystem",
        "severity": "HIGH | MEDIUM | LOW",
        "riskStatement": "single sentence risk description"
      },
      "mitigationRationale": "1-2 sentences describing how the decision mitigates the linked risk"
    }
  ],
  "prioritizedOptions": [
    {
      "name": "string",
      "priority": number,
      "rationale": "2-3 sentence justification",
      "timeline": "e.g., 0-3 months"
    }
  ],
  "actionItems": [
    {
      "title": "string",
      "description": "1-2 sentence summary",
      "owner": "suggested role",
      "timeframe": "time window"
    }
  ],
  "riskMitigationPriorities": [
    {
      "area": "focus area",
      "action": "specific mitigation step"
    }
  ],
  "successMetrics": [
    {
      "name": "metric name",
      "description": "why it matters",
      "target": "measurable goal"
    }
  ],
  "nextSteps": ["immediate action (6-12 words)"]
}

### Rules
- Provide 4-6 timeline decisions sequenced from ${effectiveDecisionYear} onward with consecutive "sequence" values starting at 1 and non-decreasing years.
- Each timeline decision must cite exactly one linked risk drawn from the provided branches and explicitly describe how the decision mitigates it.
- Provide 3-5 prioritized options, 5-8 action items, 3-5 risk mitigations, 4-6 success metrics, and 3-5 next steps.
- Rank options starting at 1 with no duplicates.
- Keep the entire response under 2000 tokens.
- Respond with valid JSON only; do not include commentary or code fences.`,
    },
  ];

  const response = await callPerplexityAPI('sonar-pro', messages, {
    temperature: 0.7,
    maxTokens: MAX_RESPONSE_TOKENS,
  });

  const rawContent = response.choices[0]?.message?.content || '';
  const content = stripCitationMarkers(rawContent);
  
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No valid JSON found in response');
  } catch (error) {
    console.error('Error parsing roadmap recommendations:', error);
    // Return a fallback structure
    return {
      executiveSummary: 'Unable to generate recommendations. Please try again.',
      decisionTimeline: branches.slice(0, 4).map((branch, idx) => ({
        sequence: idx + 1,
        year: effectiveDecisionYear + Math.floor(idx / 2),
        quarter: ['Q1', 'Q3'][idx % 2] || 'Full-Year',
        decision: `Advance ${branch.name}`,
        description: branch.description?.slice(0, 160) || 'Follow-up strategic decision based on branch analysis.',
        linkedRisk: {
          branch: branch.name,
          riskDimension: (branch.riskDimensions && Object.keys(branch.riskDimensions)[0]) || 'Financial',
          severity: (branch.riskDimensions && branch.riskDimensions[(branch.riskDimensions && Object.keys(branch.riskDimensions)[0])]) || 'MEDIUM',
          riskStatement: branch.reasoning?.split('.').slice(0, 1).join('.') || 'Risk summary unavailable.'
        },
        mitigationRationale: branch.mitigation?.[0] || 'Mitigates top risk by advancing targeted safeguards.'
      })),
      prioritizedOptions: branches.slice(0, 3).map((branch, idx) => ({
        name: branch.name,
        priority: idx + 1,
        rationale: branch.reasoning || 'Risk level: ' + branch.riskLevel,
        timeline: branch.riskLevel === 'LOW' ? '0-3 months' : branch.riskLevel === 'MEDIUM' ? '3-6 months' : '6-12 months'
      })),
      actionItems: [],
      riskMitigationPriorities: [],
      successMetrics: [],
      nextSteps: ['Review risk analysis', 'Prioritize decision branches', 'Develop detailed implementation plan']
    };
  }
}

