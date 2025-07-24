// src/data.js
export const projectData = {
  PROJ_001: {
    id: 'PROJ_001',
    type: 'project',
    name: 'Mountain Expedition',
    description: 'A documentary film about a mountain peak ascent.',
    image: 'https://picsum.photos/seed/PROJ_001/400/225', // --- хглемемхе гдеяэ ---
    children: ['SQ_001', 'SQ_002'],
  },
  SQ_001: {
    id: 'SQ_001',
    type: 'sequence',
    name: 'Opening Title Sequence',
    code: 'SQ_001',
    description: 'Main titles over mountain flyby',
    scriptPageStart: 'page 01',
    scriptPageEnd: 'page 06',
    image: 'https://picsum.photos/seed/SQ_001/400/225', // --- хглемемхе гдеяэ ---
    children: ['SC_001', 'SC_002', 'SC_003'],
  },
  SQ_002: {
    id: 'SQ_002',
    type: 'sequence',
    name: 'The Descent',
    code: 'SQ_002',
    description: 'The team begins their dangerous descent.',
    scriptPageStart: 'page 07',
    scriptPageEnd: 'page 12',
    image: 'https://picsum.photos/seed/SQ_002/400/225', // --- хглемемхе гдеяэ ---
    children: ['SC_004'],
  },
  SC_001: {
    id: 'SC_001',
    type: 'scene',
    name: 'Lake Flyover',
    code: 'SC_001',
    description: 'Slow moving helicopter shot over mountain lake',
    pageStart: 1,
    pageEnd: 2,
    pages: 1,
    image: 'https://picsum.photos/seed/SC_001/400/225', // --- хглемемхе гдеяэ ---
    children: ['SHOT_001', 'SHOT_002'],
  },
  SC_002: {
    id: 'SC_002',
    type: 'scene',
    name: 'Yellow Bug flyover',
    code: 'SC_002',
    description: 'Slow moving helicopter shot over mountain road',
    pageStart: 3,
    pageEnd: 4,
    pages: 1,
    image: 'https://picsum.photos/seed/SC_002/400/225', // --- хглемемхе гдеяэ ---
    children: ['SHOT_003'],
  },
  SC_003: {
    id: 'SC_003',
    type: 'scene',
    name: 'Arrive at Overlook',
    code: 'SC_003',
    description: 'Slow moving helicopter shot arriving at Overlook',
    pageStart: 5,
    pageEnd: 6,
    pages: 1,
    image: 'https://picsum.photos/seed/SC_003/400/225', // --- хглемемхе гдеяэ ---
    children: [],
  },
  SC_004: {
    id: 'SC_004',
    type: 'scene',
    name: 'Night Camp',
    code: 'SC_004',
    description: 'The team sets up camp as darkness falls.',
    pageStart: 7,
    pageEnd: 8,
    pages: 2,
    image: 'https://picsum.photos/seed/SC_004/400/225', // --- хглемемхе гдеяэ ---
    children: ['SHOT_004'],
  },
  SHOT_001: {
    id: 'SHOT_001',
    type: 'shot',
    name: 'Helicopter approaches lake',
    code: 'SHOT_001',
    description: 'Wide shot of the lake and mountains.',
    image: 'https://picsum.photos/seed/SHOT_001/400/225', // --- хглемемхе гдеяэ ---
  },
  SHOT_002: {
    id: 'SHOT_002',
    type: 'shot',
    name: 'Close up on water reflection',
    code: 'SHOT_002',
    description: 'The mountain peak reflects perfectly in the water.',
    image: 'https://picsum.photos/seed/SHOT_002/400/225', // --- хглемемхе гдеяэ ---
  },
  SHOT_003: {
    id: 'SHOT_003',
    type: 'shot',
    name: 'Car drives on winding road',
    code: 'SHOT_003',
    description: 'Top-down view of the yellow car.',
    image: 'https://picsum.photos/seed/SHOT_003/400/225', // --- хглемемхе гдеяэ ---
  },
   SHOT_004: {
    id: 'SHOT_004',
    type: 'shot',
    name: 'Setting up tents',
    code: 'SHOT_004',
    description: 'Medium shot of climbers working together.',
    image: 'https://picsum.photos/seed/SHOT_004/400/225', // --- хглемемхе гдеяэ ---
  },
};