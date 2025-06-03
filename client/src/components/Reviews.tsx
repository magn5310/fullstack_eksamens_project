interface Review {
  id: number;
  authorName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export default function ReviewList ({ reviews }: { reviews: Review[] }) {
    return  (
        <ul className="flex flex-row flex-wrap gap-4">
          {reviews.map((review) => (
            <li key={review.id} className="border rounded p-2">
              <p className="text-sm font-semibold">{review.authorName}</p>
              <p className="text-sm text-yellow-500">⭐ {review.rating} / 5</p>
              <p className="text-sm">{review.comment}</p>
            </li>
          ))}
        </ul>
      );
}