import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
//import { buttonVariants } from "@/components/ui/button"

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
      <div className="grid grid-cols-12 gap-4 p-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <Card className="col-span-2" key={index}>
            <CardHeader>
              <CardTitle className="text-center">Torvets</CardTitle>
            </CardHeader>
            <CardContent>
              <Image src="/images/kebab.jpg" alt="Torvets" width={300} height={200} />
            </CardContent>
            <CardContent className='flex justify-center gap-2'>
            <FontAwesomeIcon icon={faStar} className="text-yellow-200 w-10"/>
            <p className="text-2xl font-semibold">5/5</p>
            </CardContent>
            <CardFooter>
<<<<<<< HEAD
              <Button className="w-full">
                <Link href={`/products/torvets`}>View</Link>
              </Button>
              
=======
              <Link className="w-full" href="/products">
                <Button className="w-full">See more</Button>
              </Link>
>>>>>>> magnus-branch
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

export default list
