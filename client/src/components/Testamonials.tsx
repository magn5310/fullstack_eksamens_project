import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import Image from "next/image";

function Testimonials() {
  const cardContent = (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Torvets</CardTitle>
        </CardHeader>
        <CardContent>
          <Image src="/images/kebab.jpg" alt="Torvets" width={300} height={200} />

          <p className="text-center">Torvets kebab er noget af det bedste jeg nogen sinde har smagt. Det er som om at de har revolutioneret en durum!</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">See more</Button>
        </CardFooter>
      </Card>
    </>
  );

  return (
    <div className="w-full">
      {/* Desktop: Grid layout */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="space-y-4">
            {cardContent}
          </div>
        ))}
      </div>

      {/* Mobile: Carousel */}
      <div className="md:hidden">
        <Carousel className="w-full m-auto">
          <CarouselContent>
            {[1, 2, 3].map((_, index) => (
              <CarouselItem key={index}>
                <div className="space-y-4">{cardContent}</div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}

export default Testimonials;
