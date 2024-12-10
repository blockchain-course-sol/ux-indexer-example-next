"use client";
import { GET_ALL_TOKENS } from "@/lib/graphql/queries.graphql";
import { Token } from "@/lib/types/graphql.type";
import { useQuery } from "@apollo/client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { MoveUpRight } from "lucide-react";
const TokenInfoCard = () => {
  const { data: allTokenData } = useQuery<{ tokens: Token[] }>(GET_ALL_TOKENS);

  return (
    <>
      {allTokenData?.tokens.map((token: Token) => {
        return (
          <Card className="w-[400px]" key={token.id}>
            <CardHeader>
              <CardTitle>{token.name} Token</CardTitle>
              <CardDescription className="flex text-lg flex-row items-center gap-2 ">
                scanner
                <Link
                  href={`https://etherscan.io/address/${token.id}`}
                  target="_blank"
                >
                  <MoveUpRight />
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <span className="font-bold">Address :</span>{" "}
                <span>{token.tokenAddress}</span>
              </p>
              <p>
                <span className="font-bold">Symbol :</span>{" "}
                <span>{token.symbol}</span>
              </p>
              <p>
                <span className="font-bold">Decimals :</span>{" "}
                <span>{token.decimals}</span>
              </p>
              <p>
                <span className="font-bold">Total Supply:</span>{" "}
                <span>
                  {token.totalSupply} {token.symbol}
                </span>
              </p>
              <p>
                <span className="font-bold">Total Transfers :</span>{" "}
                <span>{token.totalTransfers}</span>
              </p>
              <p>
                <span className="font-bold">Number Holders :</span>{" "}
                <span>{token.holders}</span>
              </p>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};

export default TokenInfoCard;
