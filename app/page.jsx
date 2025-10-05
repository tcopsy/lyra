// "use client";
import dynamic from "next/dynamic";
// Dynamically load the heavy UI so SSR doesn't choke on window-related things
const LyraOS = dynamic(() => import("@/components/LyraOS"), { ssr: false });
export default function Page() {
  return <LyraOS />;
}
