// /**
//  * TreeLayout.js — Focused layout showing only spouse and children.
//  *
//  * Level 0 (top):        Focused person (and spouse)
//  * Level 1 (bottom row): Children — shown horizontally
//  *
//  * When you click a child, that child becomes the new focus.
//  * The up-arrow (▴) above the focused person navigates to their parent.
//  */

// export const CARD_W = 170;
// export const CARD_H = 180;
// const H_GAP = 24;
// const V_GAP = 80;

// /**
//  * computeFocusedLayout
//  * @param {string} focusedId - The person currently in focus (center)
//  * @param {Map} familyMap - Map of id → person object
//  * @param {number} canvasW - viewport width
//  * @returns { positions, edges, visibleIds, parentOfFocused }
//  */
// export function computeFocusedLayout(focusedId, familyMap, canvasW) {
//     const positions = {};
//     const edges = [];
//     const visibleIds = [];

//     const focused = familyMap.get(focusedId);
//     if (!focused) return { positions, edges, visibleIds, parentOfFocused: null };

//     const centerX = canvasW / 2 - CARD_W / 2;

//     // ── TOP (Level 0): Focused person + spouse ───────────────────────────────
//     const focusY = 30;

//     positions[focusedId] = { x: centerX, y: focusY };
//     visibleIds.push(focusedId);

//     // Spouse
//     const spouseId = focused.spouse;
//     if (spouseId && familyMap.has(spouseId)) {
//         positions[spouseId] = { x: centerX + CARD_W + H_GAP + 10, y: focusY };
//         visibleIds.push(spouseId);
//         edges.push({ fromId: focusedId, toId: spouseId, type: 'spouse' });
//     }

//     // ── BOTTOM ROW (Level 1): Children ───────────────────────────────────────
//     const childIds = (focused.children || []).filter(id => familyMap.has(id));
//     const childY = focusY + CARD_H + V_GAP;

//     if (childIds.length > 0) {
//         let parentMidX = centerX + CARD_W / 2;
//         if (spouseId && familyMap.has(spouseId)) {
//             const spouseX = centerX + CARD_W + H_GAP + 10;
//             parentMidX = (centerX + spouseX + CARD_W) / 2;
//         }

//         const totalChildW = childIds.length * CARD_W + (childIds.length - 1) * H_GAP;
//         const childStartX = parentMidX - totalChildW / 2;

//         childIds.forEach((id, i) => {
//             positions[id] = {
//                 x: childStartX + i * (CARD_W + H_GAP),
//                 y: childY,
//             };
//             visibleIds.push(id);
//             edges.push({ fromId: focusedId, toId: id, type: 'parent-child' });
//         });
//     }

//     // Determine the first parent for "go up" navigation
//     const parentIds = focused.parents || [];
//     const parentOfFocused = parentIds.length > 0 ? parentIds[0] : null;

//     return { positions, edges, visibleIds, parentOfFocused };
// }
const CARD_W = 140;
const CARD_H = 80;
const H_GAP = 24;
const V_GAP = 100;

function rowX(count, index, canvasW) {
  const totalW = count * CARD_W + (count - 1) * H_GAP;
  const startX = (canvasW - totalW) / 2;
  return startX + index * (CARD_W + H_GAP);
}

export function computeFocusedLayout(
  focusedId,
  familyMap,
  canvasW
) {
  const positions = {};
  const edges = [];
  const visible = new Set();

  const focused = familyMap.get(focusedId);

  if (!focused) {
    return {
      positions,
      edges,
      visibleIds: [],
      parentOfFocused: null,
    };
  }

  const parentOfFocused = focused.parents?.[0] ?? null;

  // ── Row 0: Grandparents ──────────────────────────────────
  const parentIds = focused.parents.filter(id =>
    familyMap.has(id)
  );

  const grandparentIds = [];

  parentIds.forEach(pid => {
    const parent = familyMap.get(pid);

    parent.parents.forEach(gid => {
      if (
        familyMap.has(gid) &&
        !grandparentIds.includes(gid)
      ) {
        grandparentIds.push(gid);
      }
    });
  });

  if (grandparentIds.length > 0) {
    grandparentIds.forEach((id, i) => {
      positions[id] = {
        x: rowX(grandparentIds.length, i, canvasW),
        y: 20,
      };

      visible.add(id);
    });
  }

  // ── Row 1: Parents + Spouses ─────────────────────────────
  const parentRowIds = [];

  parentIds.forEach(pid => {
    if (!parentRowIds.includes(pid)) {
      parentRowIds.push(pid);
    }

    const parent = familyMap.get(pid);

    if (
      parent.spouse &&
      familyMap.has(parent.spouse) &&
      !parentIds.includes(parent.spouse) &&
      !parentRowIds.includes(parent.spouse)
    ) {
      parentRowIds.push(parent.spouse);
    }
  });

  const row1Y =
    grandparentIds.length > 0
      ? 20 + CARD_H + V_GAP
      : 20;

  parentRowIds.forEach((id, i) => {
    positions[id] = {
      x: rowX(parentRowIds.length, i, canvasW),
      y: row1Y,
    };

    visible.add(id);
  });

  // ── Row 2: Focused + Siblings + Spouses ──────────────────
  const siblings = [];

  parentIds.forEach(pid => {
    const parent = familyMap.get(pid);

    parent.children.forEach(cid => {
      if (!siblings.includes(cid)) {
        siblings.push(cid);
      }
    });
  });

  if (!siblings.includes(focusedId)) {
    siblings.unshift(focusedId);
  }

  const row2Members = [];

  siblings.forEach(sid => {
    if (!row2Members.includes(sid)) {
      row2Members.push(sid);
    }

    const sibling = familyMap.get(sid);

    if (
      sibling?.spouse &&
      familyMap.has(sibling.spouse) &&
      !siblings.includes(sibling.spouse) &&
      !row2Members.includes(sibling.spouse)
    ) {
      row2Members.push(sibling.spouse);
    }
  });

  const row2Y =
    row1Y +
    (parentRowIds.length > 0
      ? CARD_H + V_GAP
      : 0);

  row2Members.forEach((id, i) => {
    positions[id] = {
      x: rowX(row2Members.length, i, canvasW),
      y: row2Y,
    };

    visible.add(id);
  });

  // ── Row 3: Children + Spouses ────────────────────────────
  const childIds = focused.children.filter(id =>
    familyMap.has(id)
  );

  const row3Members = [];

  childIds.forEach(cid => {
    if (!row3Members.includes(cid)) {
      row3Members.push(cid);
    }

    const child = familyMap.get(cid);

    if (
      child?.spouse &&
      familyMap.has(child.spouse) &&
      !childIds.includes(child.spouse) &&
      !row3Members.includes(child.spouse)
    ) {
      row3Members.push(child.spouse);
    }
  });

  const row3Y = row2Y + CARD_H + V_GAP;

  row3Members.forEach((id, i) => {
    positions[id] = {
      x: rowX(row3Members.length, i, canvasW),
      y: row3Y,
    };

    visible.add(id);
  });

  // ── Row 4: Grandchildren ─────────────────────────────────
  const grandchildIds = [];

  childIds.forEach(cid => {
    const child = familyMap.get(cid);

    child.children.forEach(gcid => {
      if (
        familyMap.has(gcid) &&
        !grandchildIds.includes(gcid)
      ) {
        grandchildIds.push(gcid);
      }
    });
  });

  if (grandchildIds.length > 0) {
    const row4Y = row3Y + CARD_H + V_GAP;

    grandchildIds.forEach((id, i) => {
      positions[id] = {
        x: rowX(grandchildIds.length, i, canvasW),
        y: row4Y,
      };

      visible.add(id);
    });

    grandchildIds.forEach(gcid => {
      const grandchild = familyMap.get(gcid);

      grandchild.parents
        .filter(pid => visible.has(pid))
        .forEach(pid => {
          edges.push({
            from: pid,
            to: gcid,
            type: 'parent-child',
          });
        });
    });
  }

  // ── Parent → Child Edges ────────────────────────────────
  visible.forEach(id => {
    const member = familyMap.get(id);

    member.children.forEach(cid => {
      if (visible.has(cid)) {
        edges.push({
          from: id,
          to: cid,
          type: 'parent-child',
        });
      }
    });

    if (
      member.spouse &&
      visible.has(member.spouse) &&
      id < member.spouse
    ) {
      edges.push({
        from: id,
        to: member.spouse,
        type: 'spouse',
      });
    }
  });

  // ── Remove Duplicate Edges ──────────────────────────────
  const seen = new Set();

  const dedupedEdges = edges.filter(edge => {
    const key = `${edge.type}:${[edge.from, edge.to]
      .sort()
      .join('-')}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });

  return {
    positions,
    edges: dedupedEdges,
    visibleIds: Array.from(visible),
    parentOfFocused,
  };
}