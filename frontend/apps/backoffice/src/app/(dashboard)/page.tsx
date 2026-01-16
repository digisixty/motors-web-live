import { redirect } from "next/navigation";
import { CAR_LISTINGS } from "@/constants/routes";

export default function Home() {
  redirect(CAR_LISTINGS);
}
