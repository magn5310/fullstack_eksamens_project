"use client"

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";


const reviewSchema = z.object({
    tasteScore: z.coerce.number().min(1).max(5),
    serviceScore: z.coerce.number().min(1).max(5),
    priceScore: z.coerce.number().min(1).max(5),
    comment: z.string().max(500).optional(),
  });

export default function ReviewForm({restaurantId}: { restaurantId: string }) {
    const [submitted, setSubmitted] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: zodResolver(reviewSchema),
    })

    const onsubmit = async (data: z.infer<typeof reviewSchema>) => {
        try {
            const response = await fetch(`/api/reviews/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    restaurantId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit review");
            }

            setSubmitted(true);
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    }

    if (submitted) {
        return <div className="text-green-500">Review submitted successfully!</div>;
    }

    return (
        <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Taste Score</label>
                <input
                    type="number"
                    {...register("tasteScore")}
                    className={`mt-1 block w-full border ${errors.tasteScore ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.tasteScore && <p className="text-red-500 text-sm">{errors.tasteScore.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Service Score</label>
                <input
                    type="number"
                    {...register("serviceScore")}
                    className={`mt-1 block w-full border ${errors.serviceScore ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.serviceScore && <p className="text-red-500 text-sm">{errors.serviceScore.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Price Score</label>
                <input
                    type="number"
                    {...register("priceScore")}
                    className={`mt-1 block w-full border ${errors.priceScore ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.priceScore && <p className="text-red-500 text-sm">{errors.priceScore.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Comment</label>
                <textarea
                    {...register("comment")}
                    className={`mt-1 block w-full border ${errors.comment ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    rows={3}
                />
                {errors.comment && <p className="text-red-500 text-sm">{errors.comment.message}</p>}
            </div>

            <Button type="submit">
                Submit Review
            </Button>
        </form>
        );
    }