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
import { getVerifiedAddresses } from "~/lib/get-verified-addresses";

const appUrl = process.env.NEXT_PUBLIC_URL!;

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ addresses: string, fid: string }> }): Promise<Metadata> {
  let addresses = [];
  const fid = await searchParams.then(params => params.fid);

  if (typeof fid !== "undefined" && fid.length > 0) {
    addresses = await getVerifiedAddresses(Number(fid));
  } else {
    addresses = await searchParams.then(params => params.addresses?.split(",").map(address => getAddress(address)) ?? []);
  }



  const url = new URL(`${appUrl}/summary`);
  if (fid) {
    url.searchParams.set("fid", fid);
  } else {
    url.searchParams.set("addresses", addresses.join(","));
  }

  const frame = {
    version: "next",
    imageUrl: `${appUrl}/share-frame.png`,
    button: {
      title: "Check it out",
      action: {
        type: "launch_frame",
        name: "My Year Onchain",
        url,
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


export default async function Page({ searchParams }: { searchParams: Promise<{ addresses: string, fid: string }> }) {
  let addresses = [];
  const fid = await searchParams.then(params => params.fid);

  if (typeof fid !== "undefined") {
    if (fid.length === 0) return <div>Error: Missing FID</div>;
    addresses = await getVerifiedAddresses(Number(fid));
  } else {
    addresses = await searchParams.then(params => params.addresses?.split(",").map(address => getAddress(address)) ?? []);
  }

  if (addresses.length === 0) return <div>No verified addresses found</div>;

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
    <div className="flex flex-col items-center justify-center min-h-full max-w-screen gap-2 p-6">
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

        {mostActiveChain && <BorderBox>
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center text-center w-64 h-32 justify-center"
          >
            <div className="text-3xl font-bold">{mostActiveChain.name}</div>
            <div className="text-lg font-medium text-opacity-50">Most Active Chain</div>
          </MotionDiv>
        </BorderBox>}

        {mostUsedContract && <BorderBox>
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center w-64 h-32 justify-center text-center"
          >
            <div className="text-3xl font-bold">{mostUsedContract.name || shortenAddress(mostUsedContract.address)}</div>
            <div className="text-lg font-medium text-opacity-50">Most Used Contract</div>
          </MotionDiv>
        </BorderBox>}
      </div>

      <div className="flex w-full justify-between items-center gap-2 mt-4 max-w-4xl">
        <LinkButton href={`/contracts?addresses=${addresses.join(",")}`}>
          <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-all duration-200" />
          Previous
        </LinkButton>
        {fid ? (
          <LinkButton href="/">
            See yours
            <ChevronRightIcon className="w-4 h-4 group-hover:-translate-x-1 transition-all duration-200" />
          </LinkButton>
        ) : (
          <ShareButton topChain={mostActiveChain.name} topContract={mostUsedContract.name || shortenAddress(mostUsedContract.address)} transactions={transactions.length}>
            Share
            <ChevronRightIcon className="w-4 h-4 group-hover:-translate-x-1 transition-all duration-200" />
          </ShareButton>
        )}
      </div>
    </div>
  );
}
