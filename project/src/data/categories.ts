import { alphabetData } from './alphabet';
import { animalsData } from './animals';
import { clothesData } from './clothes';
import { colorsData } from './colors';
import { foodData } from './food';
import { numbersData } from './numbers';
import { classroom } from './classroom';
import { Category } from '../types/game';

export const categoryData = {
  animals: animalsData,
  clothes: clothesData,
  alphabet: alphabetData,
  numbers: numbersData,
  colors: colorsData,
  food: foodData,
  classroom: classroom,
};

export type CategoryId = keyof typeof categoryData;

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  itemCount: number;
}

export const categories: CategoryInfo[] = [
  {
    id: 'animals',
    name: 'Animals',
    description: 'Learn the names of animals!',
    icon: '🦓',
    color: 'bg-orange-200',
    image: '/images/animals/starter/tiger-3065741.png',
    itemCount:
      animalsData.starter.length +
      animalsData.mover.length +
      animalsData.flyer.length,
  },
  {
    id: 'clothes',
    name: 'Clothes',
    description: 'Learn the names of clothes!',
    icon: '👕',
    color: 'bg-blue-200',
    image: '/images/clothes/starter/t-shirt.png',
    itemCount:
      clothesData.starter.length +
      clothesData.mover.length +
      clothesData.flyer.length,
  },
  {
    id: 'alphabet',
    name: 'Alphabet',
    description: 'Learn the letters of the alphabet!',
    icon: '🔤',
    color: 'bg-red-200',
    image: '/images/alphabet/a-3479391.png',
    itemCount: alphabetData.starter.length,
  },
  {
    id: 'numbers',
    name: 'Numbers',
    description: 'Learn to count!',
    icon: '🔢',
    color: 'bg-green-200',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%2348bb78"/><text x="50%" y="50%" font-family="Arial" font-size="72" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">123</text></svg>',
    itemCount: numbersData.starter.length,
  },
  {
    id: 'colors',
    name: 'Colors',
    description: 'Learn the names of colors!',
    icon: '🎨',
    color: 'bg-purple-200',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100" height="100" x="20" y="100" fill="%23ff0000"/><rect width="100" height="100" x="150" y="100" fill="%230000ff"/><rect width="100" height="100" x="280" y="100" fill="%2300ff00"/></svg>',
    itemCount: colorsData.starter.length,
  },
  {
    id: 'food',
    name: 'Food',
    description: 'Learn the names of food!',
    icon: '🍕',
    color: 'bg-pink-200',
    image: '/images/foods/starter/pizza-1725716.png',
    itemCount:
      foodData.starter.length + foodData.mover.length + foodData.flyer.length,
  },
  {
    id: 'classroom',
    name: 'Classroom',
    description: 'Learn about items in the classroom!',
    icon: '📚',
    color: 'bg-yellow-200',
    image: '/images/classroom/starter/classroom.png',
    itemCount: classroom.items.length,
  },
];

export function getCategory(
  category: CategoryId
): any {
  const result = categoryData[category];
  return result;
}

export interface CategoryData {
  starter: { id: string; name: string }[];
  mover: { id: string; name: string }[];
  flyer: { id: string; name: string }[];
}