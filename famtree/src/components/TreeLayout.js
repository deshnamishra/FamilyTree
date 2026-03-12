/**
 * TreeLayout.js — Workday-style 3-level focused layout.
 *
 * Level 0 (top row):    Peers of focused person (siblings/co-workers) — shown horizontally
 * Level 1 (center):     Focused person (and spouse)
 * Level 2 (bottom row): Children/direct reports — shown horizontally
 *
 * When you click a chevron/expand on someone, that person becomes the new focus.
 * The up-arrow (˄) above the focused person reveals their parent level.
 */

export const CARD_W = 170;
export const CARD_H = 180;  // with chevron
const H_GAP = 24;
const V_GAP = 80;

/**
 * computeFocusedLayout
 * @param {string} focusedId - The person currently in focus (center)
 * @param {Map} familyMap - Map of id → person object
 * @param {number} canvasW - viewport width
 * @returns { positions, edges, visibleIds, parentOfFocused }
 */
export function computeFocusedLayout(focusedId, familyMap, canvasW) {
    const positions = {};
    const edges = [];
    const visibleIds = [];

    const focused = familyMap.get(focusedId);
    if (!focused) return { positions, edges, visibleIds, parentOfFocused: null };

    const centerX = canvasW / 2 - CARD_W / 2;

    // ── TOP ROW (Level 0): Peers — siblings of focused person ────────────────
    // Find parents first
    const parentIds = focused.parents || [];
    let peers = [];
    if (parentIds.length > 0) {
        const firstParent = familyMap.get(parentIds[0]);
        if (firstParent) {
            peers = (firstParent.children || [])
                .filter(id => id !== focusedId && familyMap.has(id));
        }
    }

    // Also add parents themselves to top row
    const topRowIds = [...parentIds.filter(id => familyMap.has(id)), ...peers];
    const topY = 30;

    if (topRowIds.length > 0) {
        const totalTopW = topRowIds.length * CARD_W + (topRowIds.length - 1) * H_GAP;
        const topStartX = Math.max(20, (canvasW - totalTopW) / 2);

        topRowIds.forEach((id, i) => {
            positions[id] = {
                x: topStartX + i * (CARD_W + H_GAP),
                y: topY,
            };
            visibleIds.push(id);

            // Draw lines from parents to focused person
            if (parentIds.includes(id)) {
                edges.push({ fromId: id, toId: focusedId, type: 'parent-child' });
            }
        });

        // Spouse edges among parents
        const parentPeople = parentIds.map(id => familyMap.get(id)).filter(Boolean);
        if (parentPeople.length === 2) {
            const p1 = parentPeople[0];
            const p2 = parentPeople[1];
            if (p1.spouse === p2.id || p2.spouse === p1.id) {
                edges.push({ fromId: p1.id, toId: p2.id, type: 'spouse' });
            }
        }
    }

    // ── CENTER (Level 1): Focused person + spouse ────────────────────────────
    const focusY = topRowIds.length > 0 ? topY + CARD_H + V_GAP : 30;

    positions[focusedId] = { x: centerX, y: focusY };
    visibleIds.push(focusedId);

    // Spouse
    const spouseId = focused.spouse;
    if (spouseId && familyMap.has(spouseId)) {
        // Don't show spouse if they're already in the top row as a parent
        if (!topRowIds.includes(spouseId)) {
            positions[spouseId] = { x: centerX + CARD_W + H_GAP + 10, y: focusY };
            visibleIds.push(spouseId);
            edges.push({ fromId: focusedId, toId: spouseId, type: 'spouse' });
        }
    }

    // ── BOTTOM ROW (Level 2): Children / direct reports ──────────────────────
    const childIds = (focused.children || []).filter(id => familyMap.has(id));
    const childY = focusY + CARD_H + V_GAP;

    if (childIds.length > 0) {
        // Calculate the horizontal midpoint of the parent(s) to center children under them
        let parentMidX = centerX + CARD_W / 2;
        if (spouseId && familyMap.has(spouseId) && !topRowIds.includes(spouseId)) {
            // If spouse is present and visible, midpoint is between focused and spouse
            const spouseX = centerX + CARD_W + H_GAP + 10;
            parentMidX = (centerX + spouseX + CARD_W) / 2;
        }

        const totalChildW = childIds.length * CARD_W + (childIds.length - 1) * H_GAP;
        const childStartX = parentMidX - totalChildW / 2;

        childIds.forEach((id, i) => {
            positions[id] = {
                x: childStartX + i * (CARD_W + H_GAP),
                y: childY,
            };
            visibleIds.push(id);
            edges.push({ fromId: focusedId, toId: id, type: 'parent-child' });
        });
    }

    // Determine the first parent for "go up" navigation
    const parentOfFocused = parentIds.length > 0 ? parentIds[0] : null;

    return { positions, edges, visibleIds, parentOfFocused };
}
