import { Category } from '../types/game';

const imagePath = (filename: string) => `/images/classroom/starter/${filename}`;

export const classroom: Category = {
  id: '2707833278050608251',
  name: 'Classroom',
  isVocalized: true,
  items: [
    { name: 'student', image: imagePath('student.png') },
    { name: 'teacher', image: imagePath('teacher.png') },
    { name: 'desk', image: imagePath('desk.png') },
    { name: 'chair', image: imagePath('chair.png') },
    { name: 'pencil', image: imagePath('pencil.png') },
    { name: 'eraser', image: imagePath('eraser.png') },
    { name: 'notebook', image: imagePath('notebook.png') },
    { name: 'book', image: imagePath('book.png') },
    { name: 'whiteboard', image: imagePath('whiteboard.png') },
    { name: 'school bell', image: imagePath('bell.png') },
    { name: 'backpack', image: imagePath('backpack.png') },
  ],
};