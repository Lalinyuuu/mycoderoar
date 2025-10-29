/**
 * Predefined Tags Constants
 * Contains all available tags that can be selected from dropdown
 */

export const AVAILABLE_TAGS = [
  // Game Categories
  'base',
  'survival',
  'pvp',
  'pve',
  'events',
  'guides',
  'tips',
  'reviews',
  
  // Game Types
  'mmorpg',
  'sandbox',
  'adventure',
  'action',
  'strategy',
  'simulation',
  
  // Content Types
  'news',
  'updates',
  'community',
  'tournament',
  'patch',
  'feature',
  
  // Difficulty Levels
  'beginner',
  'intermediate',
  'advanced',
  'expert',
  
  // Game Elements
  'building',
  'combat',
  'exploration',
  'crafting',
  'trading',
  'guild',
  'clan',
  'alliance'
];

export const TAG_CATEGORIES = {
  GAME_CATEGORIES: [
    'base',
    'survival',
    'pvp',
    'pve',
    'events'
  ],
  CONTENT_TYPES: [
    'guides',
    'tips',
    'reviews',
    'news',
    'updates',
    'community'
  ],
  GAME_TYPES: [
    'mmorpg',
    'sandbox',
    'adventure',
    'action',
    'strategy',
    'simulation'
  ],
  DIFFICULTY: [
    'beginner',
    'intermediate',
    'advanced',
    'expert'
  ],
  GAME_ELEMENTS: [
    'building',
    'combat',
    'exploration',
    'crafting',
    'trading',
    'guild',
    'clan',
    'alliance'
  ]
};

export const TAG_COLORS = {
  // Game Categories - Purple theme
  'base': 'bg-purple-1 purple-8',
  'survival': 'bg-purple-1 purple-8',
  'pvp': 'bg-purple-1 purple-8',
  'pve': 'bg-purple-1 purple-8',
  'events': 'bg-purple-2 purple-9',
  
  // Content Types - Blue theme
  'guides': 'bg-purple-6 purple-6',
  'tips': 'bg-purple-6 purple-6',
  'reviews': 'bg-purple-6 purple-6',
  'news': 'bg-purple-6 purple-6',
  'updates': 'bg-purple-6 purple-6',
  'community': 'bg-purple-6 purple-6',
  
  // Game Types - Green theme
  'mmorpg': 'bg-success success',
  'sandbox': 'bg-success success',
  'adventure': 'bg-success success',
  'action': 'bg-success success',
  'strategy': 'bg-success success',
  'simulation': 'bg-success success',
  
  // Difficulty - Orange theme
  'beginner': 'bg-success success',
  'intermediate': 'bg-yellow-1 yellow-8',
  'advanced': 'bg-yellow-1 yellow-8',
  'expert': 'bg-error error',
  
  // Game Elements - Gray theme
  'building': 'bg-gray-1 gray-8',
  'combat': 'bg-error error',
  'exploration': 'bg-gray-1 gray-8',
  'crafting': 'bg-gray-1 gray-8',
  'trading': 'bg-gray-1 gray-8',
  'guild': 'bg-gray-1 gray-8',
  'clan': 'bg-gray-1 gray-8',
  'alliance': 'bg-gray-1 gray-8'
};

export const getTagColor = (tag) => {
  return TAG_COLORS[tag] || 'bg-gray-1 gray-6';
};

export const formatTag = (tag) => {
  // Remove # if it exists and add it back
  const cleanTag = tag.replace(/^#/, '');
  return `#${cleanTag}`;
};

export const parseTagsFromString = (tagsString) => {
  if (!tagsString) return [];
  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag)
    .map(tag => tag.replace(/^#/, '')); // Remove # if exists
};

export const tagsToString = (tagsArray) => {
  if (!tagsArray || !Array.isArray(tagsArray)) return '';
  return tagsArray.join(', ');
};
