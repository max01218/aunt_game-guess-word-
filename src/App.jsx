import React from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { WordGrid } from './components/WordGrid';
import { LetterCircle } from './components/LetterCircle';
import { AdminPanel } from './components/AdminPanel';
import { Shuffle, Lightbulb, Trophy, ListOrdered } from 'lucide-react';
import { useState, useEffect } from 'react';
import { StartScreen } from './components/StartScreen';
import { Scoreboard } from './components/Scoreboard';
import { saveScore } from './utils/db';

function App() {
  const {
    letters,
    targetWords,
    foundWords,
    currentPath,
    currentWord,
    feedback,
    hints,
    startDrawing,
    addLetterToPath,
    endDrawing,
    shuffleLetters,
    getHint,
    score,
    combo,
    streak,
    scoreSfx,
    lastWordTime,
    timeLimit,
    loadLevel
  } = useGameLogic();

  const [showAdmin, setShowAdmin] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  const isLevelComplete = foundWords.length === targetWords.length;

  useEffect(() => {
    if (isLevelComplete && !scoreSaved && studentId) {
      saveScore(studentId, score);
      setTimeout(() => setScoreSaved(true), 0);
    }
  }, [isLevelComplete, scoreSaved, studentId, score]);

  const handleRestart = () => {
    // Reset necessary game state via reload for simplicity as before, 
    // but in a real app you'd add a reset method to useGameLogic.
    window.location.reload();
  };

  if (!studentId) {
    return <StartScreen onStart={setStudentId} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 flex flex-col font-sans overflow-hidden">
      <header className="px-6 pt-8 pb-4 flex justify-between items-center text-white/90">
        <div>
          <h1 className="text-2xl font-bold tracking-wider">WORD CONNECT</h1>
          <div className="text-sm font-medium text-indigo-300 mt-1 flex gap-4">
            <span>Score: <strong className="text-yellow-400 text-lg">{score}</strong></span>
            {combo > 1 && <span className="text-orange-400 animate-pulse">Combo x{combo}!</span>}
            {streak > 2 && <span className="text-green-400">Streak: {streak}🔥</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-semibold bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span>{foundWords.length} / {targetWords.length}</span>
          </div>
          <button
            onClick={() => setShowScoreboard(true)}
            className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 active:bg-white/30 transition shadow-lg backdrop-blur-sm"
            aria-label="View Scoreboard"
          >
            <ListOrdered className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Combo Progress Bar */}
      {combo > 0 && lastWordTime && (
        <div className="h-1 bg-white/10 w-full">
          <div
            className="h-full bg-orange-400 origin-left transition-all duration-500 ease-linear"
            style={{
              width: `${Math.max(0, 100 - ((new Date().getTime() - lastWordTime) / timeLimit) * 100)}%`
            }}
          />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full max-w-lg mx-auto overflow-hidden">

        {/* Top: Word Grid */}
        <div className="flex-1 overflow-y-auto w-full">
          <WordGrid
            targetWords={targetWords}
            foundWords={foundWords}
            currentWord={currentWord}
            feedback={feedback}
            hints={hints}
          />
        </div>

        {/* Bottom Menu / Complete Screen */}
        <div className="pb-10 pt-4 px-6 flex flex-col items-center justify-end">
          {isLevelComplete ? (
            <div className="text-center animate-bounceIn bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 w-full mb-8 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
                <div className="w-64 h-64 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
              </div>
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4 relative z-10" />
              <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Level Complete!</h2>
              <p className="text-indigo-200 mb-2 relative z-10">You found all the words.</p>
              <p className="text-4xl font-black text-yellow-400 mb-6 drop-shadow-md relative z-10">Score: {score}</p>
              <button
                onClick={handleRestart}
                className="bg-white text-purple-900 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition shadow-lg w-full mb-4 relative z-10"
              >
                Play Again
              </button>
              <button
                onClick={() => setShowScoreboard(true)}
                className="bg-purple-800/50 text-white font-bold px-8 py-3 rounded-full hover:bg-purple-700/50 transition shadow-lg w-full border border-purple-500/30 relative z-10"
              >
                View Scoreboard
              </button>
            </div>
          ) : (
            <>
              {/* Level Progress Label */}
              <div className="w-full flex justify-between px-4 mb-2">
                <button
                  onClick={shuffleLetters}
                  className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 active:bg-white/30 transition shadow-lg backdrop-blur-sm shadow-black/20"
                  aria-label="Shuffle letters"
                >
                  <Shuffle className="w-6 h-6" />
                </button>
                <button
                  onClick={getHint}
                  className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 active:bg-white/30 transition shadow-lg backdrop-blur-sm shadow-black/20"
                  aria-label="Get a hint"
                >
                  <Lightbulb className="w-6 h-6" />
                </button>
              </div>

              {/* Letter Circle Input */}
              <div className="relative">
                {/* Floating Score SFX */}
                {scoreSfx.map(sfx => (
                  <div
                    key={sfx.id}
                    className={`absolute -top-12 left-1/2 -translate-x-1/2 text-2xl font-black whitespace-nowrap z-50 pointer-events-none animate-floatUp 
                      ${sfx.points > 0 ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]'}`
                    }
                  >
                    {sfx.text}
                  </div>
                ))}

                <LetterCircle
                  letters={letters}
                  currentPath={currentPath}
                  startDrawing={startDrawing}
                  addLetterToPath={addLetterToPath}
                  endDrawing={endDrawing}
                />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Teacher Mode Button */}
      <button
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm transition z-40"
      >
        Teacher Mode 👩‍🏫
      </button>

      {/* Admin Panel Modal */}
      {showAdmin && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          onSave={(newConfig) => {
            loadLevel(newConfig);
            setShowAdmin(false);
          }}
        />
      )}

      {/* Scoreboard Modal */}
      {showScoreboard && (
        <Scoreboard onClose={() => setShowScoreboard(false)} />
      )}
    </div>
  );
}

export default App;
