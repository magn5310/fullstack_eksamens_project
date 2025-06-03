interface shopRating{
    rating?: number;
    openingHours?: string;
    description?: string;
    address ?: string;
    phone?: string;
}


export default function ShopRating({ rating, openingHours, address, phone }: shopRating) {
    return (
        <div className="text-center">
            <span className="text-yellow-500">
                ⭐ {(rating ?? 0).toFixed(1)} / 5
            </span>
            {openingHours && (
                <div className="text-sm text-muted-foreground">
                    {openingHours}
                </div>
            )}
            {address && (
                <div className="text-sm text-muted-foreground">
                    📍 {address}
                </div>
            )}
            {phone && (
                <div className="text-sm text-muted-foreground">
                    📞 {phone}
                </div>
                

               )}
               </div> 
        );
    }