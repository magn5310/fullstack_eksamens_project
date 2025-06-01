import { useEffect, useState} from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";


interface Restaurant {
    id: number;
    name: string;
    cuisine: string;
    lat: number;
    lon: number;
}

export default function RestaurantList() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch('/api/restaurants');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRestaurants(data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            }
        }
        fetchRestaurants();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((restaurant) => (
                <Card key={restaurant.id} className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-center">{restaurant.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Cuisine: {restaurant.cuisine}</p>
                        <p>Location: ({restaurant.lat}, {restaurant.lon})</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

