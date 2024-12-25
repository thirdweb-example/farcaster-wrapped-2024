import React from "react";
import { getAddress, shortenAddress } from "thirdweb/utils";
import { getTransactions } from "~/lib/get-transactions";
import { getChainActivity } from "~/lib/get-chain-activity";
import { getContractActivity } from "~/lib/get-contract-activity";
import BorderBox from "~/components/BorderBox";
import MotionDiv from "~/components/MotionDiv";
import { LinkButton } from "~/components/LinkButton";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ShareButton } from "~/components/ShareButton";
import { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_URL!;

export const revalidate = 300;

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ addresses: string }> }): Promise<Metadata> {
  const addresses = await searchParams.then(params => params.addresses?.split(",").map(address => getAddress(address)) ?? []);

  const frame = {
    version: "next",
    imageUrl: `${appUrl}/share-frame.png`,
    button: {
      title: "Check it out",
      action: {
        type: "launch_frame",
        name: "My Year Onchain",
        url: `${appUrl}/summary?addresses=${addresses.join(",")}`,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: "#000000",
      },
    },
  };


  return {
    title: "Your Year Onchain",
    openGraph: {
      title: "Your Year Onchain",
      description: "See my top transactions, chains, and contracts for 2024.",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}


export default async function Page({ searchParams }: { searchParams: Promise<{ addresses: string }> }) {
  const addresses = await searchParams.then(params => params.addresses?.split(",").map(address => getAddress(address)) ?? []);
  const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent("Check out my year onchain!")}%0A%0A${encodeURIComponent(appUrl)}%2Fsummary%3Faddresses%3D${encodeURI(addresses.join(","))}`;

  const [transactionsResult, chainActivityResult, contractsResult] = await Promise.all([
    getTransactions(addresses),
    getChainActivity(addresses),
    getContractActivity(addresses),
  ]);

  if (transactionsResult.isErr()) return <div>Error: {transactionsResult.error}</div>;
  if (chainActivityResult.isErr()) return <div>Error: {chainActivityResult.error}</div>;
  if (contractsResult.isErr()) return <div>Error: {contractsResult.error}</div>;

  const [transactions, chains, contracts] = [
    transactionsResult.value,
    chainActivityResult.value,
    contractsResult.value,
  ];

  const mostActiveChain = chains.sort((a, b) => b.transactions.length - a.transactions.length)[0];
  const mostUsedContract = contracts.sort((a, b) => b.transactions.length - a.transactions.length)[0];

  return (
    <div className="flex flex-col items-center justify-center min-h-full max-w-screen gap-4 p-6 py-16">
      <h1 className="text-4xl font-bold">My Year Onchain</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <BorderBox>
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center w-64 h-32 justify-center"
          >
            <div className="text-3xl font-bold">{transactions.length}</div>
            <div className="text-lg font-medium">Total Transactions</div>
          </MotionDiv>
        </BorderBox>

        <BorderBox>
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center text-center w-64 h-32 justify-center"
          >
            <div className="text-3xl font-bold">{mostActiveChain.name}</div>
            <div className="text-lg font-medium text-opacity-50">Most Active Chain</div>
          </MotionDiv>
        </BorderBox>

        <BorderBox>
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center w-64 h-32 justify-center text-center"
          >
            <div className="text-3xl font-bold">{mostUsedContract.name || shortenAddress(mostUsedContract.address)}</div>
            <div className="text-lg font-medium text-opacity-50">Most Used Contract</div>
          </MotionDiv>
        </BorderBox>
      </div>

      <div className="flex w-full justify-between items-center gap-2 mt-8 max-w-4xl">
        <LinkButton href={`/contracts?addresses=${addresses.join(",")}`}>
          <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-all duration-200" />
          Previous
        </LinkButton>
        <ShareButton href={shareUrl}>
          Share
          <ChevronRightIcon className="w-4 h-4 group-hover:-translate-x-1 transition-all duration-200" />
        </ShareButton>
      </div>
    </div>
  );
}
