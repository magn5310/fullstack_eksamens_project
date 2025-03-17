import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";



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
            <CardFooter>
              <Link href="/products" className="w-full bg-black text-white text-center rounded text-2xl font-semibold">See more</Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

export default list
