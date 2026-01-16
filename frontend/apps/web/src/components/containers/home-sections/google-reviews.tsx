"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { motion } from "motion/react";

interface GoogleReview {
  author_name: string;
  author_url: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

// Fetch Google Places reviews via internal API route
async function fetchGoogleReviews(): Promise<GoogleReview[]> {
  try {
    const response = await fetch("/front-api/google-reviews", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }

    const data = await response.json();
    return data.reviews || [];
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return [];
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-6 ${
            star <= rating ? "fill-white text-white" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  return (
    <div className="mx-4 w-80 shrink-0 rounded-3xl bg-black/30 p-6 backdrop-blur-2xl">
      {/* Stars */}
      <div className="mb-3">
        <StarRating rating={review.rating} />
      </div>

      {/* Message */}
      <p className="mb-4 line-clamp-4 min-h-20 text-sm text-gray-200">
        {review.text}
      </p>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <img
          src={review.profile_photo_url}
          alt={review.author_name}
          className="h-10 w-10 rounded-full bg-gray-500 object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {review.author_name}
          </p>
          <p className="text-xs text-gray-300">
            {review.relative_time_description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ScrollingRow({
  reviews,
  direction,
}: {
  reviews: GoogleReview[];
  direction: "rtl" | "ltr";
}) {
  // Duplicate reviews enough times to create seamless infinite scroll
  // We need at least 4 sets for smooth scrolling with this approach
  const duplicatedReviews = [...reviews, ...reviews, ...reviews, ...reviews];

  return (
    <div className="overflow-hidden py-2">
      <motion.div
        className="flex gap-4"
        animate={
          direction === "rtl" ? { x: ["0%", "-25%"] } : { x: ["-25%", "0%"] }
        }
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicatedReviews.map((review, index) => (
          <ReviewCard key={`${review.time}-${index}`} review={review} />
        ))}
      </motion.div>
    </div>
  );
}

function GoogleReviews() {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      setIsLoading(true);
      const data = await fetchGoogleReviews();
      setReviews(data);
      setIsLoading(false);
    }

    loadReviews();
  }, []);

  // Split reviews into two rows
  const midPoint = Math.ceil(reviews.length / 2);
  const firstRowReviews = reviews.slice(0, midPoint);
  const secondRowReviews = reviews.slice(midPoint);

  if (isLoading) {
    return (
      <section className="bg-linear-to-b from-neutral-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-2xl font-bold uppercase md:text-3xl lg:text-4xl">
              Customer Reviews
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden bg-linear-to-tl from-blue-700 to-black py-24">
      <div className="container mx-auto mb-8 px-4">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-white md:text-3xl lg:text-4xl">
            Our customers love what we do
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-300">
            Don&apos;t just take our word for it - hear from our satisfied
            customers
          </p>
        </div>
      </div>

      {/* First row - scrolling right to left */}
      <div className="mb-6">
        <ScrollingRow reviews={firstRowReviews} direction="rtl" />
      </div>

      {/* Second row - scrolling left to right */}
      <div>
        <ScrollingRow reviews={secondRowReviews} direction="ltr" />
      </div>
    </section>
  );
}

export default GoogleReviews;
