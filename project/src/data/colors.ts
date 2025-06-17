// Color data for quiz
// Each item: { id, name, hex }

export const starterColors = [
  { id: 'red', name: 'Red', hex: '#ef4444' },
  { id: 'blue', name: 'Blue', hex: '#3b82f6' },
  { id: 'green', name: 'Green', hex: '#22c55e' },
  { id: 'yellow', name: 'Yellow', hex: '#fde047' },
  { id: 'black', name: 'Black', hex: '#18181b' },
  { id: 'white', name: 'White', hex: '#f4f4f5' },
  { id: 'orange', name: 'Orange', hex: '#fb923c' },
  { id: 'purple', name: 'Purple', hex: '#a21caf' },
  { id: 'pink', name: 'Pink', hex: '#ec4899' },
  { id: 'brown', name: 'Brown', hex: '#92400e' },
  { id: 'gray', name: 'Gray', hex: '#6b7280' },
  { id: 'sky', name: 'Sky', hex: '#38bdf8' },
  { id: 'lime', name: 'Lime', hex: '#a3e635' },
  { id: 'teal', name: 'Teal', hex: '#14b8a6' },
  { id: 'gold', name: 'Gold', hex: '#f59e42' },
  { id: 'silver', name: 'Silver', hex: '#a1a1aa' },
  { id: 'beige', name: 'Beige', hex: '#f5f5dc' },
  { id: 'navy', name: 'Navy', hex: '#1e293b' },
  { id: 'olive', name: 'Olive', hex: '#a3a33c' },
  { id: 'violet', name: 'Violet', hex: '#8b5cf6' },
];

export const moverColors = [
  { id: 'maroon', name: 'Maroon', hex: '#7f1d1d' },
  { id: 'cyan', name: 'Cyan', hex: '#06b6d4' },
  { id: 'indigo', name: 'Indigo', hex: '#6366f1' },
  { id: 'magenta', name: 'Magenta', hex: '#d946ef' },
  { id: 'peach', name: 'Peach', hex: '#fed7aa' },
  { id: 'mint', name: 'Mint', hex: '#bbf7d0' },
  { id: 'coral', name: 'Coral', hex: '#fb7185' },
  { id: 'salmon', name: 'Salmon', hex: '#fca5a5' },
  { id: 'amber', name: 'Amber', hex: '#fbbf24' },
  { id: 'lavender', name: 'Lavender', hex: '#e9d5ff' },
  { id: 'chartreuse', name: 'Chartreuse', hex: '#d9f99d' },
  { id: 'turquoise', name: 'Turquoise', hex: '#2dd4bf' },
  { id: 'plum', name: 'Plum', hex: '#a21caf' },
  { id: 'apricot', name: 'Apricot', hex: '#fbceb1' },
  { id: 'mustard', name: 'Mustard', hex: '#e1ad01' },
  { id: 'rose', name: 'Rose', hex: '#f43f5e' },
  { id: 'aqua', name: 'Aqua', hex: '#67e8f9' },
  { id: 'tan', name: 'Tan', hex: '#d2b48c' },
  { id: 'khaki', name: 'Khaki', hex: '#f0e68c' },
  { id: 'azure', name: 'Azure', hex: '#60a5fa' },
];

export const flyerColors = [
  { id: 'cerulean', name: 'Cerulean', hex: '#3cb9fc' },
  { id: 'periwinkle', name: 'Periwinkle', hex: '#a5b4fc' },
  { id: 'mulberry', name: 'Mulberry', hex: '#70193d' },
  { id: 'fuchsia', name: 'Fuchsia', hex: '#e879f9' },
  { id: 'ruby', name: 'Ruby', hex: '#e0115f' },
  { id: 'jade', name: 'Jade', hex: '#00a86b' },
  { id: 'sapphire', name: 'Sapphire', hex: '#0f52ba' },
  { id: 'emerald', name: 'Emerald', hex: '#50c878' },
  { id: 'amethyst', name: 'Amethyst', hex: '#9966cc' },
  { id: 'sand', name: 'Sand', hex: '#f4e2d8' },
  { id: 'ochre', name: 'Ochre', hex: '#cc7722' },
  { id: 'mauve', name: 'Mauve', hex: '#e0b0ff' },
  { id: 'copper', name: 'Copper', hex: '#b87333' },
  { id: 'bronze', name: 'Bronze', hex: '#cd7f32' },
  { id: 'charcoal', name: 'Charcoal', hex: '#36454f' },
  { id: 'eggplant', name: 'Eggplant', hex: '#614051' },
  { id: 'raspberry', name: 'Raspberry', hex: '#e30b5d' },
  { id: 'seafoam', name: 'Seafoam', hex: '#93e9be' },
  { id: 'blush', name: 'Blush', hex: '#f9c0c4' },
  { id: 'ivory', name: 'Ivory', hex: '#fffff0' },
];

export const moverSet = [...starterColors, ...moverColors];
export const flyerSet = [...starterColors, ...moverColors, ...flyerColors]; 