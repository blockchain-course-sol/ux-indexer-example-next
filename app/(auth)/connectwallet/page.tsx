"use client";
import dynamic from "next/dynamic";

const ConnectModal = dynamic(() => import("@/components/connect-modal"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="flex items-center h-screen mb-8">
      <ConnectModal />
    </div>
  );
}
