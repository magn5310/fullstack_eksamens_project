// src/data/products.ts
import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 1,
    title: 'Red Sports Shoes',
    description: 'High-quality red running shoes for daily workouts.',
    price: 79.99,
    slug: 'red-sports-shoes',
    image: '/images/red-shoes.jpg', // Place this in /public/images
  },
  {
    id: 2,
    title: 'Blue Hoodie',
    description: 'Cozy and stylish blue hoodie for everyday wear.',
    price: 49.99,
    slug: 'blue-hoodie',
    image: '/images/blue-hoodie.jpg',
  },
  {
    id: 3,
    title: 'Black Backpack',
    description: 'Durable backpack perfect for work and travel.',
    price: 99.99,
    slug: 'black-backpack',
    image: '/images/black-backpack.jpg',
  },
];
