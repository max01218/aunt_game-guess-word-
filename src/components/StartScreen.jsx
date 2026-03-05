import React, { useState } from 'react';
import { Play } from 'lucide-react';

export function StartScreen({ onStart }) {
    const [studentId, setStudentId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (studentId.trim().length > 0) {
            onStart(studentId.trim());
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 p-6">
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
                    <div className="w-64 h-64 bg-indigo-500 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <h1 className="text-4xl font-black text-white text-center mb-2 relative z-10 tracking-widest drop-shadow-md">
                    WORD<br />CONNECT
                </h1>
                <p className="text-indigo-200 text-center mb-8 relative z-10 font-medium">Educational Edition</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="studentId" className="text-white font-bold tracking-wide">
                            Student ID (學號)
                        </label>
                        <input
                            id="studentId"
                            type="text"
                            required
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            placeholder="Enter your student ID..."
                            className="bg-white/20 border border-white/30 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition text-lg"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!studentId.trim()}
                        className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-black rounded-xl text-purple-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-xl shadow-yellow-500/20"
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <Play className="h-6 w-6 text-purple-700 group-hover:text-purple-800" aria-hidden="true" />
                        </span>
                        START GAME
                    </button>
                </form>
            </div>
        </div>
    );
}
