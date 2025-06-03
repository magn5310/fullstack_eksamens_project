import ReviewList from '@/components/Reviews';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ShopRating from '@/components/ui/shopRating';
import { prisma } from '@/lib/prisma'; // Prisma client
import Image from 'next/image';
import Link from 'next/link';

interface RestaurantPageProps {
  params: { slug: string };
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { slug } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug},
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto border-none">
      <Card className="border-none shadow-none">
        <CardHeader>
          
          <CardTitle className="text-3xl text-center">{restaurant.name}</CardTitle>
          <Image className="align-center mx-auto rounded-t-2xl" 
                          src={`/images/kebab.jpg`} // Assuming images are named by slug
                          alt={restaurant.name}
                          width={800}
                          height={250}
                          ></Image>
          <div className="text-sm text-muted-foreground">
            {restaurant.reviews.length} review{restaurant.reviews.length !== 1 ? 's' : ''}
          </div>
        </CardHeader>

        <CardContent>
        <ShopRating 
          rating={avarageRating}
          openHours={restaurant.openHours}
          address={restaurant.address}
          phone={restaurant.phone}
        />
          <span className="text-sm text-muted-foreground mb-2">
            {restaurant.website ? 'Website:' : 'No website available'}

          </span>
          {restaurant.website && (
            <a
              href={restaurant.website}
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline block mb-2"
            >
              
            </a>
          )}

          <p className="text-gray-700 text-lg mb-4">{restaurant.description}</p>
          <div className="flex flex-row items-start mb-4 place-content-evenly">
          {restaurant.address && (
            <p className="text-sm text-muted-foreground mb-2">📍 {restaurant.address}</p>
          )}
          {restaurant.phone && (
            <p className="text-sm text-muted-foreground mb-4">📞 {restaurant.phone}</p>
          )}
          </div>

          <ReviewList reviews={restaurant.reviews} />

          <div className="flex flex-row gap-2 mt-4 align-center justify-center">
          
            <Button asChild variant="secondary" className="s my-4">
            <Link href={restaurant.website || "#"}>Visit Website</Link></Button>
            
          <Button  className="s my-4">Write a review!</Button> 
          </div>
           
        </CardContent>
        
      </Card>
    </div>
  );
}
