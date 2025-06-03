import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Testamonials from "@/components/Testamonials";
import NavBar from "@/components/NavBar";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <NavBar />

      <main className="bg-[#fffffe]">
        <div className="w-full h-[100vh] flex items-center justify-center relative bg-black before:absolute before:inset-0 before:bg-black/30 before:z-10">
          <Image src="/images/kebab-hero.jpg" style={{ objectFit: "cover" }} alt="Nice kebab" fill={true} />
          <div className="relative z-40 text-white place-items-center flex flex-col gap-10">
            <div className="place-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
              <h1 className="font-bold text-8xl">Kebabadvisor</h1>
              <h4 className="text-3xl">Find the best kebab in Copenhagen</h4>
            </div>
            <Button className="bg-lilla" asChild>
              <Link href={"/list"}>Browse Kebab</Link>
            </Button>
          </div>
        </div>
        <section className="w-fit mx-auto">
          <h2 className=" text-2xl text-center p-6">Top 3 best rated</h2>
          <div className="flex flex-col items-center justify-center w-100 p-6">
            
            <Testamonials />
          </div>
        </section>
      </main>
    </div>
  );
}
