import Image from "next/image";
import { Button } from "@/components/ui/button";
import Testamonials from "@/components/Testamonials";
import Link from "next/link";

export default function Home() {
  return (
    <div data-homepage>

      <main className="bg-[#fffffe]">
        <div className="w-full h-[100vh] flex items-center justify-center relative bg-black before:absolute before:inset-0 before:bg-black/30 before:z-10">
          <Image src="/images/kebab-hero.jpg" style={{ objectFit: "cover" }} alt="Nice kebab" fill={true} />
          <div className="relative z-40 text-white place-items-center flex flex-col gap-10">
            <div className="place-items-center">
              <Image src="/logo_transparant_white.svg" alt="Kebabadvisor logo" width={200} height={200} />
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
          <div className="flex flex-col items-center justify-center max-w-100 md:max-w-300 p-6">
            
            <Testamonials />
          </div>
        </section>
      </main>
    </div>
  );
}
