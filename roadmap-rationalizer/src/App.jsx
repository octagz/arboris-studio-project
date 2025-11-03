import { useState, useCallback, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import OptionTree from './components/OptionTree';
import RoadmapPlan from './components/RoadmapPlan';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './components/Login';
import { combineFileContents } from './utils/fileParser';
import { exportHTMLReport, exportPDFReport } from './utils/exportReport';
import { inferDecisionYear, getDefaultDecisionYear } from './utils/decisionYear';
import {
  setContext,
  identifyDecisionBranches,
  analyzeFinancialRisk,
  analyzeTechnicalRisk,
  analyzeOrganizationalRisk,
  analyzeEcosystemRisk,
  determineRiskLevel,
  generateRoadmapRecommendations,
} from './services/perplexityApi';
import {
  mockContext,
  mockBranches,
  mockRiskAnalyses,
  mockRiskLevels,
  mockRoadmapRecommendations,
} from './services/mockData';

function App() {
  const defaultDecisionYear = getDefaultDecisionYear();
  const YEAR_MIN = 1900;
  const YEAR_MAX = 2100;
  const AUTH_STORAGE_KEY = 'rr_is_authenticated';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [files, setFiles] = useState([]);
  const [context, setContextData] = useState('');
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [viewMode, setViewMode] = useState('tree'); // 'tree', 'radar', 'cards', or 'plan'
  const [decisionYear, setDecisionYear] = useState(defaultDecisionYear);
  const [decisionYearInput, setDecisionYearInput] = useState(String(defaultDecisionYear));
  const [inferredDecisionYear, setInferredDecisionYear] = useState(defaultDecisionYear);
  const [isManualDecisionYear, setIsManualDecisionYear] = useState(false);
  const [roadmapRecommendations, setRoadmapRecommendations] = useState(null);
  const [roadmapError, setRoadmapError] = useState(null);
  const [isRoadmapGenerating, setIsRoadmapGenerating] = useState(false);

  const isResetDisabled = !isManualDecisionYear || decisionYear === inferredDecisionYear;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
  }, [AUTH_STORAGE_KEY]);

  const handleAuthenticated = useCallback(() => {
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    }
  }, [AUTH_STORAGE_KEY]);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setFiles([]);
    setContextData('');
    setBranches([]);
    setHasAnalysis(false);
    setRoadmapRecommendations(null);
    setRoadmapError(null);
    setIsRoadmapGenerating(false);
    setViewMode('tree');
    setDecisionYear(defaultDecisionYear);
    setDecisionYearInput(String(defaultDecisionYear));
    setInferredDecisionYear(defaultDecisionYear);
    setIsManualDecisionYear(false);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [AUTH_STORAGE_KEY, defaultDecisionYear]);

  const performRoadmapGeneration = useCallback(async (contextSource, branchSource, year) => {
    if (!contextSource || !Array.isArray(branchSource) || branchSource.length === 0) {
      setRoadmapRecommendations(null);
      setRoadmapError(null);
      return null;
    }

    setIsRoadmapGenerating(true);
    setRoadmapError(null);

    try {
      const roadmap = await generateRoadmapRecommendations(contextSource, branchSource, year);
      setRoadmapRecommendations(roadmap);
      return roadmap;
    } catch (error) {
      console.error('Error generating roadmap recommendations:', error);
      setRoadmapError(error.message || 'Failed to generate roadmap recommendations');
      return null;
    } finally {
      setIsRoadmapGenerating(false);
    }
  }, [generateRoadmapRecommendations]);

  const processFiles = useCallback(async (filesToProcess) => {
    if (filesToProcess.length === 0) return;

    setIsLoading(true);
    setHasAnalysis(false);
    setRoadmapRecommendations(null);
    setRoadmapError(null);
    setIsRoadmapGenerating(false);

    try {
      // Step 1: Parse and combine file contents
      setCurrentStep('Reading files...');
      const combinedContent = await combineFileContents(filesToProcess);
      const inferredYear = inferDecisionYear(combinedContent);
      const manualOverrideActive = isManualDecisionYear && decisionYear !== inferredYear;
      setInferredDecisionYear(inferredYear);
      setIsManualDecisionYear(manualOverrideActive);
      const analysisDecisionYear = manualOverrideActive ? decisionYear : inferredYear;
      if (!manualOverrideActive) {
        setDecisionYear(inferredYear);
        setDecisionYearInput(String(inferredYear));
      }

      // Step 2: Set context with LLM
      setCurrentStep('Analyzing context...');
      const contextSummary = await setContext(combinedContent);
      setContextData(contextSummary);

      // Step 3: Identify decision branches
      setCurrentStep('Identifying decision branches...');
      const identifiedBranches = await identifyDecisionBranches(contextSummary);
      
      // Initialize branches with structure
      const initializedBranches = identifiedBranches.map(branch => ({
        ...branch,
        riskLevel: null,
        reasoning: null,
        riskAnalyses: null,
        mitigation: null,
      }));
      setBranches(initializedBranches);

      // Step 4: Analyze each branch sequentially (agentic workflow)
      for (let i = 0; i < initializedBranches.length; i++) {
        const branch = initializedBranches[i];
        setCurrentStep(`Analyzing "${branch.name}" (${i + 1}/${initializedBranches.length})...`);

        // Parallel risk analysis calls - now with hierarchical structure
        const [
          financialRisk,
          technicalRisk,
          organizationalRisk,
          ecosystemRisk,
        ] = await Promise.all([
          analyzeFinancialRisk(contextSummary, branch.name),
          analyzeTechnicalRisk(contextSummary, branch.name),
          analyzeOrganizationalRisk(contextSummary, branch.name),
          analyzeEcosystemRisk(contextSummary, branch.name),
        ]);

        const dimensionLevels = {
          financial: financialRisk.severity || 'MEDIUM',
          technical: technicalRisk.severity || 'MEDIUM',
          organizational: organizationalRisk.severity || 'MEDIUM',
          ecosystem: ecosystemRisk.severity || 'MEDIUM',
        };

        // Determine overall risk level with hierarchical structure
        const riskLevelData = await determineRiskLevel(
          contextSummary,
          branch.name,
          {
            financial: financialRisk,
            technical: technicalRisk,
            organizational: organizationalRisk,
            ecosystem: ecosystemRisk,
          }
        );

        const finalDimensions = {
          financial: riskLevelData.dimensions?.financial || dimensionLevels.financial,
          technical: riskLevelData.dimensions?.technical || dimensionLevels.technical,
          organizational: riskLevelData.dimensions?.organizational || dimensionLevels.organizational,
          ecosystem: riskLevelData.dimensions?.ecosystem || dimensionLevels.ecosystem,
        };

        // Update branch with analysis
        initializedBranches[i] = {
          ...branch,
          riskLevel: riskLevelData.level,
          riskDimensions: finalDimensions,
          riskSeverities: dimensionLevels,
          reasoning: riskLevelData.reasoning,
          riskAnalyses: {
            financial: financialRisk.analysis,
            technical: technicalRisk.analysis,
            organizational: organizationalRisk.analysis,
            ecosystem: ecosystemRisk.analysis,
          },
          mitigation: riskLevelData.mitigation,
        };

        // Update state to show progress
        setBranches([...initializedBranches]);
      }

      setCurrentStep('Generating roadmap plan...');
      await performRoadmapGeneration(contextSummary, initializedBranches, analysisDecisionYear);

      setHasAnalysis(true);
      setCurrentStep(null);
    } catch (error) {
      console.error('Error processing files:', error);
      alert(`Error: ${error.message || 'Failed to process files'}`);
      setCurrentStep(null);
    } finally {
      setIsLoading(false);
    }
  }, [decisionYear, isManualDecisionYear, performRoadmapGeneration, setBranches, setContextData]);

  const handleRoadmapRegenerate = useCallback(async () => {
    await performRoadmapGeneration(context, branches, decisionYear);
  }, [performRoadmapGeneration, context, branches, decisionYear]);

  const handleFilesSelected = useCallback(async (newFiles) => {
    setFiles(newFiles);
    await processFiles(newFiles);
  }, [processFiles]);

  const handleExportHTML = useCallback(() => {
    const html = exportHTMLReport({ context, branches, decisionYear });
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'roadmap-risk-analysis.html';
    link.click();
    URL.revokeObjectURL(url);
  }, [context, branches, decisionYear]);

  const handleExportPDF = useCallback(async () => {
    try {
      await exportPDFReport({ context, branches, decisionYear });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  }, [context, branches, decisionYear]);

  const handleDecisionYearInputChange = useCallback((event) => {
    const nextValue = event.target.value;
    setDecisionYearInput(nextValue);

    const parsed = Number.parseInt(nextValue, 10);
    if (Number.isFinite(parsed) && nextValue.trim().length >= 4 && parsed >= YEAR_MIN && parsed <= YEAR_MAX) {
      setDecisionYear(parsed);
      setIsManualDecisionYear(parsed !== inferredDecisionYear);
    }
  }, [YEAR_MIN, YEAR_MAX, inferredDecisionYear]);

  const handleDecisionYearInputBlur = useCallback(() => {
    const parsed = Number.parseInt(decisionYearInput, 10);
    if (Number.isFinite(parsed) && parsed >= YEAR_MIN && parsed <= YEAR_MAX) {
      setDecisionYear(parsed);
      setDecisionYearInput(String(parsed));
      setIsManualDecisionYear(parsed !== inferredDecisionYear);
      return;
    }

    const fallback = isManualDecisionYear ? decisionYear : inferredDecisionYear;
    setDecisionYearInput(String(fallback));
    setIsManualDecisionYear(fallback !== inferredDecisionYear);
  }, [decisionYearInput, YEAR_MIN, YEAR_MAX, isManualDecisionYear, decisionYear, inferredDecisionYear]);

  const handleDecisionYearInputKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
  }, []);

  const handleDecisionYearReset = useCallback(() => {
    setIsManualDecisionYear(false);
    setDecisionYear(inferredDecisionYear);
    setDecisionYearInput(String(inferredDecisionYear));
  }, [inferredDecisionYear]);

  const handleLoadDemoData = useCallback(async () => {
    // Import the new mock data structures
    setContextData(mockContext);
    const demoData = mockBranches.map(branch => ({
      ...branch,
      riskLevel: mockRiskLevels[branch.name]?.level || 'HIGH',
      riskDimensions: mockRiskLevels[branch.name]?.dimensions || {
        financial: 'MEDIUM',
        technical: 'MEDIUM',
        organizational: 'MEDIUM',
        ecosystem: 'MEDIUM',
      },
      reasoning: mockRiskLevels[branch.name]?.reasoning || '',
      riskAnalyses: {
        financial: mockRiskAnalyses[branch.name]?.financial || 'Financial analysis unavailable.',
        technical: mockRiskAnalyses[branch.name]?.technical || 'Technical analysis unavailable.',
        organizational: mockRiskAnalyses[branch.name]?.organizational || 'Organizational analysis unavailable.',
        ecosystem: mockRiskAnalyses[branch.name]?.ecosystem || 'Ecosystem analysis unavailable.',
      },
      riskSeverities: mockRiskLevels[branch.name]?.dimensions || {
        financial: 'MEDIUM',
        technical: 'MEDIUM',
        organizational: 'MEDIUM',
        ecosystem: 'MEDIUM',
      },
      mitigation: mockRiskLevels[branch.name]?.mitigation || [],
    }));
    setBranches(demoData);
    setRoadmapRecommendations(mockRoadmapRecommendations);
    setRoadmapError(null);
    setIsRoadmapGenerating(false);
    setHasAnalysis(true);
    setDecisionYear(defaultDecisionYear);
    setDecisionYearInput(String(defaultDecisionYear));
    setInferredDecisionYear(defaultDecisionYear);
    setIsManualDecisionYear(false);
  }, [defaultDecisionYear]);

  if (!isAuthenticated) {
    return <Login onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-satin text-fog">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[rgba(7,27,23,0.85)] backdrop-blur-xl border-b border-[rgba(19,68,59,0.65)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center branch-depth bg-[linear-gradient(145deg,#1A8A74,#0F6B5C)]">
                <svg className="w-7 h-7 text-fog" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-display gold-type">
                  Arboris: Roadmap rationzalizer
                </h1>
                <p className="text-seafoam text-sm mt-0.5 hidden sm:block">
                  AI-Powered Decision Intelligence Platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              {hasAnalysis && (
                <>
                  <button
                    onClick={handleExportHTML}
                    className="btn-emerald flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="hidden sm:inline">HTML</span>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="btn-gold flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="hidden sm:inline">Export PDF</span>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="btn-emerald"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {branches.length === 0 && !isLoading && (
          <div className="animate-fade-in">
            <div className="card-elevated max-w-4xl mx-auto p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 border border-[rgba(67,160,137,0.4)] bg-[rgba(7,27,23,0.55)]">
                  <svg className="w-10 h-10 text-gold-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-fog mb-3 font-display">
                  Welcome to Decision Intelligence
                </h2>
                <p className="text-seafoam text-lg max-w-2xl mx-auto leading-relaxed">
                  Upload your strategic documents to unlock AI-powered risk analysis and data-driven insights for your roadmap decisions
                </p>
              </div>
              <div className="mt-10 flex flex-col xl:flex-row gap-6">
                <div className="flex-1">
                  <FileUpload onFilesSelected={handleFilesSelected} isLoading={isLoading} />
                </div>
                <div className="w-full max-w-xs xl:max-w-sm surface-raised p-5">
                  <label className="block text-xs font-semibold text-muted uppercase tracking-[0.18em] mb-2" htmlFor="decision-year-input">
                    Decision Year
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="decision-year-input"
                      type="number"
                      min={YEAR_MIN}
                      max={YEAR_MAX}
                      step="1"
                      value={decisionYearInput}
                      onChange={handleDecisionYearInputChange}
                      onBlur={handleDecisionYearInputBlur}
                      onKeyDown={handleDecisionYearInputKeyDown}
                      className="flex-1 input-emerald text-sm"
                      inputMode="numeric"
                      pattern="\\d{4}"
                    />
                    <button
                      type="button"
                      onClick={handleDecisionYearReset}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${isResetDisabled
                        ? 'border border-[rgba(67,160,137,0.25)] text-muted cursor-not-allowed'
                        : 'border border-[rgba(67,160,137,0.65)] text-fog hover:bg-[rgba(67,160,137,0.12)]'}
                      `}
                      disabled={isResetDisabled}
                    >
                      Use inferred
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    Auto-detected: <span className="font-semibold text-fog">{inferredDecisionYear}</span>. Update to override the inferred year for this analysis.
                  </p>
                  {isManualDecisionYear && (
                    <p className="mt-1 text-xs font-semibold text-gold-base">
                      Manual year override active.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-[rgba(19,68,59,0.45)]">
                <div className="text-center">
                  <p className="text-sm text-muted mb-4 font-medium">
                    Explore the platform with sample data
                  </p>
                  <button
                    onClick={handleLoadDemoData}
                    className="btn-emerald inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    View Interactive Demo
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
              <div className="card p-6 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[rgba(67,160,137,0.45)] bg-[rgba(7,27,23,0.55)]">
                  <svg className="w-6 h-6 text-gold-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-fog mb-2">Hierarchical Risk Framework</h3>
                <p className="text-sm text-seafoam">Financial, Technical, Organizational, and Ecosystem risk pillars with specialist analyses</p>
              </div>
              
              <div className="card p-6 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[rgba(67,160,137,0.45)] bg-[rgba(7,27,23,0.55)]">
                  <svg className="w-6 h-6 text-gold-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="font-semibold text-fog mb-2">Visual Decision Trees</h3>
                <p className="text-sm text-seafoam">Interactive visualization of strategic pathways</p>
              </div>
              
              <div className="card p-6 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[rgba(67,160,137,0.45)] bg-[rgba(7,27,23,0.55)]">
                  <svg className="w-6 h-6 text-gold-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-fog mb-2">Executive Reports</h3>
                <p className="text-sm text-seafoam">Export professional PDF and HTML reports</p>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="card-elevated max-w-2xl mx-auto p-12 animate-fade-in">
            <LoadingSpinner message={currentStep} />
          </div>
        )}

        {branches.length > 0 && !isLoading && (
          <div className="animate-fade-in space-y-8">
            {/* Header Section */}
            <div className="card p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="section-title mb-2">
                      Strategic Decision Analysis
                    </h2>
                    <p className="text-muted text-sm">
                      Exploring {branches.length} decision {branches.length === 1 ? 'pathway' : 'pathways'} with comprehensive risk assessment
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
                    <div className="sm:flex sm:items-center sm:gap-3">
                      <label className="text-xs font-semibold text-muted uppercase tracking-[0.18em]" htmlFor="decision-year-input-inline">
                        Decision Year
                      </label>
                      <div className="mt-1 flex items-center gap-2 sm:mt-0">
                        <input
                          id="decision-year-input-inline"
                          type="number"
                          min={YEAR_MIN}
                          max={YEAR_MAX}
                          step="1"
                          value={decisionYearInput}
                          onChange={handleDecisionYearInputChange}
                          onBlur={handleDecisionYearInputBlur}
                          onKeyDown={handleDecisionYearInputKeyDown}
                          className="w-28 input-emerald text-sm"
                          inputMode="numeric"
                          pattern="\\d{4}"
                        />
                        <button
                          type="button"
                          onClick={handleDecisionYearReset}
                          className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${isResetDisabled
                            ? 'border border-[rgba(67,160,137,0.25)] text-muted cursor-not-allowed'
                            : 'border border-[rgba(67,160,137,0.65)] text-fog hover:bg-[rgba(67,160,137,0.12)]'}
                          `}
                          disabled={isResetDisabled}
                        >
                          Use inferred
                        </button>
                      </div>
                    </div>
                    
                  </div>
                </div>

                {/* Risk Summary Badges */}
                <div className="flex flex-wrap gap-2">
                  {['HIGH', 'MEDIUM', 'LOW'].map((level) => {
                    const count = branches.filter(b => b.riskLevel === level).length;
                    if (count === 0) return null;

                    const colorClasses = {
                      HIGH: 'bg-[rgba(213,75,75,0.18)] text-error border border-[rgba(213,75,75,0.55)]',
                      MEDIUM: 'bg-[rgba(212,175,55,0.15)] text-gold-base border border-[rgba(212,175,55,0.45)]',
                      LOW: 'bg-[rgba(37,183,138,0.18)] text-success border border-[rgba(37,183,138,0.55)]',
                    };

                    return (
                      <span
                        key={level}
                        className={`badge ${colorClasses[level]}`}
                      >
                        {level}: {count}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* View Mode Selector */}
              <div className="flex items-center gap-3 bg-[rgba(7,27,23,0.6)] border border-[rgba(19,68,59,0.65)] rounded-xl p-1.5 inline-flex">
                <button
                  onClick={() => setViewMode('tree')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    viewMode === 'tree'
                      ? 'bg-[rgba(19,68,59,0.85)] text-fog shadow-satin'
                      : 'text-seafoam hover:text-fog hover:bg-[rgba(19,68,59,0.45)]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Decision Tree
                </button>
                {/* Risk Radar - Hidden for now
                <button
                  onClick={() => setViewMode('radar')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    viewMode === 'radar'
                      ? 'bg-[rgba(19,68,59,0.85)] text-fog shadow-satin'
                      : 'text-seafoam hover:text-fog hover:bg-[rgba(19,68,59,0.45)]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Risk Radar
                </button>
                */}
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    viewMode === 'cards'
                      ? 'bg-[rgba(19,68,59,0.85)] text-fog shadow-satin'
                      : 'text-seafoam hover:text-fog hover:bg-[rgba(19,68,59,0.45)]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Card View
                </button>
                <button
                  onClick={() => setViewMode('plan')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    viewMode === 'plan'
                      ? 'bg-[rgba(19,68,59,0.85)] text-fog shadow-satin'
                      : 'text-seafoam hover:text-fog hover:bg-[rgba(19,68,59,0.45)]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Roadmap Plan
                </button>
              </div>
            </div>

            {/* Conditional rendering based on view mode */}
            {viewMode === 'plan' ? (
              <RoadmapPlan
                decisionYear={decisionYear}
                recommendations={roadmapRecommendations}
                error={roadmapError}
                isGenerating={isRoadmapGenerating}
                onRetry={handleRoadmapRegenerate}
              />
            ) : (
              <OptionTree branches={branches} context={context} viewMode={viewMode} />
            )}
          </div>
        )}

        {hasAnalysis && (
          <div className="mt-8 card max-w-4xl mx-auto p-6 border border-[rgba(67,160,137,0.45)] bg-[rgba(7,27,23,0.6)] animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-[rgba(67,160,137,0.55)] bg-[rgba(15,107,92,0.85)]">
                <svg className="w-6 h-6 text-gold-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-fog mb-2">
                  Analysis Complete
                </h3>
                <p className="text-seafoam text-sm leading-relaxed">
                  Your strategic analysis is ready. Review the decision branches, risk assessments, and mitigation strategies above. Export your findings to share with stakeholders.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[rgba(19,68,59,0.6)] bg-[rgba(7,27,23,0.85)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-seafoam">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-fog">Arboris</span>
              <span>•</span>
              <span>© 2025 - Authors: Julie Vang, Ty Case, Uma Kamath, Chinmaiye Gandhi and Octavio Gzain </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <span className="font-semibold text-gold-base">Perplexity AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
