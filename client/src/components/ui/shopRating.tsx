import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface shopRating{
    rating?: number;
    openHours?: string;
    description?: string;
    address ?: string;
    phone?: string; 
}


export default function ShopRating({ rating = 0, openHours }: shopRating) {
    return (
        <div className="text-center">
            <span className="flex fill-black flex-row justify-center items-center gap-1 mb-2">
                <>
                {Array.from({ length: 5 }, (_, index) => (
                    <FontAwesomeIcon
                        key={index}
                        icon={faStar}
                        className={`w-4 ${index < rating ? "text-black-500" : "text-gray-300"}`}
                    />                ))}
                <p className="text-gray-500">{rating !== undefined ? rating.toFixed(1) : '0.0'}</p>
                </>
            </span>
            {openHours && (
                <div className="text-sm text-muted-foreground">
                    {openHours}
                </div>
            )}
                

               
               </div> 
        );
    }