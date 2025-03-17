import { GetStaticPaths, GetStaticProps } from 'next';
import { Product } from '@/types/product';
import { getAllProducts, getProductBySlug } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface ProductPageProps {
  product: Product;
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const router = useRouter();


  // Handle fallback loading state (optional)
  if (router.isFallback) {
    return <div>Loading product...</div>;
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
            />
          )}
          <p className="text-gray-700 text-lg">{product.description}</p>
          <div className="mt-4">
            <span className="text-lg">Price: {product.price} DKK</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductPage;

// --------------------
// Static Paths Setup
// --------------------
export const getStaticPaths: GetStaticPaths = async () => {
  const products = await getAllProducts();
  const paths = products.map((product) => ({
    params: { slug: product.slug },
  }));

  console.log("Generated paths:", paths); 

  return { paths, fallback: false };
};


// --------------------
// Static Props Setup
// --------------------
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { notFound: true }; // Correct handling if product is not found
  }

  return {
    props: { product },
  };
};
