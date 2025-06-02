import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { prisma } from '@/lib/prisma'; // Prisma client
import Image from 'next/image';

interface RestaurantPageProps {
  params: { slug: string };
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: params.slug },
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
        <span id="ratings">
          <span className="text-yellow-500">
            ⭐ {restaurant.reviews.reduce((acc, review) => acc + review.rating, 0) / restaurant.reviews.length || 0} / 5
          </span>
          <div className="openingHours">
            <span className="text-sm text-muted-foreground">
              {restaurant.openingHours || 'Opening hours not available'}
            </span>
          </div>
          <div className="website">
            <span className="text-sm text-muted-foreground">
              {restaurant.website ? `Website: ${restaurant.website}` : 'No website available'}
            </span>
          </div>

          </span>
          {restaurant.website && (
            <a
              href={restaurant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline block mb-2"
            >
              
            </a>
          )}

          <p className="text-gray-700 text-lg mb-4">{restaurant.description}</p>
          {restaurant.address && (
            <p className="text-sm text-muted-foreground mb-2">📍 {restaurant.address}</p>
          )}
          {restaurant.phone && (
            <p className="text-sm text-muted-foreground mb-4">📞 {restaurant.phone}</p>
          )}

          <h3 className="text-xl font-semibold mb-2">Reviews</h3>
          {restaurant.reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
          ) : (
            <ul className="space-y-2">
              {restaurant.reviews.map((review) => (
                <li key={review.id} className="border rounded p-2">
                  <p className="text-sm font-semibold">{review.authorName}</p>
                  <p className="text-sm text-yellow-500">⭐ {review.rating} / 5</p>
                  <p className="text-sm">{review.comment}</p>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-row gap-2 mt-4 align-center justify-center">
          <Button variant="secondary" className=" my-4">Visit website</Button>  
          <Button  className="s my-4">Write a review!</Button> 
          </div>
           
        </CardContent>
        
      </Card>
    </div>
  );
}
