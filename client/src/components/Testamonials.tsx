import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import Image from "next/image";

function Testamonials() {
  return (
    <Carousel className="w-full m-auto">
      <CarouselContent>
        <CarouselItem>
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
            <CardContent>
              <p className="text-center">Torvets kebab er noget af det bedste jeg nogen sinde har smagt. Det er som om at de har revolutioneret en durum!</p>
            </CardContent>
          </Card>
        </CarouselItem>
        <CarouselItem>
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
            <CardContent>
              <p className="text-center">Torvets kebab er noget af det bedste jeg nogen sinde har smagt. Det er som om at de har revolutioneret en durum!</p>
            </CardContent>
          </Card>
        </CarouselItem>
        <CarouselItem>
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
