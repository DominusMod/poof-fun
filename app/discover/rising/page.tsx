import { redirect } from "next/navigation";

// Kept as a redirect so old links keep working after the Rising → Trending rename.
export default function RisingRedirect() {
  redirect("/discover/trending");
}
