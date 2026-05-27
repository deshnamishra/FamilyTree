// import React from 'react';
// import { motion } from 'framer-motion';

// /**
//  * Workday-style right-angle step connection lines.
//  * Parent → vertical drop → horizontal crossbar → vertical stems to children.
//  */
// const CARD_W = 170;
// const CARD_H_NO_CHEVRON = 155;
// const CARD_H_WITH_CHEVRON = 180;

// const ConnectionLines = ({ edges, positions, familyMap }) => {
//     if (!edges || edges.length === 0) return null;

//     const paths = edges.map((edge, i) => {
//         const from = positions[edge.fromId];
//         const to = positions[edge.toId];
//         if (!from || !to) return null;

//         let d = '';
//         const lineColor = '#d1d5db';

//         if (edge.type === 'spouse') {
//             // Horizontal dashed line between spouses
//             const x1 = from.x + CARD_W;
//             const y1 = from.y + CARD_H_NO_CHEVRON / 2;
//             const x2 = to.x;
//             const y2 = to.y + CARD_H_NO_CHEVRON / 2;
//             d = `M ${x1} ${y1} L ${x2} ${y2}`;

//             return (
//                 <motion.path
//                     key={`${edge.fromId}-${edge.toId}-spouse-${i}`}
//                     d={d}
//                     stroke={lineColor}
//                     strokeWidth={1.5}
//                     strokeDasharray="4 3"
//                     fill="none"
//                     initial={{ pathLength: 0 }}
//                     animate={{ pathLength: 1 }}
//                     transition={{ duration: 0.5, ease: 'easeInOut' }}
//                 />
//             );
//         }

//         // Parent-child: right-angle step lines
//         // From bottom-center of parent to top-center of child
//         const x1 = from.x + CARD_W / 2;
//         const y1 = from.y + CARD_H_WITH_CHEVRON;
//         const x2 = to.x + CARD_W / 2;
//         const y2 = to.y;
//         const midY = (y1 + y2) / 2;

//         // Step: down from parent → horizontal → down to child
//         d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;

//         return (
//             <motion.path
//                 key={`${edge.fromId}-${edge.toId}-${i}`}
//                 d={d}
//                 stroke={lineColor}
//                 strokeWidth={1.5}
//                 fill="none"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 initial={{ pathLength: 0, opacity: 0 }}
//                 animate={{ pathLength: 1, opacity: 1 }}
//                 transition={{ duration: 0.6, ease: 'easeInOut', delay: i * 0.03 }}
//             />
//         );
//     });

//     return (
//         <svg
//             style={{
//                 position: 'absolute', top: 0, left: 0,
//                 width: '100%', height: '100%',
//                 pointerEvents: 'none', overflow: 'visible', zIndex: 1,
//             }}
//         >
//             {paths}
//         </svg>
//     );
// };

// export default ConnectionLines;
import React from "react";
import { motion } from "framer-motion";

const CARD_W = 170;
const CARD_H_NO_CHEVRON = 155;
const CARD_H_WITH_CHEVRON = 180;

const ConnectionLines = ({ edges, positions }) => {
    if (!edges?.length) return null;

    const lineColor = "#d1d5db";

    const spouseEdges = edges.filter(
        (edge) => edge.type === "spouse"
    );

    const parentChildEdges = edges.filter(
        (edge) => edge.type !== "spouse"
    );

    const elements = [];

    // ==========================
    // SPOUSE LINES
    // ==========================
    spouseEdges.forEach((edge, i) => {
        const from = positions[edge.fromId];
        const to = positions[edge.toId];

        if (!from || !to) return;

        const x1 = from.x + CARD_W;
        const y1 = from.y + CARD_H_NO_CHEVRON / 2;

        const x2 = to.x;
        const y2 = to.y + CARD_H_NO_CHEVRON / 2;

        elements.push(
            <motion.path
                key={`spouse-${i}`}
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke={lineColor}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
            />
        );
    });

    // ==========================
    // FIND COUPLES
    // ==========================
    spouseEdges.forEach((spouseEdge, familyIndex) => {
        const parent1 = positions[spouseEdge.fromId];
        const parent2 = positions[spouseEdge.toId];

        if (!parent1 || !parent2) return;

        // Find all children of this family
        const children = parentChildEdges.filter(
            (edge) =>
                edge.fromId === spouseEdge.fromId ||
                edge.fromId === spouseEdge.toId
        );

        if (!children.length) return;

        const familyCenterX =
            (
                parent1.x +
                CARD_W / 2 +
                parent2.x +
                CARD_W / 2
            ) / 2;

        const parentBottomY = Math.max(
            parent1.y + CARD_H_WITH_CHEVRON,
            parent2.y + CARD_H_WITH_CHEVRON
        );

        const childCenters = children
            .map((edge) => positions[edge.toId])
            .filter(Boolean)
            .map((child) => ({
                x: child.x + CARD_W / 2,
                y: child.y,
            }));

        if (!childCenters.length) return;

        const minX = Math.min(
            ...childCenters.map((c) => c.x)
        );

        const maxX = Math.max(
            ...childCenters.map((c) => c.x)
        );

        const barY = parentBottomY + 70;

        // Parent vertical line
        elements.push(
            <motion.path
                key={`parent-drop-${familyIndex}`}
                d={`M ${familyCenterX} ${parentBottomY}
                    L ${familyCenterX} ${barY}`}
                stroke={lineColor}
                strokeWidth={1.5}
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
            />
        );

        // Horizontal crossbar
        elements.push(
            <motion.path
                key={`crossbar-${familyIndex}`}
                d={`M ${minX} ${barY}
                    L ${maxX} ${barY}`}
                stroke={lineColor}
                strokeWidth={1.5}
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
            />
        );

        // Child stems
        childCenters.forEach((child, childIndex) => {
            elements.push(
                <motion.path
                    key={`child-${familyIndex}-${childIndex}`}
                    d={`M ${child.x} ${barY}
                        L ${child.x} ${child.y}`}
                    stroke={lineColor}
                    strokeWidth={1.5}
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                        duration: 0.5,
                        delay: childIndex * 0.05,
                    }}
                />
            );
        });
    });

    return (
        <svg
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                overflow: "visible",
                zIndex: 1,
            }}
        >
            {elements}
        </svg>
    );
};

export default ConnectionLines;