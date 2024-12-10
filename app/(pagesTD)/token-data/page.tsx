import DisplayBalance from "@/components/display-balance";
import TokenInfoCard from "@/components/token-info-card";
import React from "react";

interface PageProps {
  params: {
    wallet: string;
  };
}

const Page = ({ params }: PageProps) => {
  return (
    <div className="h-screen flex flex-row justify-center items-start mt-[10%] space-x-10">
      <TokenInfoCard />
      <div className="w-[400px]">
        <DisplayBalance wallet={params.wallet} />
      </div>
    </div>
  );
};

export default Page;
