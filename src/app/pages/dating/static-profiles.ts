export interface DevProfile {
  id: number;
  name: string;
  age: number;
  bio: string;
  stack: string[];
  image: string;
}

export const STATIC_PROFILES: DevProfile[] = [
  {
    id: 1,
    name: 'Lika',
    age: 27,
    bio: 'Frontend enthusiast. Loves Tailwind & Typescript.',
    stack: ['Angular', 'Tailwind'],
    image: '/profiles/lika.jpeg',
  },
  {
    id: 2,
    name: 'Giorgi',
    age: 30,
    bio: 'Backend wizard. Writes poetry in C#.',
    stack: ['.NET', 'PostgreSQL'],
    image: '/profiles/giorgi.webp',
  },
  {
    id: 3,
    name: 'Nino',
    age: 25,
    bio: 'Machine learning & coffee addict.',
    stack: ['Python', 'TensorFlow'],
    image: '/profiles/nino.webp',
  },
];
