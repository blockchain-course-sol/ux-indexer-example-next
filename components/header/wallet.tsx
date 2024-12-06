"use client";
import { PowerOff, Wallet } from "lucide-react";
import React, { useMemo } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useBalance } from "wagmi";
const WalletComponent = () => {
  const router = useRouter();

  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data } = useBalance({
    address,
  });
  const shortAddress = useMemo(() => {
    return `${address?.slice(0, 5)}...${address?.slice(-4)}`;
  }, [address]);

  const balance = useMemo(() => {
    if (data?.decimals && data?.value) {
      return Number(data?.value) * 10 ** -data?.decimals;
    } else {
      return 0;
    }
  }, [data]);

  if (isConnected) {
    return (
      <div className="flex flex-row items-end gap-1 text-sm w-[252px] center">
        <span className="font-semibold text-black ">
          <Wallet />
        </span>
        {shortAddress}
        <PowerOff
          className="cursor-pointer"
          size={20}
          onClick={() => disconnect()}
        />
        <div className="center  text-lg flex-row ml-2">
          {balance.toFixed(3)} ETH
        </div>
      </div>
    );
  }

  return (
    <Button
      variant={"outline"}
      className="flex flex-row items-end gap-1 text-sm center"
      onClick={() => {
        router.push("/connectwallet");
      }}
    >
      <span className="font-semibold text-black ">
        <Wallet />
      </span>
      connect wallet
    </Button>
  );
};

export default WalletComponent;
