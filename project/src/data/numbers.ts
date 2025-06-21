// Number quiz data and utilities

export type NumberQuizItem = {
  id: string; // e.g. '23'
  value: number;
  digits: number[]; // e.g. [2,3]
  images: string[]; // e.g. ['/images/numbers/two-3479571.png', '/images/numbers/three-3479580.png']
  word: string; // e.g. 'twenty-three'
  image?: string; // SVG representation
};

const digitMap: { [digit: number]: { name: string; image: string } } = {
  0: { name: 'zero', image: '/images/numbers/zero-3479556.png' },
  1: { name: 'one', image: '/images/numbers/one-3479553.png' },
  2: { name: 'two', image: '/images/numbers/two-3479571.png' },
  3: { name: 'three', image: '/images/numbers/three-3479580.png' },
  4: { name: 'four', image: '/images/numbers/four-3479593.png' },
  5: { name: 'five', image: '/images/numbers/five-3479604.png' },
  6: { name: 'six', image: '/images/numbers/six-3479613.png' },
  7: { name: 'seven', image: '' }, // No image found
  8: { name: 'eight', image: '/images/numbers/eight-3479626.png' },
  9: { name: 'nine', image: '/images/numbers/nine-3479637.png' },
};

// English words for numbers 0-19
const smallNumbers = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];
const tens = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

export function numberToWords(n: number): string {
  if (n < 20) return smallNumbers[n];
  if (n < 100) {
    const ten = Math.floor(n / 10);
    const rest = n % 10;
    return tens[ten] + (rest ? '-' + smallNumbers[rest] : '');
  }
  if (n < 1000) {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    return (
      smallNumbers[hundred] + ' hundred' +
      (rest ? ' ' + numberToWords(rest) : '')
    );
  }
  return n.toString();
}

// Utility to convert number to English word for filenames (0-99)
function numberToWordFilename(n: number): string {
  // 0-20
  const smallNumbers = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'
  ];
  const tens = [
    '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
  ];
  if (n <= 20) return smallNumbers[n];
  if (n < 100) {
    const ten = Math.floor(n / 10);
    const rest = n % 10;
    return tens[ten] + (rest ? '-' + smallNumbers[rest] : '');
  }
  return n.toString();
}

export function getNumberQuizItem(n: number): NumberQuizItem {
  let image = '';
  if (n < 100) {
    const word = numberToWordFilename(n);
    // Find the first file that starts with the word (e.g., 'twenty-one-')
    image = `/images/numbers/${word}-`;
  } else {
    image = `/images/numbers/${n}-`;
  }
  // Since the filenames have a hash, we'll match by prefix in the component
  
  // Generate SVG representation for the number
  const svgImage = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="%232779BD" rx="10" ry="10" /><text x="50%" y="50%" font-family="Arial" font-size="80" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${n}</text></svg>`;
  
  return {
    id: n.toString(),
    value: n,
    digits: n.toString().split('').map(Number),
    images: [image],
    word: numberToWords(n),
    image: svgImage,
  };
}

export function generateRandomNumbers(count: number, digits: number): number[] {
  const min = digits === 1 ? 0 : digits === 2 ? 10 : digits === 3 ? 100 : 1000;
  const max = digits === 1 ? 9 : digits === 2 ? 99 : digits === 3 ? 999 : 9999;
  const set = new Set<number>();
  while (set.size < count) {
    const n = Math.floor(Math.random() * (max - min + 1)) + min;
    set.add(n);
  }
  return Array.from(set);
}

const starterNumbers = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
];

export const numbersData = {
  name: 'Numbers',
  starter: starterNumbers.map(n => {
    const svgImage = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="%232779BD" rx="10" ry="10" /><text x="50%" y="50%" font-family="Arial" font-size="80" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${n}</text></svg>`;
    
    return {
      id: n.toString(),
      name: numberToWords(n),
      image: svgImage
    };
  }),
  mover: [], // Mover numbers can be added here
  flyer: [], // Flyer numbers can be added here
}; 