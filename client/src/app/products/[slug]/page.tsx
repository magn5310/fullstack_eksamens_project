import ReviewList from '@/components/Reviews';
import ReviewSection from '@/components/ReviewSection';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ShopRating from '@/components/ui/shopRating';
import { prisma } from '@/lib/prisma'; // Prisma client
import { faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

interface RestaurantPageProps {
  params: Promise<{ slug: string }>;
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { slug } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug},
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
        include:{
          author: true,
        },
      },
    },
  });

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  const averageRating =
  restaurant.reviews.reduce((acc, review) => {
    const reviewAverage =
      (review.tasteScore + review.serviceScore + review.priceScore) / 3;
    return acc + reviewAverage;
  }, 0) / restaurant.reviews.length || 0;

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
          rating={averageRating}
          openHours={restaurant.openHours}
          address={restaurant.address}
          phone={restaurant.phone}
        />

          
          {restaurant.website && (
            <a
              href={restaurant.website}
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline block mb-2"
            >
              
            </a>
          )}

          <p className="text-gray-700 text-lg mb-4">{restaurant.description}</p>
          <div className="flex flex-row items-start mb-4 justify-evenly">
          {restaurant.address && (
            <>
              <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faLocationDot} className="w-4 mr-2" style={{color:"#000000",}} />
                <span className="text-sm text-muted-foreground">{restaurant.address}</span>
              </div>
            </>
          )}
          {restaurant.phone && (
            <>
              <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faPhone} className="w-4 mr-2" style={{color:"#000000",}} />
                <p className="text-sm text-muted-foreground"> {restaurant.phone}</p>
              </div>
            </>
          )}
          </div>

          <ReviewList reviews={restaurant.reviews.map(r => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
            author: {
              ...r.author,
              createdAt: r.author.createdAt.toISOString(),
              updatedAt: r.author.updatedAt.toISOString(),
            }
          }))} />

          
          
            <div className="flex flex-col items-center">
              <ReviewSection restaurantId={restaurant.id} />
            </div>
          
          
          
           
        </CardContent>
        
      </Card>
    </div>
  );
}
