// Multi-generation family data with photos via dicebear avatars
export const familyTrees = [
  // Great Grandparents
  {
    id: 'ggp1', name: 'Arthur Vance', gender: 'male', birthYear: 1880, deathYear: 1955,
    occupation: 'Industrialist', spouse: 'ggm1', children: ['gp1'], parents: [],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Arthur&backgroundColor=b6e3f4'
  },
  {
    id: 'ggm1', name: 'Eleanor Faye', gender: 'female', birthYear: 1884, deathYear: 1960,
    occupation: 'Philanthropist', spouse: 'ggp1', children: ['gp1'], parents: [],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Eleanor&backgroundColor=ffdfbf'
  },
  {
    id: 'ggp2', name: 'Harold Moore', gender: 'male', birthYear: 1882, deathYear: 1950,
    occupation: 'Farmer', spouse: 'ggm2', children: ['gp3'], parents: [],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Harold&backgroundColor=c0aede'
  },
  {
    id: 'ggm2', name: 'Beatrice Moore', gender: 'female', birthYear: 1886, deathYear: 1958,
    occupation: 'Seamstress', spouse: 'ggp2', children: ['gp3'], parents: [],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Beatrice&backgroundColor=d1f4d1'
  },

  // Grandparents
  {
    id: 'gp1', name: 'George Vance', gender: 'male', birthYear: 1910, deathYear: 1988,
    occupation: 'Banker', parents: ['ggp1', 'ggm1'], spouse: 'gm1', children: ['p1', 'p3'],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=George&backgroundColor=b6e3f4'
  },
  {
    id: 'gm1', name: 'Mary Anne', gender: 'female', birthYear: 1915, deathYear: 1992,
    occupation: 'Librarian', parents: [], spouse: 'gp1', children: ['p1', 'p3'],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=MaryAnne&backgroundColor=ffdfbf'
  },
  {
    id: 'gp2', name: 'Henry Shaw', gender: 'male', birthYear: 1912, deathYear: 1975,
    occupation: 'Architect', parents: [], spouse: 'gm2', children: ['p2'],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Henry&backgroundColor=c0aede'
  },
  {
    id: 'gm2', name: 'Clara Belle', gender: 'female', birthYear: 1918, deathYear: 2001,
    occupation: 'Artist', parents: [], spouse: 'gp2', children: ['p2'],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Clara&backgroundColor=d1f4d1'
  },
  {
    id: 'gp3', name: 'Robert Hill', gender: 'male', birthYear: 1916, deathYear: 1980,
    occupation: 'Teacher', parents: ['ggp2', 'ggm2'], spouse: 'gm3', children: ['p4'],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Robert&backgroundColor=b6e3f4'
  },
  {
    id: 'gm3', name: 'Dorothy Hill', gender: 'female', birthYear: 1920, deathYear: 1998,
    occupation: 'Nurse', parents: [], spouse: 'gp3', children: ['p4'],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Dorothy&backgroundColor=ffdfbf'
  },

  // Parents Generation
  {
    id: 'p1', name: 'John Vance', gender: 'male', birthYear: 1945, deathYear: 2018,
    occupation: 'Professor', parents: ['gp1', 'gm1'], spouse: 'p2', children: ['c1', 'c2'],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=John&backgroundColor=b6e3f4'
  },
  {
    id: 'p2', name: 'Kate Shaw', gender: 'female', birthYear: 1948,
    occupation: 'Doctor', parents: ['gp2', 'gm2'], spouse: 'p1', children: ['c1', 'c2'],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Kate&backgroundColor=ffdfbf'
  },
  {
    id: 'p3', name: 'Peter Vance', gender: 'male', birthYear: 1948,
    occupation: 'Engineer', parents: ['gp1', 'gm1'], spouse: 'p4', children: ['c3'],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Peter&backgroundColor=b6e3f4'
  },
  {
    id: 'p4', name: 'Susan Hill', gender: 'female', birthYear: 1950,
    occupation: 'Journalist', parents: ['gp3', 'gm3'], spouse: 'p3', children: ['c3'],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Susan&backgroundColor=ffdfbf'
  },

  // Central Generation
  {
    id: 'c1', name: 'Michael Vance', gender: 'male', birthYear: 1975,
    occupation: 'Software Developer', parents: ['p1', 'p2'], spouse: 'c4', children: ['gc1', 'gc2'],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Michael&backgroundColor=b6e3f4'
  },
  {
    id: 'c2', name: 'Jane Vance', gender: 'female', birthYear: 1978,
    occupation: 'Graphic Designer', parents: ['p1', 'p2'], spouse: 'c5', children: [],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Jane&backgroundColor=ffdfbf'
  },
  {
    id: 'c3', name: 'Chris Vance', gender: 'male', birthYear: 1980,
    occupation: 'Lawyer', parents: ['p3', 'p4'], spouse: null, children: [],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Chris&backgroundColor=b6e3f4'
  },
  {
    id: 'c4', name: 'Olivia Chen', gender: 'female', birthYear: 1977,
    occupation: 'Marketing Manager', parents: [], spouse: 'c1', children: ['gc1', 'gc2'],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Olivia&backgroundColor=ffdfbf'
  },
  {
    id: 'c5', name: 'Daniel Ross', gender: 'male', birthYear: 1976,
    occupation: 'Photographer', parents: [], spouse: 'c2', children: [],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Daniel&backgroundColor=b6e3f4'
  },

  // Grandchildren
  {
    id: 'gc1', name: 'Leo Vance', gender: 'male', birthYear: 2003,
    occupation: 'Student', parents: ['c1', 'c4'], spouse: null, children: [],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Leo&backgroundColor=b6e3f4'
  },
  {
    id: 'gc2', name: 'Mia Vance', gender: 'female', birthYear: 2006,
    occupation: 'Student', parents: ['c1', 'c4'], spouse: null, children: [],
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=Mia&backgroundColor=ffdfbf'
  },
];

export const createFamilyMap = (familyArray) =>
  new Map(familyArray.map(person => [person.id, person]));

export const getPerson = (map, id) => map.get(id) || null;

export const getParents = (person, map) =>
  (person?.parents || []).map(id => map.get(id)).filter(Boolean);

export const getChildren = (person, map) =>
  (person?.children || []).map(id => map.get(id)).filter(Boolean);

export const getSpouse = (person, map) =>
  person?.spouse ? map.get(person.spouse) || null : null;

export const getGrandparents = (person, map) => {
  const parents = getParents(person, map);
  return parents.flatMap(p => getParents(p, map));
};