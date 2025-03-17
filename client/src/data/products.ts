// src/data/products.ts
import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 1,
    title: 'Torvets',
    description: 'The best kebab in town with fresh ingredients and homemade bread.',
    price: 89,
    slug: 'torvets',
    image: '/images/kebab.jpg', // Make sure this image exists in /public/images/
  },
  // You can add more products later...
];
