"use client";
import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBlock } from "wagmi";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";

const ChainInfoCard = () => {
  const { data: block } = useBlock({
    blockTag: "latest",
    watch: true,
  });

  const BlockHashDisplayed = useMemo(() => {
    return `${block?.hash.slice(0, 4)}...${block?.hash.slice(-6)}`;
  }, [block]);

  const chainId = useMemo(() => {
    return block?.chainId;
  }, [block]);

  const gasUsed = useMemo(() => {
    return block?.gasUsed.toString();
  }, [block]);

  const gasPrice = useMemo(() => {
    return block?.baseFeePerGas
      ? `${parseInt(block.baseFeePerGas.toString()) / 1e9} Gwei`
      : "Not Available";
  }, [block]);

  const burntFees = useMemo(() => {
    if (gasUsed && gasPrice) {
      const fees = Number(block?.gasUsed) * Number(block?.baseFeePerGas);
      return `${parseInt(fees.toString()) / 1e18} ETH`;
    }
    return "Not Available";
  }, [block]);

  const urlExplorer = useMemo(() => {
    return `https://etherscan.io/block/${block?.number}`;
  }, [block?.number]);

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Latest Block</CardTitle>
          <CardDescription className="flex text-lg flex-row items-center gap-2 ">
            scanner
            <Link href={urlExplorer} target="_blank">
              <MoveUpRight />
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <span className="font-bold">Chain ID :</span> <span>{chainId}</span>
          </p>
          <p>
            <span className="font-bold">Block Number :</span>{" "}
            <span>{block?.number.toString()}</span>
          </p>
          <p>
            <span className="font-bold">Block Hash :</span>{" "}
            <span>{BlockHashDisplayed}</span>
          </p>
          <p>
            <span className="font-bold">Gas Used :</span> <span>{gasUsed}</span>
          </p>
          <p>
            <span className="font-bold">Gas price :</span>{" "}
            <span>{gasPrice}</span>
          </p>
          <p>
            <span className="font-bold">Burnt Fees :</span>{" "}
            <span>{burntFees}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChainInfoCard;
