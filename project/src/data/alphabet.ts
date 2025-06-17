// Alphabet data for quiz
// Each item: { id, name, image }

const alphabetFilenames = [
  'a-3479391.png', 'b-3479395.png', 'c-3479400.png', 'd-3479404.png', 'e-3479407.png',
  'f-3479411.png', 'g-3479417.png', 'h-3479423.png', 'i-3479430.png', 'j-3479435.png',
  'k-3479437.png', 'l-3479440.png', 'm-3479449.png', 'n-3479454.png', 'o-3479461.png',
  'p-3479469.png', 'q-3479477.png', 'r-3479484.png', 's-3479488.png', 't-3479499.png',
  'u-3479505.png', 'v-3479509.png', 'w-3479513.png', 'x-3479519.png', 'y-3479525.png',
  'z-3479532.png'
];

export const alphabetItems = alphabetFilenames.map(filename => {
  const letter = filename[0];
  return {
    id: letter,
    name: letter,
    image: `/images/alphabet/${filename}`
  };
}); 