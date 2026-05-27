// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { fetchAllTrees, createTree, deleteTree } from '../services/api';

// function HomePage() {
//   const navigate = useNavigate();
//   const [trees, setTrees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showCreate, setShowCreate] = useState(false);
//   const [newName, setNewName] = useState('');
//   const [newDesc, setNewDesc] = useState('');

//   useEffect(() => {
//     loadTrees();
//   }, []);

//   async function loadTrees() {
//     setLoading(true);
//     setError('');
//     try {
//       const data = await fetchAllTrees();
//       setTrees(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error('Failed to load trees:', err);
//       setTrees([]);
//       setError(err?.response?.data?.message || 'Failed to load trees. Check backend URL / CORS / Render service status.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleCreate(e) {
//     e.preventDefault();
//     if (!newName.trim()) return;
//     try {
//       await createTree(newName.trim(), newDesc.trim());
//       setNewName(''); setNewDesc(''); setShowCreate(false);
//       loadTrees();
//     } catch (err) {
//       alert('Failed to create tree');
//     }
//   }

//   async function handleDelete(id, name) {
//     if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
//     try {
//       await deleteTree(id);
//       loadTrees();
//     } catch (err) {
//       alert('Failed to delete tree');
//     }
//   }

//   return (
//     <div style={{
//       minHeight: '100vh', background: '#fafafa',
//       fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column',
//     }}>

//       {/* Header */}
//       <nav style={{
//         background: '#fff', borderBottom: '1px solid #e5e7eb',
//         padding: '0 32px', height: '52px',
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//           <span style={{ fontSize: '22px' }}>🌳</span>
//           <span style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>FamTree</span>
//         </div>
//         <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
//           onClick={() => setShowCreate(true)}
//           style={{
//             background: '#2563eb', border: 'none', borderRadius: '8px',
//             color: '#fff', fontSize: '12px', fontWeight: 600,
//             padding: '8px 16px', cursor: 'pointer',
//           }}>+ New Tree</motion.button>
//       </nav>

//       {/* Main */}
//       <div style={{ flex: 1, maxWidth: '800px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>

//         <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111', marginBottom: '4px' }}>Your Family Trees</h1>
//         <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>Select a tree to explore or create a new one.</p>

//         {!!error && (
//           <div style={{
//             marginBottom: '14px',
//             padding: '10px 12px',
//             borderRadius: '8px',
//             border: '1px solid #fecaca',
//             background: '#fef2f2',
//             color: '#991b1b',
//             fontSize: '12px',
//           }}>
//             {error}
//           </div>
//         )}

//         {/* Loading */}
//         {loading && (
//           <div style={{ textAlign: 'center', padding: '40px' }}>
//             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
//               style={{ width: '28px', height: '28px', border: '3px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', margin: '0 auto' }} />
//           </div>
//         )}

//         {/* Empty state */}
//         {!loading && trees.length === 0 && (
//           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//             style={{
//               textAlign: 'center', padding: '48px 24px',
//               background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px',
//             }}>
//             <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌱</div>
//             <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>No trees yet</h3>
//             <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>Create your first family tree to get started.</p>
//             <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
//               onClick={() => setShowCreate(true)}
//               style={{
//                 background: '#2563eb', border: 'none', borderRadius: '8px',
//                 color: '#fff', fontSize: '12px', fontWeight: 600, padding: '8px 18px', cursor: 'pointer',
//               }}>+ Create Tree</motion.button>
//           </motion.div>
//         )}

//         {/* Tree list */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//           <AnimatePresence>
//             {trees.map((tree, i) => (
//               <motion.div key={tree._id}
//                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ delay: i * 0.05 }}
//               >
//                 <motion.div whileHover={{ y: -2 }}
//                   style={{
//                     background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px',
//                     padding: '16px 20px',
//                     display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                     cursor: 'pointer',
//                   }}
//                   onClick={() => navigate(`/tree/${tree._id}`)}
//                 >
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
//                     <div style={{
//                       width: '40px', height: '40px', borderRadius: '10px',
//                       background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       fontSize: '20px',
//                     }}>🌳</div>
//                     <div>
//                       <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#111' }}>{tree.name}</h3>
//                       {tree.description && (
//                         <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#9ca3af' }}>{tree.description}</p>
//                       )}
//                       <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#d1d5db' }}>
//                         Created {new Date(tree.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>

//                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                     <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
//                       onClick={(e) => { e.stopPropagation(); navigate(`/tree/${tree._id}`); }}
//                       style={{
//                         background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px',
//                         color: '#2563eb', fontSize: '11px', fontWeight: 600, padding: '5px 12px', cursor: 'pointer',
//                       }}>Open</motion.button>
//                     <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
//                       onClick={(e) => { e.stopPropagation(); handleDelete(tree._id, tree.name); }}
//                       style={{
//                         background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px',
//                         color: '#dc2626', fontSize: '11px', fontWeight: 600, padding: '5px 10px', cursor: 'pointer',
//                       }}>✕</motion.button>
//                   </div>
//                 </motion.div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>
//       </div>

//       {/* Create Tree Modal */}
//       <AnimatePresence>
//         {showCreate && (
//           <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//               onClick={() => setShowCreate(false)}
//               style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 200 }} />
//             <motion.div
//               initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
//               transition={{ type: 'spring', stiffness: 400, damping: 30 }}
//               style={{
//                 position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
//                 zIndex: 201, width: '90%', maxWidth: '380px',
//                 background: '#fff', borderRadius: '12px', padding: '24px',
//                 border: '1px solid #e5e7eb',
//               }}
//             >
//               <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#111' }}>
//                 Create New Tree
//               </h2>
//               <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                 <div>
//                   <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>
//                     Tree Name *
//                   </label>
//                   <input
//                     value={newName} onChange={e => setNewName(e.target.value)} required
//                     placeholder="e.g. Johnson Family"
//                     style={{
//                       width: '100%', padding: '8px 12px', borderRadius: '8px',
//                       border: '1px solid #e5e7eb', background: '#fafafa',
//                       fontSize: '13px', color: '#333', outline: 'none', boxSizing: 'border-box',
//                     }}
//                   />
//                 </div>
//                 <div>
//                   <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>
//                     Description
//                   </label>
//                   <input
//                     value={newDesc} onChange={e => setNewDesc(e.target.value)}
//                     placeholder="Optional description"
//                     style={{
//                       width: '100%', padding: '8px 12px', borderRadius: '8px',
//                       border: '1px solid #e5e7eb', background: '#fafafa',
//                       fontSize: '13px', color: '#333', outline: 'none', boxSizing: 'border-box',
//                     }}
//                   />
//                 </div>
//                 <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
//                   <motion.button type="button" whileTap={{ scale: 0.97 }}
//                     onClick={() => setShowCreate(false)}
//                     style={{
//                       flex: 1, padding: '9px', borderRadius: '8px',
//                       background: '#fff', border: '1px solid #d1d5db',
//                       color: '#374151', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
//                     }}>Cancel</motion.button>
//                   <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
//                     style={{
//                       flex: 1, padding: '9px', borderRadius: '8px',
//                       background: '#2563eb', border: 'none',
//                       color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
//                     }}>Create</motion.button>
//                 </div>
//               </form>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Footer */}
//       <div style={{
//         borderTop: '1px solid #e5e7eb', padding: '14px 32px',
//         textAlign: 'center', fontSize: '11px', color: '#9ca3af',
//       }}>FamTree — Built with React & MongoDB</div>
//     </div>
//   );
// }

// export default HomePage;
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fetchAllTrees, createTree, deleteTree } from '../services/api';

const CANVAS_W = 2800;
const CANVAS_H = 1400;

const BG_TREES = [
  { cx: 110,  baseY: 790, scale: 0.48, seed: 3  },
  { cx: 590,  baseY: 760, scale: 0.44, seed: 8  },
  { cx: 1100, baseY: 740, scale: 0.42, seed: 17 },
  { cx: 1650, baseY: 730, scale: 0.46, seed: 23 },
  { cx: 2100, baseY: 745, scale: 0.43, seed: 37 },
  { cx: 2600, baseY: 770, scale: 0.50, seed: 51 },
  { cx: 2980, baseY: 760, scale: 0.40, seed: 61 },
  { cx: 1300, baseY: 810, scale: 0.38, seed: 29 },
  { cx: 450,  baseY: 820, scale: 0.41, seed: 11 },
];

const FAMILY_FOLIAGE_COLORS = [
  ['#4a7c59', '#6aaa78', '#8ac890'],
  ['#7c4a4a', '#aa6a6a', '#c88a8a'],
  ['#4a6e8a', '#6a9aaa', '#8ab8c8'],
  ['#7c6a4a', '#aa926a', '#c8b08a'],
  ['#6a4a7c', '#926aaa', '#b08ac8'],
];

const TRUNK_COLORS = ['#6e5030', '#7a4a30', '#5a6030', '#704838', '#5a4870'];

// ── Hex shade helper ──────────────────────────────────────────────────────────
function shadeHex(hex, amount) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (n >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (n & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// ── Tree SVG ──────────────────────────────────────────────────────────────────
function TreeSVG({ colors, trunkColor, memberCount, scale = 1, hovered = false, isDecorative = false, seed = 1, atmosphericBlue = 0 }) {
  const W = 230 * scale;
  const H = 360 * scale;
  const cx = W / 2;
  const s = scale;

  const filterId    = `ff-${seed}`;
  const trunkGradId = `tg-${seed}`;
  const lightGradId = `lg-${seed}`;

  const trunkBaseW = 32 * s;
  const trunkTopW  = 14 * s;
  const trunkH     = 110 * s;
  const trunkBaseY = H - 24 * s;
  const trunkTopY  = trunkBaseY - trunkH;
  const rootFlareW = 42 * s;

  const b0 = { cx: cx + 4*s,   cy: trunkTopY + 10*s,  rx: 88*s, ry: 70*s  };
  const b1 = { cx: cx - 8*s,   cy: trunkTopY - 42*s,  rx: 78*s, ry: 64*s  };
  const b2 = { cx: cx + 12*s,  cy: trunkTopY - 82*s,  rx: 62*s, ry: 52*s  };
  const b3 = { cx: cx - 4*s,   cy: trunkTopY - 116*s, rx: 42*s, ry: 36*s  };

  const baseFreq = (0.032 + (seed % 7) * 0.004).toFixed(4);
  const dispScale = Math.round(22 * s);

  const count = Math.min(memberCount, 9);
  const silhouettes = Array.from({ length: count }, (_, i) => {
    const angle = (i / Math.max(count, 1)) * Math.PI * 1.7 - Math.PI * 0.35;
    const r = b0.rx * 0.44;
    return { x: b0.cx + r * Math.cos(angle), y: b0.cy + r * 0.55 * Math.sin(angle) };
  });

  const opacity = isDecorative ? 0.32 : 1;
  const atmOpacity = atmosphericBlue * 0.45;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} overflow="visible" style={{ display: 'block' }}>
      <defs>
        <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency={baseFreq} numOctaves="4" seed={seed} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={dispScale} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <linearGradient id={trunkGradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor={shadeHex(trunkColor, -35)} />
          <stop offset="35%"  stopColor={trunkColor} />
          <stop offset="65%"  stopColor={shadeHex(trunkColor, 20)} />
          <stop offset="100%" stopColor={shadeHex(trunkColor, -20)} />
        </linearGradient>
        <radialGradient id={lightGradId} cx="68%" cy="22%" r="60%">
          <stop offset="0%"  stopColor={shadeHex(colors[2], 35)} stopOpacity="0.6" />
          <stop offset="55%" stopColor={colors[1]} stopOpacity="0.0" />
        </radialGradient>
      </defs>

      {!isDecorative && (
        <ellipse cx={cx} cy={H - 20*s} rx={rootFlareW * 1.6} ry={10*s} fill="rgba(0,0,0,0.14)" />
      )}

      <path
        d={`M${cx - rootFlareW/2},${trunkBaseY}
            Q${cx - trunkBaseW/2 - 4*s},${trunkBaseY - 18*s}
             ${cx - trunkTopW/2},${trunkTopY}
            L${cx + trunkTopW/2},${trunkTopY}
            Q${cx + trunkBaseW/2 + 4*s},${trunkBaseY - 18*s}
             ${cx + rootFlareW/2},${trunkBaseY} Z`}
        fill={`url(#${trunkGradId})`}
        opacity={opacity}
      />

      {!isDecorative && [0.25, 0.45, 0.62, 0.78].map((t, i) => {
        const y = trunkTopY + (trunkBaseY - trunkTopY) * t;
        const halfW = (trunkTopW/2 + (trunkBaseW - trunkTopW)/2 * t);
        return (
          <line key={i}
            x1={cx - halfW*0.3} y1={y}
            x2={cx - halfW*0.5} y2={y + 10*s}
            stroke={shadeHex(trunkColor, -40)}
            strokeWidth={1.2*s} strokeOpacity={0.4} strokeLinecap="round"
          />
        );
      })}

      <g filter={`url(#${filterId})`} opacity={opacity}>
        <ellipse {...b0} fill={shadeHex(colors[0], -25)} />
        <ellipse {...b0} fill={colors[0]} />
        <ellipse {...b1} fill={colors[1]} />
        <ellipse {...b2} fill={colors[1]} />
        <ellipse {...b3} fill={colors[2]} />
        <ellipse cx={b0.cx} cy={b0.cy + b0.ry*0.3} rx={b0.rx*0.6} ry={b0.ry*0.4}
          fill={shadeHex(colors[0], -18)} />
      </g>

      <g filter={`url(#${filterId})`} opacity={isDecorative ? 0 : 0.85}>
        <ellipse {...b3} fill={`url(#${lightGradId})`} />
        <ellipse {...b2} fill={`url(#${lightGradId})`} rx={b2.rx*0.7} ry={b2.ry*0.7} />
      </g>

      {!isDecorative && [
        { cx: b0.cx - b0.rx*0.8, cy: b0.cy - b0.ry*0.3, r: 16*s },
        { cx: b0.cx + b0.rx*0.75, cy: b0.cy - b0.ry*0.1, r: 14*s },
        { cx: b1.cx - b1.rx*0.7, cy: b1.cy - b1.ry*0.5, r: 13*s },
        { cx: b2.cx + b2.rx*0.65, cy: b2.cy, r: 12*s },
        { cx: b3.cx - b3.rx*0.5, cy: b3.cy - b3.ry*0.6, r: 10*s },
      ].map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r}
          fill={i < 2 ? colors[0] : i < 4 ? colors[1] : colors[2]}
          filter={`url(#${filterId})`} opacity={0.8}
        />
      ))}

      {!isDecorative && silhouettes.map((p, i) => (
        <g key={i} opacity={0.72}>
          <circle cx={p.x} cy={p.y - 4.5*s} r={3.2*s} fill="rgba(15,10,5,0.85)" />
          <path
            d={`M${p.x},${p.y-1.5*s} L${p.x-3*s},${p.y+5*s}
                M${p.x},${p.y-1.5*s} L${p.x+3*s},${p.y+5*s}
                M${p.x},${p.y-1.5*s} L${p.x},${p.y+7*s}`}
            stroke="rgba(15,10,5,0.80)" strokeWidth={1.6*s} strokeLinecap="round" fill="none"
          />
        </g>
      ))}

      {atmosphericBlue > 0 && (
        <g filter={`url(#${filterId})`}>
          {[b0, b1, b2, b3].map((b, i) => (
            <ellipse key={i} {...b} fill={`rgba(176,200,232,${atmOpacity * 0.8})`} />
          ))}
        </g>
      )}

      {hovered && (
        <g filter={`url(#${filterId})`} opacity={0.18}>
          {[b0, b1, b2, b3].map((b, i) => <ellipse key={i} {...b} fill="white" />)}
        </g>
      )}
    </svg>
  );
}

// ── HomePage (ForestPage) ─────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const [view, setView] = useState(() => {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const scale = Math.min(winW / CANVAS_W, winH / CANVAS_H, 0.68);
    return { x: (winW - CANVAS_W * scale) / 2, y: (winH - CANVAS_H * scale) / 2, scale };
  });

  const drag = useRef({ active: false, startX: 0, startY: 0, vx: 0, vy: 0 });
  const animRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  // ── Data loading ────────────────────────────────────────────────────────────
  useEffect(() => { loadTrees(); }, []);

  async function loadTrees() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllTrees();
      setTrees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load trees:', err);
      setTrees([]);
      setError(err?.response?.data?.message || 'Failed to load trees. Check backend URL / CORS / Render service status.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await createTree(newName.trim(), newDesc.trim());
      setNewName(''); setNewDesc(''); setShowCreate(false);
      loadTrees();
    } catch {
      alert('Failed to create tree');
    }
  }

  async function handleDelete(id, name, e) {
    e.stopPropagation();
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteTree(id);
      loadTrees();
    } catch {
      alert('Failed to delete tree');
    }
  }

  // ── Build tree placements dynamically from loaded data ──────────────────────
  const TREE_PLACEMENTS = trees.map((tree, i) => {
    const slots = [
      { cx: 330,  baseY: 880, scale: 0.90 },
      { cx: 820,  baseY: 950, scale: 1.22 },
      { cx: 1380, baseY: 890, scale: 1.08 },
      { cx: 1930, baseY: 870, scale: 1.00 },
      { cx: 2460, baseY: 910, scale: 1.15 },
    ];
    const slot = slots[i % slots.length];
    // spread extra trees further right if beyond 5
    const extraOffset = Math.floor(i / slots.length) * 550;
    return {
      ...slot,
      cx: slot.cx + extraOffset,
      treeId: tree._id,
      name: tree.name,
      description: tree.description,
      seed: (i + 1) * 7,
      foliageColors: FAMILY_FOLIAGE_COLORS[i % FAMILY_FOLIAGE_COLORS.length],
      trunkColor: TRUNK_COLORS[i % TRUNK_COLORS.length],
      memberCount: tree.memberCount ?? 0,
    };
  });

  // ── Pan & zoom ──────────────────────────────────────────────────────────────
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.91 : 1.10;
    setView(v => {
      const newScale = Math.min(Math.max(v.scale * factor, 0.18), 2.8);
      const rect = containerRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      return { x: mx - (mx - v.x) * (newScale / v.scale), y: my - (my - v.y) * (newScale / v.scale), scale: newScale };
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const onMouseDown = (e) => {
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, vx: 0, vy: 0 };
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    drag.current.vx = e.clientX - drag.current.startX;
    drag.current.vy = e.clientY - drag.current.startY;
    drag.current.startX = e.clientX;
    drag.current.startY = e.clientY;
    setView(v => ({ ...v, x: v.x + drag.current.vx, y: v.y + drag.current.vy }));
  };

  const onMouseUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    let vx = drag.current.vx * 0.65;
    let vy = drag.current.vy * 0.65;
    const coast = () => {
      if (Math.abs(vx) < 0.4 && Math.abs(vy) < 0.4) return;
      vx *= 0.86; vy *= 0.86;
      setView(v => ({ ...v, x: v.x + vx, y: v.y + vy }));
      animRef.current = requestAnimationFrame(coast);
    };
    animRef.current = requestAnimationFrame(coast);
  };

  const resetView = () => {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const scale = Math.min(winW / CANVAS_W, winH / CANVAS_H, 0.68);
    setView({ x: (winW - CANVAS_W * scale) / 2, y: (winH - CANVAS_H * scale) / 2, scale });
  };

  return (
    <div ref={containerRef}
      style={{
        width: '100vw', height: '100vh', overflow: 'hidden',
        cursor: drag.current.active ? 'grabbing' : 'grab',
        userSelect: 'none', position: 'relative', background: '#c8dff0',
      }}
      onMouseDown={onMouseDown} onMouseMove={onMouseMove}
      onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
    >
      {/* Header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '10px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🌲</span>
          <span style={{ fontWeight: 700, fontSize: '16px', color: '#1a2e1a' }}>FamTree</span>
        </div>
        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
          Scroll to zoom · Drag to pan · Click a tree
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['+', '−'].map((lbl, i) => (
            <button key={lbl} onClick={() => setView(v => {
              const f = i === 0 ? 1.18 : 0.84;
              const ns = Math.min(Math.max(v.scale * f, 0.18), 2.8);
              const ww = window.innerWidth, wh = window.innerHeight;
              return { x: ww/2 - (ww/2 - v.x)*(ns/v.scale), y: wh/2 - (wh/2 - v.y)*(ns/v.scale), scale: ns };
            })}
              style={{ width: '28px', height: '28px', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '15px' }}
            >{lbl}</button>
          ))}
          <button onClick={resetView}
            style={{ padding: '0 10px', height: '28px', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '11px' }}
          >Reset</button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={(e) => { e.stopPropagation(); setShowCreate(true); }}
            style={{
              padding: '0 14px', height: '28px', background: '#2d6a2d', border: 'none',
              borderRadius: '6px', color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            }}>+ New Tree</motion.button>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200,223,240,0.7)' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            style={{ width: '36px', height: '36px', border: '4px solid #e5e7eb', borderTopColor: '#2d6a2d', borderRadius: '50%' }} />
        </div>
      )}

      {/* Error banner */}
      {!!error && (
        <div style={{
          position: 'fixed', top: '56px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 100, padding: '10px 18px', borderRadius: '8px',
          border: '1px solid #fecaca', background: '#fef2f2',
          color: '#991b1b', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>{error}</div>
      )}

      {/* Empty state */}
      {!loading && trees.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 50, textAlign: 'center', padding: '40px 32px',
            background: 'rgba(255,255,255,0.92)', borderRadius: '16px',
            border: '1px solid #e5e7eb', boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
          }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌱</div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a2e1a', marginBottom: '6px' }}>No trees yet</h3>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '18px' }}>Create your first family tree to get started.</p>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreate(true)}
            style={{
              background: '#2d6a2d', border: 'none', borderRadius: '8px',
              color: '#fff', fontSize: '13px', fontWeight: 600, padding: '9px 20px', cursor: 'pointer',
            }}>+ Create Tree</motion.button>
        </motion.div>
      )}

      {/* Zoomable canvas */}
      <div style={{
        position: 'absolute', width: `${CANVAS_W}px`, height: `${CANVAS_H}px`,
        transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
        transformOrigin: '0 0',
      }}>
        {/* Sky & ground scene */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#9dc4de" />
              <stop offset="40%"  stopColor="#bfd8ee" />
              <stop offset="72%"  stopColor="#d8ecce" />
              <stop offset="100%" stopColor="#c8e0b0" />
            </linearGradient>
            <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#7aad55" />
              <stop offset="100%" stopColor="#4e7a30" />
            </linearGradient>
          </defs>
          <rect width={CANVAS_W} height={CANVAS_H} fill="url(#sky)" />
          <rect x="0" y="700" width={CANVAS_W} height="120" fill="rgba(215,232,210,0.55)" />

          <path d="M0,820 Q140,760 280,790 Q420,820 560,755 Q700,690 840,740 Q980,785 1120,730 Q1260,680 1400,735 Q1540,785 1680,730 Q1820,680 1960,735 Q2100,785 2240,730 Q2380,680 2520,745 Q2660,800 2800,760 L2800,900 L0,900 Z"
            fill="rgba(110,145,90,0.55)" />
          <path d="M0,840 Q200,800 400,825 Q600,845 800,800 Q1000,760 1200,810 Q1400,855 1600,808 Q1800,760 2000,812 Q2200,858 2400,810 Q2600,765 2800,820 L2800,900 L0,900 Z"
            fill="rgba(120,158,85,0.7)" />

          <path d="M0,870 Q180,810 380,845 Q580,875 780,828 Q980,780 1180,840 Q1380,895 1580,848 Q1780,800 1980,858 Q2180,908 2380,858 Q2580,810 2800,870 L2800,1400 L0,1400 Z"
            fill="url(#ground)" />
          <path d="M0,875 Q180,818 380,850 Q580,880 780,832 Q980,786 1180,843 Q1380,897 1580,850 Q1780,804 1980,861 Q2180,912 2380,862 Q2580,812 2800,875 L2800,910 Q2580,852 2380,882 Q2180,935 1980,880 Q1780,828 1580,870 Q1380,920 1180,866 Q980,812 780,856 Q580,904 380,874 Q180,842 0,898 Z"
            fill="rgba(160,220,100,0.30)" />

          {Array.from({ length: 28 }, (_, i) => {
            const gx = 100 + i*96, gy = 873 + Math.sin(i*1.7)*18;
            return (
              <g key={i}>
                <path d={`M${gx},${gy} Q${gx-5},${gy-22} ${gx-2},${gy-35}`} stroke="rgba(80,140,40,0.45)" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d={`M${gx+8},${gy} Q${gx+13},${gy-18} ${gx+12},${gy-30}`} stroke="rgba(80,140,40,0.38)" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </g>
            );
          })}
        </svg>

        {/* Background decorative trees */}
        {BG_TREES.map((bt, i) => {
          const W = 230 * bt.scale, H = 360 * bt.scale;
          return (
            <div key={`bg-${i}`} style={{ position: 'absolute', left: bt.cx - W/2, top: bt.baseY - H, pointerEvents: 'none', zIndex: 1 }}>
              <TreeSVG colors={['#4a6e42', '#6a9a5a', '#8ab870']} trunkColor="#6e5030"
                memberCount={0} scale={bt.scale} seed={bt.seed} isDecorative atmosphericBlue={0.7} />
            </div>
          );
        })}

        {/* Family trees from API */}
        {TREE_PLACEMENTS.map(({ treeId, cx, baseY, scale, seed, name, description, foliageColors, trunkColor, memberCount }) => {
          const W = 230 * scale, H = 360 * scale;
          const isHovered = hoveredId === treeId;
          return (
            <div key={treeId}
              style={{ position: 'absolute', left: cx - W/2, top: baseY - H, cursor: 'pointer', zIndex: isHovered ? 10 : 2 }}
              onMouseEnter={e => {
                setHoveredId(treeId);
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({ treeId, name, description, memberCount, screenX: rect.left + rect.width/2, screenY: rect.top - 8 });
              }}
              onMouseLeave={() => { setHoveredId(null); setTooltip(null); }}
              onMouseDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); navigate(`/tree/${treeId}`); }}
            >
              <motion.div animate={{ y: isHovered ? -8 : 0 }} transition={{ type: 'spring', stiffness: 280, damping: 18 }}>
                <TreeSVG colors={foliageColors} trunkColor={trunkColor}
                  memberCount={memberCount} scale={scale} seed={seed} hovered={isHovered} />
              </motion.div>
              <div style={{ textAlign: 'center', marginTop: `${-6*scale}px`, fontFamily: 'Georgia, serif', fontSize: `${13*scale}px`, fontWeight: 700, color: isHovered ? '#1a3a1a' : '#2d3d2d', textShadow: '0 1px 4px rgba(255,255,255,0.9)', transition: 'color 0.2s', userSelect: 'none' }}>
                {name}
              </div>
              <div style={{ textAlign: 'center', fontSize: `${10*scale}px`, color: '#5a7050', userSelect: 'none', marginTop: `${2*scale}px`, textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}>
                {memberCount} members
              </div>
              {/* Delete button — visible on hover */}
              {isHovered && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', marginTop: `${4*scale}px` }}>
                  <button
                    onClick={(e) => handleDelete(treeId, name, e)}
                    style={{
                      background: 'rgba(220,38,38,0.85)', border: 'none', borderRadius: '5px',
                      color: '#fff', fontSize: `${9*scale}px`, fontWeight: 600,
                      padding: `${3*scale}px ${8*scale}px`, cursor: 'pointer',
                    }}>✕ Delete</button>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div key="tip"
            initial={{ opacity: 0, y: 6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', left: tooltip.screenX, top: tooltip.screenY, transform: 'translate(-50%, -100%)', zIndex: 200, background: 'rgba(255,255,255,0.97)', border: '1px solid #e2e8e2', borderRadius: '10px', padding: '11px 15px', maxWidth: '230px', boxShadow: '0 8px 28px rgba(0,0,0,0.14)', pointerEvents: 'none' }}
          >
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#1a2e1a', marginBottom: '5px', fontFamily: 'Georgia, serif' }}>{tooltip.name} Family</div>
            {tooltip.description && (
              <div style={{ fontSize: '11.5px', color: '#4b5563', lineHeight: 1.55 }}>{tooltip.description}</div>
            )}
            <div style={{ marginTop: '6px', fontSize: '11px', color: '#6b7280' }}>{tooltip.memberCount} members</div>
            <div style={{ marginTop: '6px', fontSize: '11px', color: '#2d6a2d', fontWeight: 600 }}>Click to explore →</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Tree Modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 200 }} />
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                zIndex: 201, width: '90%', maxWidth: '380px',
                background: '#fff', borderRadius: '14px', padding: '26px',
                border: '1px solid #e5e7eb', boxShadow: '0 16px 48px rgba(0,0,0,0.16)',
              }}
            >
              <h2 style={{ margin: '0 0 18px', fontSize: '16px', fontWeight: 700, color: '#1a2e1a', fontFamily: 'Georgia, serif' }}>
                🌱 Create New Tree
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>
                    Tree Name *
                  </label>
                  <input
                    value={newName} onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. Johnson Family"
                    onKeyDown={e => e.key === 'Enter' && handleCreate(e)}
                    style={{
                      width: '100%', padding: '8px 12px', borderRadius: '8px',
                      border: '1px solid #e5e7eb', background: '#fafafa',
                      fontSize: '13px', color: '#333', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>
                    Description
                  </label>
                  <input
                    value={newDesc} onChange={e => setNewDesc(e.target.value)}
                    placeholder="Optional description"
                    style={{
                      width: '100%', padding: '8px 12px', borderRadius: '8px',
                      border: '1px solid #e5e7eb', background: '#fafafa',
                      fontSize: '13px', color: '#333', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => setShowCreate(false)}
                    style={{
                      flex: 1, padding: '9px', borderRadius: '8px',
                      background: '#fff', border: '1px solid #d1d5db',
                      color: '#374151', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    }}>Cancel</motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={handleCreate}
                    style={{
                      flex: 1, padding: '9px', borderRadius: '8px',
                      background: '#2d6a2d', border: 'none',
                      color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    }}>Create</motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}