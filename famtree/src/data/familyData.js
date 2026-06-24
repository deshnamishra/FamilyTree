// src/data/familyData.js

/**
 * FamilyMember shape (for reference — data comes from MongoDB via API):
 * {
 *   id: string,
 *   name: string,
 *   gender: 'male' | 'female' | 'other',
 *   birthYear?: number,
 *   deathYear?: number,
 *   occupation?: string,
 *   parents: string[],
 *   children: string[],
 *   spouse?: string,
 *   linkedTreeId?: string,
 * }
 */

export class FamilyMember {}

/**
 * Builds a Map<id, member> from an array of members fetched from the API.
 */
export function createFamilyMap(members = []) {
  return new Map(members.map(m => [m.id, m]));
}