/**
 * seed.js — Populate MongoDB with a sample "Vance Family" tree.
 * Run: node seed.js (from the family-tree-backend directory)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const FamilyMember = require('./models/FamilyMember');
const FamilyTree = require('./models/familyTree');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/familytree';

const MEMBERS = [
    { localId: 'ggp1', name: 'Arthur Vance', gender: 'male', birthYear: 1880, deathYear: 1955, occupation: 'Industrialist', partnerLocal: 'ggm1', childrenLocal: ['gp1'], parentsLocal: [], photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Arthur&backgroundColor=b6e3f4' },
    { localId: 'ggm1', name: 'Eleanor Faye', gender: 'female', birthYear: 1884, deathYear: 1960, occupation: 'Philanthropist', partnerLocal: 'ggp1', childrenLocal: ['gp1'], parentsLocal: [], photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Eleanor&backgroundColor=ffdfbf' },
    { localId: 'gp1', name: 'George Vance', gender: 'male', birthYear: 1910, deathYear: 1988, occupation: 'Banker', partnerLocal: 'gm1', childrenLocal: ['p1', 'p3'], parentsLocal: ['ggp1', 'ggm1'], photo: 'https://api.dicebear.com/7.x/personas/svg?seed=George&backgroundColor=b6e3f4' },
    { localId: 'gm1', name: 'Mary Anne', gender: 'female', birthYear: 1915, deathYear: 1992, occupation: 'Librarian', partnerLocal: 'gp1', childrenLocal: ['p1', 'p3'], parentsLocal: [], photo: 'https://api.dicebear.com/7.x/personas/svg?seed=MaryAnne&backgroundColor=ffdfbf' },
    { localId: 'p1', name: 'John Vance', gender: 'male', birthYear: 1945, deathYear: 2018, occupation: 'Professor', partnerLocal: 'p2', childrenLocal: ['c1', 'c2'], parentsLocal: ['gp1', 'gm1'], photo: 'https://api.dicebear.com/7.x/personas/svg?seed=John&backgroundColor=b6e3f4' },
    { localId: 'p2', name: 'Kate Shaw', gender: 'female', birthYear: 1948, deathYear: null, occupation: 'Doctor', partnerLocal: 'p1', childrenLocal: ['c1', 'c2'], parentsLocal: [], photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Kate&backgroundColor=ffdfbf' },
    { localId: 'p3', name: 'Peter Vance', gender: 'male', birthYear: 1948, deathYear: null, occupation: 'Engineer', partnerLocal: 'p4', childrenLocal: ['c3'], parentsLocal: ['gp1', 'gm1'], photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Peter&backgroundColor=b6e3f4' },
    { localId: 'p4', name: 'Susan Hill', gender: 'female', birthYear: 1950, deathYear: null, occupation: 'Journalist', partnerLocal: 'p3', childrenLocal: ['c3'], parentsLocal: [], photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Susan&backgroundColor=ffdfbf' },
    { localId: 'c1', name: 'Michael Vance', gender: 'male', birthYear: 1975, deathYear: null, occupation: 'Software Developer', partnerLocal: 'c4', childrenLocal: ['gc1', 'gc2'], parentsLocal: ['p1', 'p2'], photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Michael&backgroundColor=b6e3f4' },
    { localId: 'c2', name: 'Jane Vance', gender: 'female', birthYear: 1978, deathYear: null, occupation: 'Graphic Designer', partnerLocal: 'c5', childrenLocal: [], parentsLocal: ['p1', 'p2'], photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Jane&backgroundColor=ffdfbf' },
    { localId: 'c3', name: 'Chris Vance', gender: 'male', birthYear: 1980, deathYear: null, occupation: 'Lawyer', partnerLocal: null, childrenLocal: [], parentsLocal: ['p3', 'p4'], photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Chris&backgroundColor=b6e3f4' },
    { localId: 'c4', name: 'Olivia Chen', gender: 'female', birthYear: 1977, deathYear: null, occupation: 'Marketing Manager', partnerLocal: 'c1', childrenLocal: ['gc1', 'gc2'], parentsLocal: [], photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Olivia&backgroundColor=ffdfbf' },
    { localId: 'c5', name: 'Daniel Ross', gender: 'male', birthYear: 1976, deathYear: null, occupation: 'Photographer', partnerLocal: 'c2', childrenLocal: [], parentsLocal: [], photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Daniel&backgroundColor=b6e3f4' },
    { localId: 'gc1', name: 'Leo Vance', gender: 'male', birthYear: 2003, deathYear: null, occupation: 'Student', partnerLocal: null, childrenLocal: [], parentsLocal: ['c1', 'c4'], photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Leo&backgroundColor=b6e3f4' },
    { localId: 'gc2', name: 'Mia Vance', gender: 'female', birthYear: 2006, deathYear: null, occupation: 'Student', partnerLocal: null, childrenLocal: [], parentsLocal: ['c1', 'c4'], photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Mia&backgroundColor=ffdfbf' },
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        await FamilyMember.deleteMany({});
        await FamilyTree.deleteMany({});
        console.log('Cleared existing data');

        // Create a FamilyTree first
        const tree = await FamilyTree.create({ name: 'Vance Family', description: 'The Vance family spanning 5 generations' });
        console.log(`Created tree: ${tree.name} (${tree._id})`);

        // Phase 1: Create members linked to this tree
        const idMap = new Map();
        for (const m of MEMBERS) {
            const doc = await FamilyMember.create({
                treeId: tree._id,
                name: m.name, gender: m.gender, birthYear: m.birthYear,
                deathYear: m.deathYear, occupation: m.occupation, photo: m.photo,
            });
            idMap.set(m.localId, doc._id);
            console.log(`  Created: ${m.name} -> ${doc._id}`);
        }

        // Phase 2: Wire relationships
        for (const m of MEMBERS) {
            const updates = {};
            if (m.partnerLocal && idMap.has(m.partnerLocal)) updates.partner = idMap.get(m.partnerLocal);
            if (m.parentsLocal.length > 0) updates.parents = m.parentsLocal.filter(p => idMap.has(p)).map(p => idMap.get(p));
            if (m.childrenLocal.length > 0) updates.children = m.childrenLocal.filter(c => idMap.has(c)).map(c => idMap.get(c));
            if (Object.keys(updates).length > 0) await FamilyMember.findByIdAndUpdate(idMap.get(m.localId), updates);
        }

        console.log(`\n✅ Seeded tree "${tree.name}" with ${MEMBERS.length} members!`);
        console.log(`   Tree ID: ${tree._id}`);
        await mongoose.disconnect();
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
