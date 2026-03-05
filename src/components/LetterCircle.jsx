import React, { useRef, useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function LetterCircle({ letters, currentPath, startDrawing, addLetterToPath, endDrawing }) {
    const containerRef = useRef(null);
    const [positions, setPositions] = useState([]);
    const [pointerPos, setPointerPos] = useState(null);

    // Calculate positions of letters in a circle
    useEffect(() => {
        if (!containerRef.current) return;

        // Slight delay to ensure layout is done
        const calculatePositions = () => {
            const rect = containerRef.current.getBoundingClientRect();
            const radius = rect.width / 2 - 40; // 40 is padding/button radius roughly
            const center = { x: rect.width / 2, y: rect.height / 2 };

            const newPos = letters.map((_, i) => {
                // Start from top (-PI/2) and go clockwise
                const angle = -Math.PI / 2 + (i * 2 * Math.PI) / letters.length;
                return {
                    x: center.x + radius * Math.cos(angle),
                    y: center.y + radius * Math.sin(angle),
                };
            });
            setPositions(newPos);
        };

        calculatePositions();
        window.addEventListener('resize', calculatePositions);
        return () => window.removeEventListener('resize', calculatePositions);
    }, [letters]);

    const handlePointerDown = (e, index) => {
        e.preventDefault();
        // Add event listeners for touch devices if touch-action none isn't enough
        startDrawing(index);
        setPointerPos({ x: e.clientX, y: e.clientY });
    };

    const handlePointerMove = useCallback((e) => {
        if (currentPath.length === 0) return;
        e.preventDefault(); // Prevent scrolling on mobile

        let clientX = e.clientX;
        let clientY = e.clientY;

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        setPointerPos({ x: clientX, y: clientY });

        // Find if we're hovering over any letter
        // Using elementFromPoint is reliable for touch moves across different elements
        const element = document.elementFromPoint(clientX, clientY);
        if (element && element.dataset.index !== undefined) {
            const index = parseInt(element.dataset.index, 10);
            addLetterToPath(index);
        }
    }, [currentPath.length, addLetterToPath]);

    const handlePointerUp = useCallback(() => {
        if (currentPath.length > 0) {
            endDrawing();
            setPointerPos(null);
        }
    }, [currentPath.length, endDrawing]);

    useEffect(() => {
        if (currentPath.length > 0) {
            window.addEventListener('pointermove', handlePointerMove, { passive: false });
            window.addEventListener('touchmove', handlePointerMove, { passive: false });
            window.addEventListener('pointerup', handlePointerUp);
            window.addEventListener('touchend', handlePointerUp);

            return () => {
                window.removeEventListener('pointermove', handlePointerMove);
                window.removeEventListener('touchmove', handlePointerMove);
                window.removeEventListener('pointerup', handlePointerUp);
                window.removeEventListener('touchend', handlePointerUp);
            };
        }
    }, [currentPath.length, handlePointerMove, handlePointerUp]);

    // Transform client coordinates to SVG relative coordinates
    const getRelativePointerCoords = () => {
        if (!pointerPos || !containerRef.current) return null;
        const rect = containerRef.current.getBoundingClientRect();
        return {
            x: pointerPos.x - rect.left,
            y: pointerPos.y - rect.top,
        };
    };

    const relPointer = getRelativePointerCoords();

    return (
        <div
            className="relative w-64 h-64 md:w-80 md:h-80 mx-auto select-none touch-none"
            ref={containerRef}
        >
            {/* Draw lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {positions.length > 0 && currentPath.length > 0 && (
                    <>
                        {/* Draw lines between selected points */}
                        {currentPath.map((nodeIndex, i) => {
                            if (i === 0) return null;
                            const prevNode = positions[currentPath[i - 1]];
                            const currNode = positions[nodeIndex];
                            return (
                                <line
                                    key={`line-${i}`}
                                    x1={prevNode.x}
                                    y1={prevNode.y}
                                    x2={currNode.x}
                                    y2={currNode.y}
                                    stroke="rgba(255, 255, 255, 0.6)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                />
                            );
                        })}

                        {/* Draw active line to pointer */}
                        {relPointer && (
                            <line
                                x1={positions[currentPath[currentPath.length - 1]].x}
                                y1={positions[currentPath[currentPath.length - 1]].y}
                                x2={relPointer.x}
                                y2={relPointer.y}
                                stroke="rgba(255, 255, 255, 0.6)"
                                strokeWidth="8"
                                strokeLinecap="round"
                            />
                        )}
                    </>
                )}
            </svg>

            {/* Draw buttons */}
            {positions.map((pos, i) => {
                const isSelected = currentPath.includes(i);
                return (
                    <div
                        key={`letter-${i}`}
                        data-index={i}
                        onPointerDown={(e) => handlePointerDown(e, i)}
                        style={{
                            position: 'absolute',
                            left: `${pos.x}px`,
                            top: `${pos.y}px`,
                            transform: 'translate(-50%, -50%)',
                            touchAction: 'none'
                        }}
                        className={cn(
                            "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg transition-transform duration-200 cursor-pointer z-10",
                            isSelected
                                ? "bg-purple-600 text-white scale-110 shadow-purple-500/50"
                                : "bg-white text-purple-900 hover:bg-gray-100"
                        )}
                    >
                        {letters[i]}
                    </div>
                );
            })}
        </div>
    );
}
