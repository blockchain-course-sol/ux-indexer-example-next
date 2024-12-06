"use client";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Connector, useConnect } from "wagmi";
import metamaskLogo from "../lib/assets/wallets/metamask.svg";
import walletconnectLogo from "../lib/assets/wallets/walletconnect.svg";
import { useRouter } from "next/navigation";

export default function ConnectModal() {
  const router = useRouter();

  const { connect, connectors } = useConnect({
    mutation: {
      onSuccess() {
        router.push("/chain-info");
      },
    },
  });
  return (
    <div className="flex justify-center w-full">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Connect Wallet</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Choose a Wallet</DialogHeader>
          <div className="flex flex-col gap-4">
            {connectors.map((connector: Connector) => {
              if (
                connector.name === "MetaMask" ||
                connector.name === "WalletConnect"
              ) {
                return (
                  <Button
                    className="flex gap-2"
                    key={connector.id}
                    onClick={() => connect({ connector })}
                  >
                    {connector.name === "MetaMask" ? (
                      <Image
                        src={metamaskLogo}
                        alt="logo metamask"
                        height={20}
                        width={20}
                      />
                    ) : connector.name === "WalletConnect" ? (
                      <Image
                        src={walletconnectLogo}
                        alt="logo metamask"
                        height={20}
                        width={20}
                      />
                    ) : (
                      ""
                    )}
                    {connector.name}
                  </Button>
                );
              }
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
