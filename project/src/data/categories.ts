export interface CategoryData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sets: any[][];
  dropZones: any[];
}

// We'll expand this with more categories later
export const categories = {
  animals: {
    id: 'animals',
    name: 'Animals',
    description: 'Learn about different animals and their categories',
    icon: '🐾',
    color: 'from-green-400 to-emerald-500',
    image: 'https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    itemCount: 48
  },
  colors: {
    id: 'colors',
    name: 'Colors',
    description: 'Match objects with their colors',
    icon: '🎨',
    color: 'from-pink-400 to-rose-500',
    image: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    itemCount: 36
  },
  alphabet: {
    id: 'alphabet',
    name: 'Alphabet',
    description: 'Learn and match the English alphabet',
    icon: '🔤',
    color: 'from-yellow-400 to-orange-500',
    image: 'https://images.pexels.com/photos/256369/pexels-photo-256369.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    itemCount: 26
  },
  numbers: {
    id: 'numbers',
    name: 'Numbers',
    description: 'Match numbers to their English words',
    icon: '🔢',
    color: 'from-blue-400 to-indigo-500',
    image: 'https://images.pexels.com/photos/207569/pexels-photo-207569.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    itemCount: 27
  }
};