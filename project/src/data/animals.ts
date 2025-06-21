import { QuizItem, DropZoneData } from '../types/game';
import { CategoryData } from '../types/game';

// Drop zones match the categories used in the animal objects above
export const dropZones: DropZoneData[] = [
  { id: 'pets', label: 'Pets', color: 'from-blue-400 to-cyan-500' },
  { id: 'farm', label: 'Farm', color: 'from-green-400 to-emerald-500' },
  { id: 'wild', label: 'Wild', color: 'from-orange-400 to-red-500' }
];

// Helper function to get display name from image path
const getDisplayName = (imagePath: string) => {
  const fileName = imagePath.split('/').pop() || '';
  const base = fileName.replace(/\.[^/.]+$/, '');
  let displayName = base.replace(/[-_][0-9]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  
  // Special cases
  if (imagePath.includes('parrot') || imagePath.includes('bird')) displayName = 'Bird';
  else if (/stingray/i.test(base)) displayName = 'Stingray';
  else if (/seahorse/i.test(base)) displayName = 'Seahorse';
  else if (/panda-bear/i.test(base) || imagePath.includes('panda')) displayName = 'Panda';
  
  return displayName;
};

// Starter (was easy)
const starterPaths = [
  '/images/animals/starter/starfish-3065740.png',
  '/images/animals/starter/tiger-3065741.png',
  '/images/animals/starter/snake-3065738.png',
  '/images/animals/starter/seal-3065736.png',
  '/images/animals/starter/octopus-3065730.png',
  '/images/animals/starter/lion-3065729.png',
  '/images/animals/starter/kangaroo-3065726.png',
  '/images/animals/starter/fox-3065706.png',
  '/images/animals/starter/giraffe-3065712.png',
  '/images/animals/starter/dolphin-3065698.png',
  '/images/animals/starter/deer-3065695.png',
  '/images/animals/starter/bear-3065687.png',
];

const starter = starterPaths.map(path => ({
  id: path.split('/').pop()?.replace(/\.[^/.]+$/, '') || '',
  name: getDisplayName(path),
  image: path
}));

// Mover (was normal)
const moverPaths = [
  'snail-1449778.png',
  'hedgehog-1864601.png',
  'ostrich-1864590.png',
  'camel-1864582.png',
  'penguin-1864572.png',
  'shark-1864560.png',
  'llama-1864556.png',
  'meerkat-1864550.png',
  'koala-1864527.png',
  'lion-1864511.png',
  'lobster-1864503.png',
  'deer-1864495.png',
  'kiwi-1864492.png',
  'octopus-1864491.png',
  'jellyfish-1864487.png',
  'toucan-1864482.png',
  'squirrel-1864480.png',
  'squid-1864478.png',
  'walrus-1864477.png',
  'snake-1864476.png',
  'whale-1864475.png',
  'bird-1864474.png',
  'frog-1864472.png',
  'seal-1864471.png',
  'elephant-1864469.png',
  'giraffes-2931503.png',
  'frog-2931502.png',
  'elephants-2931501.png',
  'chick-2931500.png',
  'dolphins-2931499.png',
  'raccoon-3065733.png',
  'deer-2931498.png',
  'crocodile-2931497.png',
  'chicken-2931495.png',
  'crab-2931496.png',
  'caterpillar-2931494.png',
  'cat-2931493.png',
  'hedgehog-3065719.png',
  'eagle-3065699.png',
  'bat-3065684.png',
].map(name => `/images/animals/mover/${name}`);

const mover = moverPaths.map(path => ({
  id: path.split('/').pop()?.replace(/\.[^/.]+$/, '') || '',
  name: getDisplayName(path),
  image: path
}));

// Flyer (was hard)
const flyerPaths = [
  'hippopotamus-1864568.png',
  'chameleon-1864575.png',
  'bison-1864564.png',
  'turtle-1864508.png',
  'hermit-crab-1864498.png',
  'rabbit-2931514.png',
  'pig-1864490.png',
  'seahorse-1864489.png',
  'pig-2931513.png',
  'penguin-2931512.png',
  'flamingo-1864479.png',
  'panda-2931511.png',
  'owl-2931510.png',
  'hen-1864470.png',
  'octopus-2931509.png',
  'monkey-2931508.png',
  'mouse-2931507.png',
  'koalas-2931505.png',
  'lobster-2931506.png',
  'goats-2931504.png',
  'leopard-3065727.png',
  'hippopotamus-3065723.png',
  'eel-3751518.png',
  'killer-whale-3751515.png',
  'shark-3751509.png',
  'anemone-3751496.png',
  'slug-3751492.png',
  'sea-cucumber-3751488.png',
  'sea-horse-3751484.png',
  'plankton-3751478.png',
  'lobster-3751449.png',
  'hermit-crab-3751442.png',
  'cuttlefish-3751427.png',
  'jellyfish-3751422.png',
  'octopus-3751415.png',
  'squid-3751401.png',
  'puffer-fish-3751376.png',
  'lion-fish-3751367.png',
  'anglerfish-3751354.png',
  'blobfish-3751344.png',
].map(name => `/images/animals/flyer/${name}`);

const flyer = flyerPaths.map(path => ({
  id: path.split('/').pop()?.replace(/\.[^/.]+$/, '') || '',
  name: getDisplayName(path),
  image: path
}));

export const animalsData = {
  name: 'Animals',
  starter: starter,
  mover: mover,
  flyer: flyer,
};