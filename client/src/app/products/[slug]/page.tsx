import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Product } from '@/types/product';
import { getProductBySlug } from '@/lib/api';

interface ProductPageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto my-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{product.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {product.image && (
            <Image
              src={product.image}
              alt={product.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
              width={800}
              height={500}
              priority
            />
          )}
          <p className="text-gray-700 text-lg">{product.description}</p>
          <div className="mt-4">
            <span className="text-lg font-semibold">Price: {product.price} DKK</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
