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
                    <span>🕒 {new Date(review.createdAt).toLocaleDateString()}</span>
                    <span>🍽️ Taste: {review.tasteScore}</span>
                    <span>🤝 Service: {review.serviceScore}</span>
                    <span>💰 Price: {review.priceScore}</span>
                    <span>⭐️ Overall: {((review.tasteScore + review.serviceScore + review.priceScore) / 3).toFixed(1)}</span>
                    <span className="text-muted-foreground">
                        {review.comment ? 'Commented' : 'No comment'}
                    </span>

                </div>
              <p className="text-sm">{review.comment}</p>
            </li>
          ))}
        </ul>
      );
}