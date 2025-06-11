"use client"

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


const reviewSchema = z.object({
    tasteScore: z.coerce.number().min(1).max(5),
    serviceScore: z.coerce.number().min(1).max(5),
    priceScore: z.coerce.number().min(1).max(5),
    comment: z.string().max(500).optional(),
  });

  export default function ReviewForm({restaurantId}: { restaurantId: string }) {
    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
      resolver: zodResolver(reviewSchema),
    })

    useEffect(() => {
        if (submitted) {
            toast.success("Review submitted successfully!");
        }
    }, [submitted]);

    // Watch values for live display
    const tasteScore = watch("tasteScore", 3)
    const serviceScore = watch("serviceScore", 3)
    const priceScore = watch("priceScore", 3)

    const onsubmit = async (data: z.infer<typeof reviewSchema>) => {
        setIsSubmitting(true)
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
        } finally {
            setIsSubmitting(false)
        }
    }

    if (submitted) {
        return null; // Optionally return null or a success message
    }

    return (
        <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
            <div className="flex flex-col w-full justify-center">
                <label className="block text-sm font-medium text-gray-700 mb-1">Taste Score</label>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">1</span>
                    <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        {...register("tasteScore")}
                        className="flex-1 accent-black"
                    />
                    <span className="text-xs text-gray-400">5</span>
                    <span className="ml-2 font-semibold">{tasteScore}</span>
                </div>
                {errors.tasteScore && <p className="text-red-500 text-sm">{errors.tasteScore.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Score</label>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">1</span>
                    <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        {...register("serviceScore")}
                        className="flex-1 accent-black"
                    />
                    <span className="text-xs text-gray-400">5</span>
                    <span className="ml-2 font-semibold">{serviceScore}</span>
                </div>
                {errors.serviceScore && <p className="text-red-500 text-sm">{errors.serviceScore.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Score</label>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">1</span>
                    <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        {...register("priceScore")}
                        className="flex-1 accent-black"
                    />
                    <span className="text-xs text-gray-400">5</span>
                    <span className="ml-2 font-semibold">{priceScore}</span>
                </div>
                {errors.priceScore && <p className="text-red-500 text-sm">{errors.priceScore.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Comment</label>
                <textarea
                    {...register("comment")}
                    className={`mt-1 block w-full border ${errors.comment ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    rows={3}
                    placeholder="Write your feedback here (optional, max 500 characters)..."
                />
                {errors.comment && <p className="text-red-500 text-sm">{errors.comment.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
        </form>
    );
}