import { faBellConcierge, faClock, faStar, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  restaurantId: string;
  authorId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: string;
    createdAt: string;
    updatedAt: string;
  };
  comment: string | null;
  createdAt: string;
  // Fjern updatedAt - det findes ikke i dit Review model
  tasteScore: number;
  serviceScore: number;
  priceScore: number;
  title: string;
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {reviews.map((review) => (
        <li key={review.id} className="border rounded p-2 max-w-sm w-full gap-1 flex flex-col">
          <p className="text-sm font-semibold">
            {review.author.firstName} {review.author.lastName}
          </p>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <FontAwesomeIcon icon={faClock} className="w-4" style={{ color: "#000000" }} />
            <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
            <FontAwesomeIcon icon={faStar} className="w-4" style={{ color: "#000000" }} />
            <span>Taste: {review.tasteScore}</span>
            <FontAwesomeIcon icon={faBellConcierge} className="w-4" style={{ color: "#000000" }} />
            <span>Service: {review.serviceScore}</span>
            <FontAwesomeIcon icon={faTag} className="w-4" style={{ color: "#000000" }} />
            <span>Price: {review.priceScore}</span>
          </div>

          {review.comment && <span>{review.comment}</span>}
        </li>
      ))}
    </ul>
  );
}
