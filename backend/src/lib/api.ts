import { products } from "@/data/products";
import { Product } from "@/types/product";

export async function getAllProducts(): Promise<Product[]> {
    return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
    return products.find((product) => product.slug === slug);
}

