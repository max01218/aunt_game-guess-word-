const DB_KEY = 'aunt_word_game_scores';

/**
 * @typedef {Object} ScoreEntry
 * @property {string} id - Unique ID for the record
 * @property {string} studentId - The student's ID
 * @property {number} score - The score achieved
 * @property {number} timestamp - Epoch timestamp of when the score was recorded
 */

/**
 * Retrieve all scores from the database
 * @returns {ScoreEntry[]} Array of score entries, sorted by highest score or newest first
 */
export function getScores() {
    try {
        const rawData = localStorage.getItem(DB_KEY);
        if (!rawData) return [];

        const parsed = JSON.parse(rawData);
        // Sort logic: Highest score first, then newest first
        return parsed.sort((a, b) => b.score - a.score || b.timestamp - a.timestamp);
    } catch (err) {
        console.error('Failed to parse database from localStorage:', err);
        return [];
    }
}

/**
 * Save a new score to the database
 * @param {string} studentId - The student's ID
 * @param {number} score - The score achieved
 * @returns {ScoreEntry} The newly created score record
 */
export function saveScore(studentId, score) {
    const newEntry = {
        id: crypto.randomUUID(),
        studentId,
        score,
        timestamp: Date.now()
    };

    const currentScores = getScores();
    currentScores.push(newEntry);

    localStorage.setItem(DB_KEY, JSON.stringify(currentScores));
    return newEntry;
}

/**
 * Clear all scores from the database
 */
export function clearScores() {
    localStorage.removeItem(DB_KEY);
}
