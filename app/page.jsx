// "use client";
import dynamic from "next/dynamic";
const LyraOS = dynamic(() => import("../components/LyraOS"), { ssr: false });

export default function Page() {
  return <LyraOS />;
}
