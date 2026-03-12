import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const FamilyTreeCanvas = ({ children, style }) => {
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const dragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const containerRef = useRef();

    const MIN_SCALE = 0.25;
    const MAX_SCALE = 2.5;

    // ── Zoom ──────────────────────────────────────────────────────────────────
    const zoom = useCallback((delta) => {
        setScale(s => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta)));
    }, []);

    // ── Wheel handling (Scroll & Zoom) ────────────────────────────────────────
    const handleWheel = useCallback((e) => {
        if (e.ctrlKey || e.metaKey) {
            // Zooming
            e.preventDefault();
            const delta = -e.deltaY * 0.001;
            setScale(s => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta)));
        } else {
            // Scrolling
            setTranslate(t => ({
                x: t.x - e.deltaX,
                y: t.y - e.deltaY
            }));
        }
    }, [MIN_SCALE, MAX_SCALE]);

    // ── Drag ──────────────────────────────────────────────────────────────────
    const handleMouseDown = useCallback((e) => {
        if (e.button !== 0) return;
        dragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
        document.body.style.cursor = 'grabbing';
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!dragging.current) return;
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        lastPos.current = { x: e.clientX, y: e.clientY };
        setTranslate(t => ({ x: t.x + dx, y: t.y + dy }));
    }, []);

    const handleMouseUp = useCallback(() => {
        dragging.current = false;
        document.body.style.cursor = 'default';
    }, []);

    // Touch support
    const touchStart = useRef(null);
    const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
            touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    };
    const handleTouchMove = (e) => {
        if (e.touches.length === 1 && touchStart.current) {
            const dx = e.touches[0].clientX - touchStart.current.x;
            const dy = e.touches[0].clientY - touchStart.current.y;
            touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            setTranslate(t => ({ x: t.x + dx, y: t.y + dy }));
        }
    };

    const resetView = () => {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
            {/* Canvas */}
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    cursor: dragging.current ? 'grabbing' : 'grab',
                    position: 'relative',
                }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => { touchStart.current = null; }}
            >
                <div
                    style={{
                        transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                        transformOrigin: '50% 50%',
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        transition: dragging.current ? 'none' : 'transform 0.1s ease',
                    }}
                >
                    {children}
                </div>
            </div>

            {/* Zoom Controls */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '100px',
                    right: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    zIndex: 100,
                }}
            >
                {[
                    { label: '+', action: () => zoom(0.15), title: 'Zoom In' },
                    { label: '⊙', action: resetView, title: 'Reset View' },
                    { label: '−', action: () => zoom(-0.15), title: 'Zoom Out' },
                ].map(btn => (
                    <motion.button
                        key={btn.label}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={btn.action}
                        title={btn.title}
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: 'rgba(15,15,30,0.85)',
                            backdropFilter: 'blur(10px)',
                            border: '1.5px solid rgba(139,92,246,0.4)',
                            color: '#a78bfa',
                            fontSize: '18px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            lineHeight: 1,
                        }}
                    >
                        {btn.label}
                    </motion.button>
                ))}
            </div>

            {/* Scale indicator */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '28px',
                    right: '28px',
                    background: 'rgba(15,15,30,0.7)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    color: '#64748b',
                    fontSize: '11px',
                    zIndex: 100,
                }}
            >
                {Math.round(scale * 100)}%
            </div>
        </div>
    );
};

export default FamilyTreeCanvas;
