import { useEffect, useState } from "react";
import Image from "next/image";

export function RestaurantImage({ name, id, photoUrl }: { name: string; id: string; photoUrl?: string | null }) {
    const [imageUrl, setImageUrl] = useState<string | null>(photoUrl ?? null);
  
    useEffect(() => {
      if (imageUrl) return; // already available from DB
  
      const fetchImage = async () => {
        try {
        const res = await fetch(`/api/unsplash?query=${encodeURIComponent(name)}`);
          const data = await res.json();
          setImageUrl(data.imageUrl || "/images/kebab.jpg");
  
          // Save to DB
          if (data.imageUrl) {
            await fetch(`/api/restaurants/${id}/image`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageUrl: data.imageUrl }),
            });
          }
        } catch {
          setImageUrl("/images/kebab.jpg");
        }
      };
  
      fetchImage();
    }, [name, id, imageUrl]);
  
    return imageUrl ? (
      <Image className="align-center mx-auto rounded-t-md mb-2" src={imageUrl} alt={name} fill={true} style={{ objectFit: "cover" }} />
    ) : (
      <div className="h-48 bg-gray-200 animate-pulse rounded-t-md" />
    );
  }
  
