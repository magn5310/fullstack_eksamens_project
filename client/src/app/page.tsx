import Options from "@/components/Options";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Testamonials from "@/components/Testamonials";

export default function Home() {
  return (
    <div>
      <h1 className="font-bold text-2xl">Home</h1>
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
      <main className="bg-[#fffffe]">
        <section className="mb-10 h-[50vh] flex flex-col items-center justify-center ">
          <h1 className="text-6xl font-bold text-[#078080] my-6">Find the food you really want!</h1>
          <p className="text-2xl underline decoration-[#f45d48]">Your #1 place to find reviews and data about restaurants near you!</p>
        </section>

        <Options />

        <section className="max-w-7xl mx-auto">
          <h2 className=" text-2xl p-6">Top rated</h2>
          <div className="grid grid-cols-3 gap-4 items-center justify-center w-full p-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Torvets</CardTitle>
              </CardHeader>
              <CardContent>
                <Image src="/images/kebab.jpg" alt="Torvets" width={300} height={200} />
              </CardContent>
              <CardFooter>
                <Button className="w-full">See more</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Torvets</CardTitle>
              </CardHeader>
              <CardContent>
                <Image src="/images/kebab.jpg" alt="Torvets" width={300} height={200} />
              </CardContent>
              <CardFooter>
                <Button className="w-full">See more</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Torvets</CardTitle>
              </CardHeader>
              <CardContent>
                <Image src="/images/kebab.jpg" alt="Torvets" width={300} height={200} />
              </CardContent>
              <CardFooter>
                <Button className="w-full">See more</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="max-w-7xl mx-auto my-6">
          <h2 className="text-2xl text-[#078080] p-6 text-center">
            Reviews about <span className="text-[#f45d48]">us!</span>
          </h2>
          <Testamonials />
        </section>
      </main>
    </div>
  );
}
