interface shopRating{
    rating?: number;
    openHours?: string;
    description?: string;
    address ?: string;
    phone?: string; 
}


export default function ShopRating({ rating = 0, openHours, address, phone }: shopRating) {
    return (
        <div className="text-center">
            <span className="text-yellow-500">
                ⭐ {(rating ?? 0).toFixed(1)} / 5
            </span>
            {openHours && (
                <div className="text-sm text-muted-foreground">
                    {openHours}
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