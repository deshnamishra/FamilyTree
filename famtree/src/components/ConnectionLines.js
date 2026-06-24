// // import React from 'react';
// // import { motion } from 'framer-motion';

// // /**
// //  * Workday-style right-angle step connection lines.
// //  * Parent → vertical drop → horizontal crossbar → vertical stems to children.
// //  */
// // const CARD_W = 170;
// // const CARD_H_NO_CHEVRON = 155;
// // const CARD_H_WITH_CHEVRON = 180;

// // const ConnectionLines = ({ edges, positions, familyMap }) => {
// //     if (!edges || edges.length === 0) return null;

// //     const paths = edges.map((edge, i) => {
// //         const from = positions[edge.fromId];
// //         const to = positions[edge.toId];
// //         if (!from || !to) return null;

// //         let d = '';
// //         const lineColor = '#d1d5db';

// //         if (edge.type === 'spouse') {
// //             // Horizontal dashed line between spouses
// //             const x1 = from.x + CARD_W;
// //             const y1 = from.y + CARD_H_NO_CHEVRON / 2;
// //             const x2 = to.x;
// //             const y2 = to.y + CARD_H_NO_CHEVRON / 2;
// //             d = `M ${x1} ${y1} L ${x2} ${y2}`;

// //             return (
// //                 <motion.path
// //                     key={`${edge.fromId}-${edge.toId}-spouse-${i}`}
// //                     d={d}
// //                     stroke={lineColor}
// //                     strokeWidth={1.5}
// //                     strokeDasharray="4 3"
// //                     fill="none"
// //                     initial={{ pathLength: 0 }}
// //                     animate={{ pathLength: 1 }}
// //                     transition={{ duration: 0.5, ease: 'easeInOut' }}
// //                 />
// //             );
// //         }

// //         // Parent-child: right-angle step lines
// //         // From bottom-center of parent to top-center of child
// //         const x1 = from.x + CARD_W / 2;
// //         const y1 = from.y + CARD_H_WITH_CHEVRON;
// //         const x2 = to.x + CARD_W / 2;
// //         const y2 = to.y;
// //         const midY = (y1 + y2) / 2;

// //         // Step: down from parent → horizontal → down to child
// //         d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;

// //         return (
// //             <motion.path
// //                 key={`${edge.fromId}-${edge.toId}-${i}`}
// //                 d={d}
// //                 stroke={lineColor}
// //                 strokeWidth={1.5}
// //                 fill="none"
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //                 initial={{ pathLength: 0, opacity: 0 }}
// //                 animate={{ pathLength: 1, opacity: 1 }}
// //                 transition={{ duration: 0.6, ease: 'easeInOut', delay: i * 0.03 }}
// //             />
// //         );
// //     });

// //     return (
// //         <svg
// //             style={{
// //                 position: 'absolute', top: 0, left: 0,
// //                 width: '100%', height: '100%',
// //                 pointerEvents: 'none', overflow: 'visible', zIndex: 1,
// //             }}
// //         >
// //             {paths}
// //         </svg>
// //     );
// // };

// // export default ConnectionLines;
// import React from "react";
// import { motion } from "framer-motion";

// const CARD_W = 170;
// const CARD_H_NO_CHEVRON = 155;
// const CARD_H_WITH_CHEVRON = 180;

// const ConnectionLines = ({ edges, positions }) => {
//     if (!edges?.length) return null;

//     const lineColor = "#d1d5db";

//     const spouseEdges = edges.filter(
//         (edge) => edge.type === "spouse"
//     );

//     const parentChildEdges = edges.filter(
//         (edge) => edge.type !== "spouse"
//     );

//     const elements = [];

//     // ==========================
//     // SPOUSE LINES
//     // ==========================
//     spouseEdges.forEach((edge, i) => {
//         const from = positions[edge.fromId];
//         const to = positions[edge.toId];

//         if (!from || !to) return;

//         const x1 = from.x + CARD_W;
//         const y1 = from.y + CARD_H_NO_CHEVRON / 2;

//         const x2 = to.x;
//         const y2 = to.y + CARD_H_NO_CHEVRON / 2;

//         elements.push(
//             <motion.path
//                 key={`spouse-${i}`}
//                 d={`M ${x1} ${y1} L ${x2} ${y2}`}
//                 stroke={lineColor}
//                 strokeWidth={1.5}
//                 strokeDasharray="4 3"
//                 fill="none"
//                 initial={{ pathLength: 0 }}
//                 animate={{ pathLength: 1 }}
//                 transition={{ duration: 0.5 }}
//             />
//         );
//     });

//     // ==========================
//     // FIND COUPLES
//     // ==========================
//     spouseEdges.forEach((spouseEdge, familyIndex) => {
//         const parent1 = positions[spouseEdge.fromId];
//         const parent2 = positions[spouseEdge.toId];

//         if (!parent1 || !parent2) return;

//         // Find all children of this family
//         const children = parentChildEdges.filter(
//             (edge) =>
//                 edge.fromId === spouseEdge.fromId ||
//                 edge.fromId === spouseEdge.toId
//         );

//         if (!children.length) return;

//         const familyCenterX =
//             (
//                 parent1.x +
//                 CARD_W / 2 +
//                 parent2.x +
//                 CARD_W / 2
//             ) / 2;

//         const parentBottomY = Math.max(
//             parent1.y + CARD_H_WITH_CHEVRON,
//             parent2.y + CARD_H_WITH_CHEVRON
//         );

//         const childCenters = children
//             .map((edge) => positions[edge.toId])
//             .filter(Boolean)
//             .map((child) => ({
//                 x: child.x + CARD_W / 2,
//                 y: child.y,
//             }));

//         if (!childCenters.length) return;

//         const minX = Math.min(
//             ...childCenters.map((c) => c.x)
//         );

//         const maxX = Math.max(
//             ...childCenters.map((c) => c.x)
//         );

//         const barY = parentBottomY + 70;

//         // Parent vertical line
//         elements.push(
//             <motion.path
//                 key={`parent-drop-${familyIndex}`}
//                 d={`M ${familyCenterX} ${parentBottomY}
//                     L ${familyCenterX} ${barY}`}
//                 stroke={lineColor}
//                 strokeWidth={1.5}
//                 fill="none"
//                 initial={{ pathLength: 0 }}
//                 animate={{ pathLength: 1 }}
//                 transition={{ duration: 0.5 }}
//             />
//         );

//         // Horizontal crossbar
//         elements.push(
//             <motion.path
//                 key={`crossbar-${familyIndex}`}
//                 d={`M ${minX} ${barY}
//                     L ${maxX} ${barY}`}
//                 stroke={lineColor}
//                 strokeWidth={1.5}
//                 fill="none"
//                 initial={{ pathLength: 0 }}
//                 animate={{ pathLength: 1 }}
//                 transition={{ duration: 0.5 }}
//             />
//         );

//         // Child stems
//         childCenters.forEach((child, childIndex) => {
//             elements.push(
//                 <motion.path
//                     key={`child-${familyIndex}-${childIndex}`}
//                     d={`M ${child.x} ${barY}
//                         L ${child.x} ${child.y}`}
//                     stroke={lineColor}
//                     strokeWidth={1.5}
//                     fill="none"
//                     initial={{ pathLength: 0 }}
//                     animate={{ pathLength: 1 }}
//                     transition={{
//                         duration: 0.5,
//                         delay: childIndex * 0.05,
//                     }}
//                 />
//             );
//         });
//     });

//     return (
//         <svg
//             style={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 width: "100%",
//                 height: "100%",
//                 pointerEvents: "none",
//                 overflow: "visible",
//                 zIndex: 1,
//             }}
//         >
//             {elements}
//         </svg>
//     );
// };

// export default ConnectionLines;
import { motion } from 'framer-motion';

const CARD_W = 140;

export default function ConnectionLines({
  edges,
  positions,
  familyMap,
  canvasW,
  canvasH,
  yOffset = 0,
  avatarD = 80,
}) {
  if (!edges || edges.length === 0) return null;

  // Helpers: top/center/bottom of a sphere in SVG coords
  const sphereTop = (pos) => pos.y + yOffset;
  const sphereMid = (pos) => pos.y + yOffset + avatarD / 2;
  const sphereBottom = (pos) => pos.y + yOffset + avatarD;
  const cardCenterX = (pos) => pos.x + CARD_W / 2;

  // ── 1. Spouse lines ────────────────────────────────────────────────
  const spouseLines = edges
    .filter((e) => e.type === 'spouse')
    .map((edge, i) => {
      const from = positions[edge.from];
      const to = positions[edge.to];

      if (!from || !to) return null;

      const [left, right] = from.x < to.x ? [from, to] : [to, from];

      const x1 = left.x + CARD_W / 2 + avatarD / 2;
      const x2 = right.x + CARD_W / 2 - avatarD / 2;
      const y = sphereMid(from);

      return (
        <motion.line
          key={`spouse-${edge.from}-${edge.to}-${i}`}
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          stroke="#f9a8d4"
          strokeWidth={2}
          strokeDasharray="5,4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      );
    });

  // ── 2. Parent-child step lines ─────────────────────────────────────
  const childToVisibleParents = new Map();

  edges
    .filter((e) => e.type === 'parent-child')
    .forEach((edge) => {
      if (!positions[edge.from] || !positions[edge.to]) return;

      const arr = childToVisibleParents.get(edge.to) ?? [];

      if (!arr.includes(edge.from)) {
        arr.push(edge.from);
      }

      childToVisibleParents.set(edge.to, arr);
    });

  const groups = new Map();

  childToVisibleParents.forEach((parentIds, childId) => {
    const key = [...parentIds].sort().join('|');

    const group =
      groups.get(key) ?? {
        parentIds: [...parentIds].sort(),
        childIds: [],
      };

    if (!group.childIds.includes(childId)) {
      group.childIds.push(childId);
    }

    groups.set(key, group);
  });

  const parentChildPaths = [];

  groups.forEach(({ parentIds, childIds }, key) => {
    const parentXCenters = parentIds
      .map((id) => positions[id])
      .filter(Boolean)
      .map((p) => cardCenterX(p));

    if (parentXCenters.length === 0) return;

    const trunkX =
      parentXCenters.reduce((a, b) => a + b, 0) /
      parentXCenters.length;

    const parentBottomY = Math.max(
      ...parentIds.map((id) =>
        positions[id] ? sphereBottom(positions[id]) : 0
      )
    );

    const childTopY = Math.min(
      ...childIds.map((id) =>
        positions[id] ? sphereTop(positions[id]) : Infinity
      )
    );

    const midY =
      parentBottomY +
      (childTopY - parentBottomY) * 0.5;

    const childXCenters = childIds
      .map((id) => positions[id])
      .filter(Boolean)
      .map((p) => cardCenterX(p))
      .sort((a, b) => a - b);

    if (childXCenters.length === 0) return;

    const leftX = childXCenters[0];
    const rightX = childXCenters[childXCenters.length - 1];

    parentChildPaths.push(
      <motion.path
        key={`trunk-${key}`}
        d={`M ${trunkX} ${parentBottomY} L ${trunkX} ${midY}`}
        stroke="#cbd5e1"
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    );

    if (childXCenters.length > 1) {
      parentChildPaths.push(
        <motion.path
          key={`crossbar-${key}`}
          d={`M ${leftX} ${midY} L ${rightX} ${midY}`}
          stroke="#cbd5e1"
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
            delay: 0.1,
          }}
        />
      );
    }

    childIds.forEach((childId, idx) => {
      const childPos = positions[childId];

      if (!childPos) return;

      const cx = cardCenterX(childPos);
      const cy = sphereTop(childPos);

      if (childIds.length === 1 && Math.abs(trunkX - cx) < 1) {
        return;
      }

      parentChildPaths.push(
        <motion.path
          key={`stem-${key}-${childId}`}
          d={`M ${cx} ${midY} L ${cx} ${cy}`}
          stroke="#cbd5e1"
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
            delay: 0.15 + idx * 0.03,
          }}
        />
      );
    });

    if (childIds.length === 1) {
      const childPos = positions[childIds[0]];

      if (childPos) {
        const cx = cardCenterX(childPos);
        const cy = sphereTop(childPos);

        if (Math.abs(trunkX - cx) >= 1) {
          parentChildPaths.push(
            <motion.path
              key={`jog-${key}`}
              d={`M ${trunkX} ${midY} L ${cx} ${midY} L ${cx} ${cy}`}
              stroke="#cbd5e1"
              strokeWidth={1.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 0.4,
                ease: 'easeInOut',
                delay: 0.1,
              }}
            />
          );
        }
      }
    }
  });

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${canvasW}px`,
        height: `${canvasH}px`,
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 1,
      }}
    >
      {spouseLines}
      {parentChildPaths}
    </svg>
  );
}