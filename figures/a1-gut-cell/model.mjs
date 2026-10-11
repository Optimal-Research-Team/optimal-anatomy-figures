// A1 model: the gut cell's iron gate, using Fig 3's hepcidin model so the two figures agree.
// gate = 1 / (1 + hepcidin) is the share of ferroportin left working at the cell's base.
// [n] keys refer to reference/truth-pack.md §3.

export const SLOTS = 5; //  ferroportin places drawn on the base (a drawing choice, not a count)
/** Working ferroportins for a gate share (rounded; at least one, since a closed gate is never total). */
export const activeOf = (gate) => Math.max(1, Math.round(SLOTS * gate));
/** Hepcidin for a gate share (the inverse of gate = 1 / (1 + H)). */
export const hepcidinOf = (gate) => 1 / gate - 1;
