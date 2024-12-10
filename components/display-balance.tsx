"use client";
import { GET_BALANCES_BY_WALLET } from "@/lib/graphql/queries.graphql";
import { Balance } from "@/lib/types/graphql.type";
import { useQuery } from "@apollo/client";
import React, { useMemo, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";

interface BalancesResponse {
  balances: Balance[];
}

interface DisplayBalanceProps {
  wallet: string | undefined;
}
const DisplayBalance = ({ wallet }: DisplayBalanceProps) => {
  const router = useRouter();
  const { data } = useQuery<BalancesResponse>(GET_BALANCES_BY_WALLET, {
    variables: { wallet },
    skip: !wallet,
  });

  const [walletAddress, setWalletAddress] = useState("");

  const walletAddressDisplay = useMemo(() => {
    if (wallet) {
      return `${wallet.slice(0, 4)}...${wallet.slice(-6)}`;
    }
  }, [wallet]);

  return (
    <>
      <div className="flex w-full max-w-sm items-end space-x-2 ">
        <div className="flex-1">
          <Label className="text-lg" htmlFor="email">
            Look for a wallet balance
          </Label>
          <Input
            type="wallet"
            placeholder="Wallet Address"
            value={walletAddress}
            onChange={(e) => {
              setWalletAddress(e.target.value);
            }}
          />
        </div>
        <Button
          type="submit"
          onClick={() => {
            if (walletAddress) {
              router.push(`/token-data/${walletAddress}`);
            }
          }}
        >
          <Search />
        </Button>
      </div>
      {wallet && (
        <div className="mt-6">
          Balance {walletAddressDisplay} :
          <span className="font-bold">
            {" "}
            {data?.balances[0].valueBD.toFixed(3)} UNCX
          </span>
        </div>
      )}
    </>
  );
};

export default DisplayBalance;
