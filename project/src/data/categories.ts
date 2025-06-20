import { numbersData } from './numbers';
import { clothesData } from './clothes';
import { alphabetData } from './alphabet';
import { colorsData } from './colors';
import { animalsData } from './animals';
import { foodData } from './food';

export interface CategoryData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sets: any[][];
  dropZones: any[];
  numbers: numbersData;
  clothes: clothesData;
  food: foodData;
}

interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  itemCount: number;
}

const categoryData = {
  animals: animalsData,
  colors: colorsData,
  alphabet: alphabetData,
  numbers: numbersData,
  clothes: clothesData,
  food: foodData,
};

export const categories: Record<string, CategoryInfo> = {
  animals: {
    id: 'animals',
    name: 'Animals',
    description: 'Learn about different animals and their categories',
    icon: '🐾',
    color: 'from-green-400 to-emerald-500',
    image: 'https://wallpapers.com/images/featured/cute-animal-anime-e5b9oin5itw8sczg.jpg',
    itemCount: categoryData.animals.starter.length + categoryData.animals.mover.length + categoryData.animals.flyer.length,
  },
  colors: {
    id: 'colors',
    name: 'Colors',
    description: 'Match objects with their colors',
    icon: '🎨',
    color: 'from-pink-400 to-rose-500',
    image: 'https://play-lh.googleusercontent.com/3V6kJrho6qWXnWAW1n99ET-1KAlU9V9DnHHACN-Ec6ItbAKCy2vt0kTS8xkIkCDdkA=w526-h296-rw',
    itemCount: categoryData.colors.starter.length + categoryData.colors.mover.length + categoryData.colors.flyer.length,
  },
  alphabet: {
    id: 'alphabet',
    name: 'Alphabet',
    description: 'Learn and match the English alphabet',
    icon: '🔤',
    color: 'from-yellow-400 to-orange-500',
    image: 'https://cdn.pixabay.com/video/2017/01/26/7529-201118756_tiny.jpg',
    itemCount: categoryData.alphabet.starter.length,
  },
  numbers: {
    id: 'numbers',
    name: 'Numbers',
    description: 'Match numbers to their English words',
    icon: '🔢',
    color: 'from-blue-400 to-indigo-500',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMI3Njzx2NMY8pZZpRdsEtOuP8jVz_JtVjbA&s',
    itemCount: categoryData.numbers.starter.length,
  },
  clothes: {
    id: 'clothes',
    name: 'Clothes',
    description: 'Explore different types of clothing',
    icon: '👕',
    color: 'from-purple-400 to-violet-500',
    image: 'https://www.animestreetstyle.com/cdn/shop/files/Untitled_design_36_1.png?v=1689344413',
    itemCount: categoryData.clothes.starter.length + categoryData.clothes.mover.length + categoryData.clothes.flyer.length,
  },
  food: {
    id: 'food',
    name: 'Food',
    description: 'Learn about different kinds of food',
    icon: '🍔',
    color: 'from-red-400 to-yellow-500',
    image: 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2023/08/f3.jpg',
    itemCount: foodData.starter.length + foodData.mover.length + foodData.flyer.length,
  },
};

export function getCategoryData(category: string) {
  return categoryData[category as keyof typeof categoryData];
}