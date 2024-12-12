"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Button } from "./ui/button";
import { parseEther, isAddress } from "viem";
import { toast } from "sonner";

export default function SendTransaction() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const { data, sendTransaction } = useSendTransaction();

  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash: data,
  });

  const { isConnected } = useAccount();

  useEffect(() => {
    if (isLoading) {
      toast("Transaction Pending", {
        description: "Your transaction is being processed. Please wait.",
        action: {
          label: "View Details",
          onClick: () =>
            window.open(`https://sepolia.etherscan.io/tx/${data}`, "_blank"),
        },
      });
    }
    if (isSuccess) {
      toast("Transaction Successful", {
        description:
          "Your transaction was successful! Click below for details.",
        action: {
          label: "View Details",
          onClick: () =>
            window.open(`https://sepolia.etherscan.io/tx/${data}`, "_blank"),
        },
      });
    }
    if (isError) {
      toast("Transaction Failed", {
        description:
          "An error occurred during the transaction. Please try again.",
        action: {
          label: "View Details",
          onClick: () =>
            window.open(`https://sepolia.etherscan.io/tx/${data}`, "_blank"),
        },
      });
    }
  }, [isLoading, isSuccess, isError, data]);

  return (
    <div className="container mx-auto p-4 w-[600px]">
      <Card>
        <CardHeader>
          <CardTitle>Send ETH</CardTitle>
          <CardDescription>Send ETH to any Ethereum address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="to">Recipient Address</Label>
            <Input
              id="to"
              placeholder="0x..."
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full"
            />
          </div>

          <Button
            disabled={
              !isConnected || amount === "" || !isAddress(to) || isLoading
            }
            onClick={() => {
              if (isAddress(to)) {
                sendTransaction({
                  to,
                  value: parseEther(amount),
                });
              }
            }}
          >
            {isLoading ? "Pending..." : "Send"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
