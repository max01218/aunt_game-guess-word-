import React, { useState, useMemo } from 'react';
import { X, Trophy, Search, User } from 'lucide-react';
import { getScores } from '../utils/db';

export function Scoreboard({ onClose }) {
    const [searchTerm, setSearchTerm] = useState('');

    const allScores = useMemo(() => getScores(), []);

    const filteredScores = useMemo(() => {
        if (!searchTerm.trim()) return allScores;
        const term = searchTerm.toLowerCase().trim();
        return allScores.filter(s => s.studentId.toLowerCase().includes(term));
    }, [allScores, searchTerm]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-white/20 overflow-hidden animate-bounceIn">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                        <h2 className="text-2xl font-bold text-white tracking-wider">Scoreboard</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-6 pb-2">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                        <input
                            type="text"
                            placeholder="Search by Student ID (查詢學號)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 text-white placeholder-indigo-300 px-12 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6 pt-4">
                    {filteredScores.length === 0 ? (
                        <div className="text-center py-12 text-indigo-300 flex flex-col items-center gap-4">
                            <User className="w-16 h-16 opacity-50" />
                            <p className="text-lg">No records found.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredScores.map((entry, index) => (
                                <div
                                    key={entry.id}
                                    className="flex items-center justify-between bg-white/10 p-4 rounded-2xl border border-white/5 hover:bg-white/15 transition-colors"
                                >
                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-2">
                                        <div className="min-w-[100px] flex gap-2 items-center text-indigo-200 text-sm font-medium">
                                            <span className="w-6 text-center opacity-50">#{index + 1}</span>
                                            <span className="bg-indigo-950/50 px-3 py-1 rounded-full whitespace-nowrap">
                                                {new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-indigo-300 uppercase tracking-wider font-semibold">Student ID</span>
                                            <span className="text-xl font-bold text-white">{entry.studentId}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end min-w-[120px]">
                                        <span className="text-xs text-yellow-400/80 uppercase tracking-wider font-semibold">Score</span>
                                        <span className="text-2xl font-black text-yellow-400 drop-shadow-md">{entry.score}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
