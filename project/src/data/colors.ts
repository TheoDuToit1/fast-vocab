// Color data for quiz
// Each item: { id, name, hex }

export const starterColors = [
  { id: 'red', name: 'Red', hex: '#FF0000' },
  { id: 'blue', name: 'Blue', hex: '#0000FF' },
  { id: 'green', name: 'Green', hex: '#00FF00' },
  { id: 'yellow', name: 'Yellow', hex: '#FFFF00' },
  { id: 'orange', name: 'Orange', hex: '#FFA500' },
  { id: 'purple', name: 'Purple', hex: '#800080' },
  { id: 'pink', name: 'Pink', hex: '#FFC0CB' },
  { id: 'brown', name: 'Brown', hex: '#A52A2A' },
  { id: 'black', name: 'Black', hex: '#000000' },
  { id: 'white', name: 'White', hex: '#FFFFFF' },
  { id: 'gray', name: 'Gray', hex: '#808080' },
  { id: 'gold', name: 'Gold', hex: '#FFD700' },
];

export const moverColors = [
  { id: 'cyan', name: 'Cyan', hex: '#00FFFF' },
  { id: 'magenta', name: 'Magenta', hex: '#FF00FF' },
  { id: 'lime', name: 'Lime', hex: '#32CD32' },
  { id: 'teal', name: 'Teal', hex: '#008080' },
  { id: 'navy', name: 'Navy', hex: '#000080' },
  { id: 'coral', name: 'Coral', hex: '#FF7F50' },
  { id: 'maroon', name: 'Maroon', hex: '#800000' },
  { id: 'olive', name: 'Olive', hex: '#808000' },
  { id: 'silver', name: 'Silver', hex: '#C0C0C0' },
  { id: 'violet', name: 'Violet', hex: '#EE82EE' },
  { id: 'khaki', name: 'Khaki', hex: '#F0E68C' },
  { id: 'salmon', name: 'Salmon', hex: '#FA8072' },
];

export const flyerColors = [
  { id: 'crimson', name: 'Crimson', hex: '#DC143C' },
  { id: 'indigo', name: 'Indigo', hex: '#4B0082' },
  { id: 'beige', name: 'Beige', hex: '#F5F5DC' },
  { id: 'azure', name: 'Azure', hex: '#007FFF' },
  { id: 'emerald', name: 'Emerald', hex: '#50C878' },
  { id: 'ruby', name: 'Ruby', hex: '#E0115F' },
  { id: 'jade', name: 'Jade', hex: '#00A86B' },
  { id: 'amber', name: 'Amber', hex: '#FFBF00' },
  { id: 'plum', name: 'Plum', hex: '#DDA0DD' },
  { id: 'bronze', name: 'Bronze', hex: '#CD7F32' },
  { id: 'ivory', name: 'Ivory', hex: '#FFFFF0' },
  { id: 'cobalt', name: 'Cobalt', hex: '#0047AB' },
];

export const colorsData = {
  name: 'Colors',
  starter: starterColors,
  mover: moverColors,
  flyer: flyerColors,
};

// Debug log
console.log('colorsData:', colorsData); 