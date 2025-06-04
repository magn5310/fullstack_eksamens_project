import { faBellConcierge, faClock, faStar, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistanceToNow } from 'date-fns';

interface Review {
    id: string;
    author: {
        firstName: string;
        lastName: string;
        email: string;
    };
    comment?: string;
    createdAt: string;
    tasteScore: number;
    serviceScore: number;
    priceScore: number;
    reviews?: Review[];
    comments?: string;
}

export default function ReviewList ({ reviews }: { reviews: Review[] }) {
    return  (
        <ul className="flex flex-row flex-wrap gap-4">
          {reviews.map((review) => (
            <li key={review.id} className="border rounded p-2">
              <p className="text-sm font-semibold">{review.author.firstName} {review.author.lastName}</p>
                <div className="flex gap-2 text-xs text-muted-foreground">
                    <FontAwesomeIcon icon={faClock} className="w-4" style={{color:"#000000",}} />
                    <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                    <FontAwesomeIcon icon={faStar} className="w-4" style={{color:"#000000",}} />
                    <span>Taste: {review.tasteScore}</span>
                    <FontAwesomeIcon icon={faBellConcierge} className="w-4" style={{color:"#000000",}} />
                    <span>Service: {review.serviceScore}</span>
                    <FontAwesomeIcon icon={faTag} className="w-4" style={{color:"#000000",}} />
                    <span>Price: {review.priceScore}</span>
                    </div>


              <p className="text-sm">{review.comment}</p>
            </li>
          ))}
        </ul>
      );
}