// src/api/familyService.js
import { familyTrees } from '../data/familyTrees';

export const getFamilyTree = async (treeId) => {
  // In a real app, this would be an API call
  return familyTrees.find(tree => tree.id === treeId) || familyTrees[0];
};

export const getPersonDetails = async (personId) => {
  // Implementation would fetch person details
};