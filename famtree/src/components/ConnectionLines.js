import React from 'react';
import { motion } from 'framer-motion';

/**
 * Workday-style right-angle step connection lines.
 * Parent → vertical drop → horizontal crossbar → vertical stems to children.
 */
const CARD_W = 170;
const CARD_H_NO_CHEVRON = 155;
const CARD_H_WITH_CHEVRON = 180;

const ConnectionLines = ({ edges, positions, familyMap }) => {
    if (!edges || edges.length === 0) return null;

    const paths = edges.map((edge, i) => {
        const from = positions[edge.fromId];
        const to = positions[edge.toId];
        if (!from || !to) return null;

        let d = '';
        const lineColor = '#d1d5db';

        if (edge.type === 'spouse') {
            // Horizontal dashed line between spouses
            const x1 = from.x + CARD_W;
            const y1 = from.y + CARD_H_NO_CHEVRON / 2;
            const x2 = to.x;
            const y2 = to.y + CARD_H_NO_CHEVRON / 2;
            d = `M ${x1} ${y1} L ${x2} ${y2}`;

            return (
                <motion.path
                    key={`${edge.fromId}-${edge.toId}-spouse-${i}`}
                    d={d}
                    stroke={lineColor}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
            );
        }

        // Parent-child: right-angle step lines
        // From bottom-center of parent to top-center of child
        const x1 = from.x + CARD_W / 2;
        const y1 = from.y + CARD_H_WITH_CHEVRON;
        const x2 = to.x + CARD_W / 2;
        const y2 = to.y;
        const midY = (y1 + y2) / 2;

        // Step: down from parent → horizontal → down to child
        d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;

        return (
            <motion.path
                key={`${edge.fromId}-${edge.toId}-${i}`}
                d={d}
                stroke={lineColor}
                strokeWidth={1.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut', delay: i * 0.03 }}
            />
        );
    });

    return (
        <svg
            style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none', overflow: 'visible', zIndex: 1,
            }}
        >
            {paths}
        </svg>
    );
};

export default ConnectionLines;
