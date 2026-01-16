import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface GoogleReview {
  author_name: string;
  author_url: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface GooglePlacesResponse {
  result: {
    reviews: GoogleReview[];
  };
  error_message?: string;
  status?: string;
}

export async function GET() {
  const PLACE_ID = "ChIJlybady0z5xQRJVgJlvKZmOk";
  const API_KEY = "AIzaSyAvtZt63_DlfE-jZiOPiElVDzLvpd2GoVk";

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${API_KEY}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch reviews" },
        { status: response.status }
      );
    }

    const data: GooglePlacesResponse = await response.json();

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: data.error_message || "Failed to fetch reviews" },
        { status: 400 }
      );
    }

    return NextResponse.json({ reviews: data.result?.reviews || [] });
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
