import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function WordGrid({ targetWords, foundWords, currentWord, feedback, hints }) {
    const [lastFoundWord, setLastFoundWord] = useState(null);

    // Track the last found word to trigger the bounce animation
    useEffect(() => {
        if (foundWords.length > 0) {
            setLastFoundWord(foundWords[foundWords.length - 1]);
            const timer = setTimeout(() => {
                setLastFoundWord(null);
            }, 1000); // clear bounce after 1 second
            return () => clearTimeout(timer);
        }
    }, [foundWords]);

    return (
        <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-4">
                {targetWords.map((word, wordIndex) => {
                    const isFound = foundWords.includes(word);
                    const isRecentlyFound = lastFoundWord === word;
                    const wordHints = hints[wordIndex] || [];

                    return (
                        <div
                            key={word}
                            className={cn(
                                "flex gap-1",
                                isRecentlyFound && "animate-bounceIn"
                            )}
                        >
                            {word.split('').map((char, charIndex) => {
                                const isHinted = wordHints.includes(charIndex);

                                return (
                                    <div
                                        key={`${word}-${charIndex}`}
                                        className={cn(
                                            "w-10 h-10 border-2 rounded-lg flex items-center justify-center text-xl font-bold uppercase transition-all duration-300",
                                            isFound
                                                ? "bg-purple-500 border-purple-600 text-white shadow-md shadow-purple-500/50"
                                                : isHinted
                                                    ? "bg-blue-100 border-blue-400 text-blue-800"
                                                    : "bg-white/10 border-white/30 text-transparent"
                                        )}
                                    >
                                        {(isFound || isHinted) ? char : ''}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Current input display */}
            <div className="h-14 mt-4 flex items-center justify-center">
                {currentWord.length > 0 && (
                    <div
                        className={cn(
                            "px-6 py-2 rounded-full text-2xl font-bold tracking-widest text-white backdrop-blur-sm",
                            feedback === 'wrong' ? "bg-red-500/80 animate-shake" :
                                feedback === 'already-found' ? "bg-yellow-500/80" :
                                    feedback === 'correct' ? "bg-green-500/80" :
                                        "bg-white/20"
                        )}
                    >
                        {currentWord}
                    </div>
                )}
            </div>
        </div>
    );
}
