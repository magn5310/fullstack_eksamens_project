import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";



const list = () => {
  return (
    <>
      <h1 className="font-bold text-2xl">List</h1>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/list">See all</Link>
          </li>
        </ul>
      </nav>
      <div className="grid grid-cols-12  gap-4 p-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <Card className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3" key={index}>
            <CardHeader>
              <CardTitle className="text-center">Torvets</CardTitle>
            </CardHeader>
            <CardContent>
              <Image src="/images/kebab.jpg" className="w-full h-auto" alt="Torvets" width={100} height={200} />
            </CardContent>
            <CardContent className="flex justify-center gap-2">
              <FontAwesomeIcon icon={faStar} className="text-yellow-200 w-10" />
              <p className="text-2xl font-semibold">5/5</p>
            </CardContent>
            <CardFooter>
              <Link className="w-full" href={`/products/torvets`}>
                <Button className="w-full">View</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

export default list
