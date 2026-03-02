import React, { useState } from 'react';
import { X, Save, Plus } from 'lucide-react';

export function AdminPanel({ onClose, onSave }) {
    const [letters, setLetters] = useState(() => {
        const saved = localStorage.getItem('word_connect_custom_level');
        if (saved) return JSON.parse(saved).letters.join(',');
        return 'A,N,T,I,G';
    });
    const [targets, setTargets] = useState(() => {
        const saved = localStorage.getItem('word_connect_custom_level');
        if (saved) return JSON.parse(saved).targetWords.join(',');
        return 'ANT,TAG,GAIN,GIANT';
    });
    const [traps, setTraps] = useState(() => {
        const saved = localStorage.getItem('word_connect_custom_level');
        if (saved) return JSON.parse(saved).trapWords.join(',');
        return 'GIN,TIN,ANTI,GNAT';
    });

    const [error, setError] = useState('');

    const handleSave = () => {
        try {
            const letterArray = letters.split(',').map(l => l.trim().toUpperCase()).filter(Boolean);
            const targetArray = targets.split(',').map(w => w.trim().toUpperCase()).filter(Boolean);
            const trapArray = traps.split(',').map(w => w.trim().toUpperCase()).filter(Boolean);

            if (letterArray.length < 3) {
                setError('Please provide at least 3 letters.');
                return;
            }
            if (targetArray.length === 0) {
                setError('Please provide at least 1 target word.');
                return;
            }

            // Optional: validate that targets/traps can actually be formed by letters
            // (Skipping deep validation here for simplicity, assuming teacher knows what they are doing)

            onSave({
                letters: letterArray,
                targetWords: targetArray,
                trapWords: trapArray
            });
        } catch (err) {
            setError('Invalid input format. Please use comma-separated values.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
                <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span>👩‍🏫</span> Teacher Admin Panel
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-indigo-500 rounded-full transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-5 overflow-y-auto">
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">
                            Available Letters (Comma Separated)
                        </label>
                        <input
                            type="text"
                            value={letters}
                            onChange={(e) => setLetters(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg uppercase tracking-wider focus:border-indigo-500 focus:outline-none transition"
                            placeholder="e.g. C, A, T, S"
                        />
                        <p className="text-xs text-gray-500">The letters students can use to form words.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">
                            Target Words (Comma Separated)
                        </label>
                        <textarea
                            value={targets}
                            onChange={(e) => setTargets(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-lg p-3 text-base uppercase focus:border-indigo-500 focus:outline-none transition min-h-[80px]"
                            placeholder="e.g. CAT, ACT, CATS"
                        />
                        <p className="text-xs text-gray-500">The correct answers to beat the level.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">
                            Trap Words (Comma Separated)
                        </label>
                        <textarea
                            value={traps}
                            onChange={(e) => setTraps(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-lg p-3 text-base uppercase focus:border-indigo-500 focus:outline-none transition min-h-[80px]"
                            placeholder="e.g. SAT, AT"
                        />
                        <p className="text-xs text-gray-500">Valid words that distract students (-10 points penalty if guessed).</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2.5 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                    >
                        <Save className="w-5 h-5" />
                        Save & Play
                    </button>
                </div>
            </div>
        </div>
    );
}
