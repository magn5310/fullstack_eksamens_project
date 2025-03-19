import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

function Testamonials() {
  return (
    <Carousel className="w-full max-w-sm m-auto">
      <CarouselContent>
        <CarouselItem>
          <Card>
            <CardContent>
              <p className="text-center">Torvets kebab er noget af det bedste jeg nogen sinde har smagt. Det er som om at de har revolutioneret en durum!</p>
            </CardContent>
          </Card>
        </CarouselItem>
        <CarouselItem>
          <Card>
            <CardContent>
              <p className="text-center">Torvets kebab er noget af det bedste jeg nogen sinde har smagt. Det er som om at de har revolutioneret en durum!</p>
            </CardContent>
          </Card>
        </CarouselItem>
        <CarouselItem>
          <Card>
            <CardContent>
              <p className="text-center">Torvets kebab er noget af det bedste jeg nogen sinde har smagt. Det er som om at de har revolutioneret en durum!</p>
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default Testamonials;
