/**
 * TreeLayout.js — Focused layout showing only spouse and children.
 *
 * Level 0 (top):        Focused person (and spouse)
 * Level 1 (bottom row): Children — shown horizontally
 *
 * When you click a child, that child becomes the new focus.
 * The up-arrow (▴) above the focused person navigates to their parent.
 */

export const CARD_W = 170;
export const CARD_H = 180;
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

    // ── TOP (Level 0): Focused person + spouse ───────────────────────────────
    const focusY = 30;

    positions[focusedId] = { x: centerX, y: focusY };
    visibleIds.push(focusedId);

    // Spouse
    const spouseId = focused.spouse;
    if (spouseId && familyMap.has(spouseId)) {
        positions[spouseId] = { x: centerX + CARD_W + H_GAP + 10, y: focusY };
        visibleIds.push(spouseId);
        edges.push({ fromId: focusedId, toId: spouseId, type: 'spouse' });
    }

    // ── BOTTOM ROW (Level 1): Children ───────────────────────────────────────
    const childIds = (focused.children || []).filter(id => familyMap.has(id));
    const childY = focusY + CARD_H + V_GAP;

    if (childIds.length > 0) {
        let parentMidX = centerX + CARD_W / 2;
        if (spouseId && familyMap.has(spouseId)) {
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
    const parentIds = focused.parents || [];
    const parentOfFocused = parentIds.length > 0 ? parentIds[0] : null;

    return { positions, edges, visibleIds, parentOfFocused };
}
