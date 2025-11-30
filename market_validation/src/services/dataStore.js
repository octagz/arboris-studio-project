/**
 * Centralized localStorage data store for Market Validation app
 * Provides consistent CRUD operations for all entity types
 */

// Storage keys - unified naming convention
export const STORAGE_KEYS = {
    INTERVIEWS: 'mv_interviews',
    HYPOTHESES: 'mv_hypotheses',
    REPORTS: 'mv_reports',
    STATS: 'mv_stats',
    TRENDS: 'mv_trends',
    DEMOGRAPHICS: 'mv_demographics',
    AGE_DISTRIBUTION: 'mv_age_distribution',
    GENDER_DISTRIBUTION: 'mv_gender_distribution',
};

// Legacy keys for migration
const LEGACY_KEYS = {
    USER_INTERVIEWS: 'user_interviews',
    REPORTS: 'market_validation_reports',
};

/**
 * Generic get from localStorage
 */
export function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`[dataStore] Error reading ${key}:`, error);
        return defaultValue;
    }
}

/**
 * Generic set to localStorage
 */
export function setToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`[dataStore] Error writing ${key}:`, error);
        return false;
    }
}

/**
 * Check if a key exists and has data
 */
export function hasData(key) {
    const data = localStorage.getItem(key);
    return data !== null && data !== '[]' && data !== '{}';
}

// ============ Interviews ============

export function getInterviews() {
    return getFromStorage(STORAGE_KEYS.INTERVIEWS, []);
}

export function setInterviews(interviews) {
    return setToStorage(STORAGE_KEYS.INTERVIEWS, interviews);
}

export function addInterview(interview) {
    const interviews = getInterviews();
    interviews.unshift(interview); // Add to beginning
    return setInterviews(interviews);
}

export function updateInterview(id, updates) {
    const interviews = getInterviews();
    const index = interviews.findIndex(i => i.id === id || i.id === String(id));
    if (index !== -1) {
        interviews[index] = { ...interviews[index], ...updates };
        return setInterviews(interviews);
    }
    return false;
}

export function deleteInterview(id) {
    const interviews = getInterviews();
    const filtered = interviews.filter(i => i.id !== id && i.id !== String(id));
    return setInterviews(filtered);
}

export function getInterviewById(id) {
    const interviews = getInterviews();
    return interviews.find(i => i.id === id || i.id === String(id)) || null;
}

// ============ Hypotheses ============

export function getHypotheses() {
    return getFromStorage(STORAGE_KEYS.HYPOTHESES, []);
}

export function setHypotheses(hypotheses) {
    return setToStorage(STORAGE_KEYS.HYPOTHESES, hypotheses);
}

export function addHypothesis(hypothesis) {
    const hypotheses = getHypotheses();
    hypotheses.push(hypothesis);
    return setHypotheses(hypotheses);
}

export function updateHypothesis(id, updates) {
    const hypotheses = getHypotheses();
    const index = hypotheses.findIndex(h => h.id === id || h.id === String(id));
    if (index !== -1) {
        hypotheses[index] = { ...hypotheses[index], ...updates };
        return setHypotheses(hypotheses);
    }
    return false;
}

export function deleteHypothesis(id) {
    const hypotheses = getHypotheses();
    const filtered = hypotheses.filter(h => h.id !== id && h.id !== String(id));
    return setHypotheses(filtered);
}

// ============ Reports ============

export function getReports() {
    return getFromStorage(STORAGE_KEYS.REPORTS, []);
}

export function setReports(reports) {
    return setToStorage(STORAGE_KEYS.REPORTS, reports);
}

export function addReport(report) {
    const reports = getReports();
    reports.push(report);
    return setReports(reports);
}

export function getReportById(id) {
    const reports = getReports();
    return reports.find(r => r.id === id || r.id === String(id) || r.id.toString() === id) || null;
}

// ============ Stats ============

export function getStats() {
    return getFromStorage(STORAGE_KEYS.STATS, { completed: 0, inProgress: 0, scheduled: 0 });
}

export function setStats(stats) {
    return setToStorage(STORAGE_KEYS.STATS, stats);
}

// ============ Trends ============

export function getTrends() {
    return getFromStorage(STORAGE_KEYS.TRENDS, []);
}

export function setTrends(trends) {
    return setToStorage(STORAGE_KEYS.TRENDS, trends);
}

// ============ Demographics ============

export function getDemographics() {
    return getFromStorage(STORAGE_KEYS.DEMOGRAPHICS, {});
}

export function setDemographics(demographics) {
    return setToStorage(STORAGE_KEYS.DEMOGRAPHICS, demographics);
}

export function getAgeDistribution() {
    return getFromStorage(STORAGE_KEYS.AGE_DISTRIBUTION, {});
}

export function setAgeDistribution(distribution) {
    return setToStorage(STORAGE_KEYS.AGE_DISTRIBUTION, distribution);
}

export function getGenderDistribution() {
    return getFromStorage(STORAGE_KEYS.GENDER_DISTRIBUTION, {});
}

export function setGenderDistribution(distribution) {
    return setToStorage(STORAGE_KEYS.GENDER_DISTRIBUTION, distribution);
}

// ============ Migration ============

/**
 * Migrate data from legacy localStorage keys to new unified keys
 * This runs once on app initialization
 */
export function migrateFromLegacyStorage() {
    let migrated = false;

    // Migrate user_interviews -> mv_interviews
    const legacyInterviews = getFromStorage(LEGACY_KEYS.USER_INTERVIEWS, null);
    if (legacyInterviews && legacyInterviews.length > 0) {
        const currentInterviews = getInterviews();
        // Merge legacy interviews (avoid duplicates by id)
        const existingIds = new Set(currentInterviews.map(i => i.id));
        const newInterviews = legacyInterviews.filter(i => !existingIds.has(i.id));
        if (newInterviews.length > 0) {
            setInterviews([...newInterviews, ...currentInterviews]);
            console.log(`[dataStore] Migrated ${newInterviews.length} interviews from legacy storage`);
            migrated = true;
        }
        // Remove legacy key
        localStorage.removeItem(LEGACY_KEYS.USER_INTERVIEWS);
    }

    // Migrate market_validation_reports -> mv_reports
    const legacyReports = getFromStorage(LEGACY_KEYS.REPORTS, null);
    if (legacyReports && legacyReports.length > 0) {
        const currentReports = getReports();
        const existingIds = new Set(currentReports.map(r => r.id));
        const newReports = legacyReports.filter(r => !existingIds.has(r.id));
        if (newReports.length > 0) {
            setReports([...currentReports, ...newReports]);
            console.log(`[dataStore] Migrated ${newReports.length} reports from legacy storage`);
            migrated = true;
        }
        // Remove legacy key
        localStorage.removeItem(LEGACY_KEYS.REPORTS);
    }

    return migrated;
}

/**
 * Clear all app data from localStorage
 */
export function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    console.log('[dataStore] All data cleared');
}
