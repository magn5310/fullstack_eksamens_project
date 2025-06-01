"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  lat: number;
  lon: number;
  rating?: number; // optional rating
}

const ITEMS_PER_PAGE = 100;

export default function List() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const res = await fetch('/api/restaurants');
      const data = await res.json();

      // Example: Assign random ratings (1–5) if none available
      const enrichedData = data.map((r: any) => ({
        ...r,
        rating: r.rating || Math.floor(Math.random() * 5) + 1, // random fallback
      }));

      setRestaurants(enrichedData);
    };

    fetchRestaurants();
  }, []);

  const totalPages = Math.ceil(restaurants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRestaurants = restaurants.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <h1 className="font-bold text-2xl mb-4">List of Restaurants</h1>
      <nav className="mb-4">
        <ul className="flex gap-4">
          <li>
            <Link href="/" className="text-primary hover:underline">Home</Link>
          </li>
          <li>
            <Link href="/list" className="text-primary hover:underline">See all</Link>
          </li>
        </ul>
      </nav>

      <div className="grid grid-cols-12 gap-4 p-4">
        {paginatedRestaurants.map((r) => (
          <Card key={r.id} className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 rounded-2xl shadow hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-center">{r.name}</CardTitle>
            </CardHeader>

            <CardContent>
              <Image
                src="/images/kebab.jpg"
                className="w-full h-auto object-cover rounded"
                alt={r.name}
                width={100}
                height={200}
              />
            </CardContent>

            <CardContent className="flex justify-center gap-2 items-center">
              <FontAwesomeIcon icon={faStar} className="text-yellow-400 w-4 h-4" />
              <p className="text-sm font-semibold">{r.rating}/5</p>
            </CardContent>

            <CardFooter>
              <Link href={`/products/${r.id}`} className="w-full">
                <Button className="w-full">View</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </Button>
        <p className="text-sm">
          Page {currentPage} of {totalPages}
        </p>
        <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </>
  );
}
