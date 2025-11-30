import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    STORAGE_KEYS,
    getInterviews,
    setInterviews,
    addInterview as storeAddInterview,
    updateInterview as storeUpdateInterview,
    deleteInterview as storeDeleteInterview,
    getInterviewById,
    getHypotheses,
    setHypotheses,
    addHypothesis as storeAddHypothesis,
    updateHypothesis as storeUpdateHypothesis,
    deleteHypothesis as storeDeleteHypothesis,
    getReports,
    setReports,
    addReport as storeAddReport,
    getReportById,
    getStats,
    setStats,
    getTrends,
    setTrends,
    getDemographics,
    setDemographics,
    getAgeDistribution,
    setAgeDistribution,
    getGenderDistribution,
    setGenderDistribution,
    hasData,
    migrateFromLegacyStorage,
} from '../services/dataStore';

import {
    mockInterviews,
    mockHypotheses,
    mockTrends,
    mockStats,
    mockDemographics,
    mockAgeDistribution,
    mockGenderDistribution,
} from '../services/mockData';

// Check if mock mode is enabled via environment variable
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const DataContext = createContext(null);

/**
 * DataProvider - Wraps the app and provides centralized data state
 * 
 * Features:
 * - Loads data from localStorage on mount
 * - Hydrates with mock data if VITE_USE_MOCK_DATA=true and no data exists
 * - Provides CRUD operations that update both state and localStorage
 * - Auto-syncs state with localStorage
 */
export function DataProvider({ children }) {
    const [interviews, setInterviewsState] = useState([]);
    const [hypotheses, setHypothesesState] = useState([]);
    const [reports, setReportsState] = useState([]);
    const [stats, setStatsState] = useState({ completed: 0, inProgress: 0, scheduled: 0 });
    const [trends, setTrendsState] = useState([]);
    const [demographics, setDemographicsState] = useState({});
    const [ageDistribution, setAgeDistributionState] = useState({});
    const [genderDistribution, setGenderDistributionState] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize data on mount
    useEffect(() => {
        const initializeData = () => {
            console.log('[DataContext] Initializing data store...');
            console.log('[DataContext] USE_MOCK_DATA:', USE_MOCK_DATA);

            // Run migration first
            migrateFromLegacyStorage();

            // Hydrate with mock data if enabled and no data exists
            if (USE_MOCK_DATA) {
                console.log('[DataContext] Mock mode enabled, checking for existing data...');
                
                if (!hasData(STORAGE_KEYS.INTERVIEWS)) {
                    console.log('[DataContext] Hydrating interviews with mock data');
                    setInterviews(mockInterviews);
                }
                if (!hasData(STORAGE_KEYS.HYPOTHESES)) {
                    console.log('[DataContext] Hydrating hypotheses with mock data');
                    setHypotheses(mockHypotheses);
                }
                if (!hasData(STORAGE_KEYS.STATS)) {
                    console.log('[DataContext] Hydrating stats with mock data');
                    setStats(mockStats);
                }
                if (!hasData(STORAGE_KEYS.TRENDS)) {
                    console.log('[DataContext] Hydrating trends with mock data');
                    setTrends(mockTrends);
                }
                if (!hasData(STORAGE_KEYS.DEMOGRAPHICS)) {
                    console.log('[DataContext] Hydrating demographics with mock data');
                    setDemographics(mockDemographics);
                }
                if (!hasData(STORAGE_KEYS.AGE_DISTRIBUTION)) {
                    console.log('[DataContext] Hydrating age distribution with mock data');
                    setAgeDistribution(mockAgeDistribution);
                }
                if (!hasData(STORAGE_KEYS.GENDER_DISTRIBUTION)) {
                    console.log('[DataContext] Hydrating gender distribution with mock data');
                    setGenderDistribution(mockGenderDistribution);
                }
            }

            // Load data from localStorage into state
            setInterviewsState(getInterviews());
            setHypothesesState(getHypotheses());
            setReportsState(getReports());
            setStatsState(getStats());
            setTrendsState(getTrends());
            setDemographicsState(getDemographics());
            setAgeDistributionState(getAgeDistribution());
            setGenderDistributionState(getGenderDistribution());

            setIsLoading(false);
            setIsInitialized(true);
            console.log('[DataContext] Data store initialized');
        };

        initializeData();
    }, []);

    // ============ Interview Actions ============

    const addInterview = useCallback((interview) => {
        storeAddInterview(interview);
        setInterviewsState(getInterviews());
    }, []);

    const updateInterview = useCallback((id, updates) => {
        storeUpdateInterview(id, updates);
        setInterviewsState(getInterviews());
    }, []);

    const deleteInterview = useCallback((id) => {
        storeDeleteInterview(id);
        setInterviewsState(getInterviews());
    }, []);

    const findInterviewById = useCallback((id) => {
        return getInterviewById(id);
    }, []);

    // ============ Hypothesis Actions ============

    const addHypothesis = useCallback((hypothesis) => {
        storeAddHypothesis(hypothesis);
        setHypothesesState(getHypotheses());
    }, []);

    const updateHypothesis = useCallback((id, updates) => {
        storeUpdateHypothesis(id, updates);
        setHypothesesState(getHypotheses());
    }, []);

    const deleteHypothesis = useCallback((id) => {
        storeDeleteHypothesis(id);
        setHypothesesState(getHypotheses());
    }, []);

    const setAllHypotheses = useCallback((newHypotheses) => {
        setHypotheses(newHypotheses);
        setHypothesesState(newHypotheses);
    }, []);

    // ============ Report Actions ============

    const addReport = useCallback((report) => {
        storeAddReport(report);
        setReportsState(getReports());
    }, []);

    const findReportById = useCallback((id) => {
        return getReportById(id);
    }, []);

    // ============ Stats Actions ============

    const updateStats = useCallback((newStats) => {
        setStats(newStats);
        setStatsState(newStats);
    }, []);

    // Compute stats from interviews
    const computeStatsFromInterviews = useCallback(() => {
        const currentInterviews = getInterviews();
        const computed = {
            completed: currentInterviews.filter(i => i.status === 'Completed').length,
            inProgress: currentInterviews.filter(i => i.status === 'Processing').length,
            scheduled: currentInterviews.filter(i => i.status === 'Scheduled').length,
        };
        setStats(computed);
        setStatsState(computed);
        return computed;
    }, []);

    // ============ Trends Actions ============

    const updateTrends = useCallback((newTrends) => {
        setTrends(newTrends);
        setTrendsState(newTrends);
    }, []);

    // ============ Demographics Actions ============

    const updateDemographics = useCallback((newDemographics) => {
        setDemographics(newDemographics);
        setDemographicsState(newDemographics);
    }, []);

    const updateAgeDistribution = useCallback((newDistribution) => {
        setAgeDistribution(newDistribution);
        setAgeDistributionState(newDistribution);
    }, []);

    const updateGenderDistribution = useCallback((newDistribution) => {
        setGenderDistribution(newDistribution);
        setGenderDistributionState(newDistribution);
    }, []);

    // ============ Utility ============

    const refreshFromStorage = useCallback(() => {
        setInterviewsState(getInterviews());
        setHypothesesState(getHypotheses());
        setReportsState(getReports());
        setStatsState(getStats());
        setTrendsState(getTrends());
        setDemographicsState(getDemographics());
        setAgeDistributionState(getAgeDistribution());
        setGenderDistributionState(getGenderDistribution());
    }, []);

    const value = {
        // State
        interviews,
        hypotheses,
        reports,
        stats,
        trends,
        demographics,
        ageDistribution,
        genderDistribution,
        isLoading,
        isInitialized,
        isMockMode: USE_MOCK_DATA,

        // Interview actions
        addInterview,
        updateInterview,
        deleteInterview,
        findInterviewById,

        // Hypothesis actions
        addHypothesis,
        updateHypothesis,
        deleteHypothesis,
        setAllHypotheses,

        // Report actions
        addReport,
        findReportById,

        // Stats actions
        updateStats,
        computeStatsFromInterviews,

        // Trends actions
        updateTrends,

        // Demographics actions
        updateDemographics,
        updateAgeDistribution,
        updateGenderDistribution,

        // Utility
        refreshFromStorage,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

/**
 * Hook to access the data context
 * Must be used within a DataProvider
 */
export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}

export default DataContext;
