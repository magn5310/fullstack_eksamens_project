import Image from "next/image";
import { Button } from "@/components/ui/button";
import Testamonials from "@/components/Testamonials";
import Link from "next/link";

export default function Home() {
  return (
    <div data-homepage className="mb-12">

      <main className="bg-[#fffffe]">
        <div className="w-full h-[100vh] flex items-center justify-center relative bg-black before:absolute before:inset-0 before:bg-black/30 before:z-10">
          <Image src="/images/kebab-hero.jpg" style={{ objectFit: "cover" }} alt="Nice kebab" fill={true} />
          <div className="relative z-40 text-white place-items-center flex flex-col gap-10">
            <div className="place-items-center">
              <Image src="/logo_transparant_white.svg" alt="Kebabadvisor logo" width={200} height={200} />
              <h1 className="font-bold text-5xl lg:text-8xl">Kebabadvisor</h1>
              <h4 className="text-xl lg:text-3xl">Find the best kebab in Copenhagen</h4>
            </div>
            <Button className="bg-lilla" asChild>
              <Link href={"/restaurants"}>Browse Kebab</Link>
            </Button>
          </div>
        </div>
        <section className="container mx-auto px-4">
          <h2 className="text-2xl text-center p-6">Top 3 best rated</h2>
          <div className="w-full">
            <Testamonials />
          </div>
        </section>
      </main>
    </div>
  );
}
