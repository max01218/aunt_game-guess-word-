import { useState, useCallback, useEffect } from 'react';

const DEFAULT_CONFIG = {
    letters: ['A', 'N', 'T', 'I', 'G'],
    targetWords: ['ANT', 'TAG', 'GAIN', 'GIANT'],
    trapWords: ['GIN', 'TIN', 'ANTI', 'GNAT']
};

const COMBO_TIME_LIMIT = 10000;
const STORAGE_KEY = 'word_connect_custom_level';

export function useGameLogic() {
    // Initialize config from localStorage or fallback to DEFAULT_CONFIG
    const [config, setConfig] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved level data", e);
            }
        }
        return DEFAULT_CONFIG;
    });

    const [letters, setLetters] = useState(config.letters);
    const [foundWords, setFoundWords] = useState([]);
    const [currentPath, setCurrentPath] = useState([]);

    // Scoring states
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [streak, setStreak] = useState(0);
    const [lastWordTime, setLastWordTime] = useState(null);
    const [scoreSfx, setScoreSfx] = useState([]); // Array of { id, text, points }

    const [feedback, setFeedback] = useState(null); // 'wrong', 'already-found', 'correct', null
    const [hints, setHints] = useState({}); // { wordIndex: [letterIndex, ...] }

    // Drop combo if time passes
    useEffect(() => {
        if (combo > 0 && lastWordTime) {
            const timer = setInterval(() => {
                if (Date.now() - lastWordTime > COMBO_TIME_LIMIT) {
                    setCombo(0);
                }
            }, 500);
            return () => clearInterval(timer);
        }
    }, [combo, lastWordTime]);

    // Cleanup scoreSfx
    useEffect(() => {
        if (scoreSfx.length > 0) {
            const timer = setTimeout(() => {
                setScoreSfx(prev => prev.slice(1));
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [scoreSfx]);

    const addScoreSfx = useCallback((text, points) => {
        setScoreSfx(prev => [...prev, { id: Date.now() + Math.random(), text, points }]);
    }, []);

    const shuffleLetters = useCallback(() => {
        setLetters((prev) => {
            const newLetters = [...prev];
            for (let i = newLetters.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newLetters[i], newLetters[j]] = [newLetters[j], newLetters[i]];
            }
            return newLetters;
        });
    }, []);

    const startDrawing = useCallback((index) => {
        setCurrentPath([index]);
        setFeedback(null);
    }, []);

    const addLetterToPath = useCallback((index) => {
        setCurrentPath((prev) => {
            // If we go back to the previous letter, we might want to pop the last one
            if (prev.length > 1 && prev[prev.length - 2] === index) {
                return prev.slice(0, -1);
            }
            // Add if not already in path
            if (!prev.includes(index)) {
                return [...prev, index];
            }
            return prev;
        });
    }, []);

    const endDrawing = useCallback(() => {
        if (currentPath.length < 2) {
            setCurrentPath([]);
            return;
        }

        const word = currentPath.map(idx => letters[idx]).join('');
        const now = Date.now();

        if (foundWords.includes(word)) {
            setFeedback('already-found');
            setStreak(0);
            setCombo(0);
        } else if (config.targetWords.includes(word)) {
            setFoundWords(prev => [...prev, word]);
            setFeedback('correct');

            // Scoring
            let baseScore = 0;
            if (word.length <= 3) baseScore = 30;
            else if (word.length === 4) baseScore = 60;
            else baseScore = 150;

            // Combo
            let newCombo = 1;
            if (lastWordTime && now - lastWordTime <= COMBO_TIME_LIMIT) {
                newCombo = combo + 1;
            }
            setCombo(newCombo);
            setLastWordTime(now);

            // Multiplier
            let multiplier = 1;
            if (newCombo === 2) multiplier = 1.5;
            else if (newCombo >= 3) multiplier = 2;

            let pointsGained = Math.floor(baseScore * multiplier);
            let sfxText = `+${pointsGained}`;

            // Streak
            const newStreak = streak + 1;
            setStreak(newStreak);
            if (newStreak > 0 && newStreak % 3 === 0) {
                pointsGained += 100;
                sfxText = `+${pointsGained} (Perfect!)`;
            }

            setScore(prev => prev + pointsGained);
            addScoreSfx(sfxText, pointsGained);

        } else if (config.trapWords.includes(word)) {
            setFeedback('wrong');
            setStreak(0);
            setCombo(0);
            setScore(prev => Math.max(0, prev - 10)); // Penalty for falling into a trap
            addScoreSfx('-10 (Trap!)', -10);
        } else {
            setFeedback('wrong');
            setStreak(0);
            setCombo(0);
        }

        setCurrentPath([]);

        // Clear feedback after a short delay
        setTimeout(() => {
            setFeedback(null);
        }, 1000);
    }, [currentPath, letters, foundWords, combo, lastWordTime, streak, addScoreSfx]);

    const getHint = useCallback(() => {
        // Find an unfound word
        const unfoundWords = config.targetWords.filter(w => !foundWords.includes(w));
        if (unfoundWords.length === 0) return; // All found

        // Penalty for hint
        setScore(prev => Math.max(0, prev - 20));
        addScoreSfx('-20 (Hint)', -20);
        setCombo(0); // Break combo on hint too
        setStreak(0); // Optional: break perfect streak on hint

        // Pick the first unfound word for the hint
        const wordToHint = unfoundWords[0];
        const targetWordIndex = config.targetWords.indexOf(wordToHint);

        setHints(prev => {
            const wordHints = prev[targetWordIndex] || [];
            if (wordHints.length < wordToHint.length) {
                return {
                    ...prev,
                    [targetWordIndex]: [...wordHints, wordHints.length]
                };
            }
            return prev;
        });
    }, [foundWords, addScoreSfx]);

    const loadLevel = useCallback((newConfig) => {
        setConfig(newConfig);
        setLetters(newConfig.letters);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig)); // Save to local storage

        setFoundWords([]);
        setCurrentPath([]);
        setScore(0);
        setCombo(0);
        setStreak(0);
        setLastWordTime(null);
        setScoreSfx([]);
        setFeedback(null);
        setHints({});
    }, []);

    return {
        letters,
        targetWords: config.targetWords,
        foundWords,
        currentPath,
        currentWord: currentPath.map(idx => letters[idx]).join(''),
        feedback,
        hints,
        score,
        combo,
        streak,
        scoreSfx,
        lastWordTime,
        timeLimit: COMBO_TIME_LIMIT,
        startDrawing,
        addLetterToPath,
        endDrawing,
        shuffleLetters,
        getHint,
        loadLevel
    };
}
