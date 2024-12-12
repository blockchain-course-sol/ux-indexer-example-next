"use client";
import React, { useMemo } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { Badge } from "./ui/badge";
import { RefreshCcw } from "lucide-react";

const Networkbadge = () => {
  const { chainId } = useAccount();
  const isRightNetwork = useMemo(() => {
    if (chainId) {
      return chainId === 1 || chainId === 11_155_111;
    }
    return true;
  }, [chainId]);
  const { switchChain } = useSwitchChain();

  if (!isRightNetwork)
    return (
      <Badge
        className={`m-2 mr-5 ${!isRightNetwork && "cursor-pointer"}`}
        variant={isRightNetwork ? "default" : "destructive"}
        onClick={() => {
          switchChain({ chainId: 1 });
        }}
      >
        {"You are on the wrong network."}
      </Badge>
    );

  if (isRightNetwork)
    return (
      <div className={`flex center m-2 mr-5  gap-2`}>
        <Badge variant={"default"}>
          {chainId === 1 ? "Mainnet" : "Sepolia"}
        </Badge>
        <RefreshCcw
          className="cursor-pointer"
          onClick={() => {
            switchChain({ chainId: chainId === 1 ? 11_155_111 : 1 });
          }}
          size={20}
        />
      </div>
    );
};

export default Networkbadge;
