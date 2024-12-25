import React from "react";
import { getAddress } from "thirdweb/utils";
import { getTransactions } from "~/lib/get-transactions";
import { getChainActivity } from "~/lib/get-chain-activity";
import BorderBox from "~/components/BorderBox";
import MotionDiv from "~/components/MotionDiv";
import { LinkButton } from "~/components/LinkButton";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default async function Page({ searchParams }: { searchParams: Promise<{ addresses: string }> }) {
  const addresses = await searchParams.then(params => params.addresses?.split(",").map(address => getAddress(address)) ?? []);

  const [transactionsResult, chainActivityResult] = await Promise.all([getTransactions(addresses), getChainActivity(addresses)]);
  if (transactionsResult.isErr()) {
    return <div>Error: {transactionsResult.error}</div>;
  }
  if (chainActivityResult.isErr()) {
    return <div>Error: {chainActivityResult.error}</div>;
  }
  const [transactions, chains] = [transactionsResult.value, chainActivityResult.value];

  return (
    <div className="flex flex-col justify-center items-center gap-4 p-6 h-full">
      <div className="flex items-center justify-center flex-col gap-2 lg:flex-row lg:gap-4">
        <BorderBox>
          <MotionDiv initial={{ opacity: 0, scale: 1.2 }} transition={{ duration: 0.4 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center w-48 h-32 justify-center">
            <div className="text-4xl font-bold">{transactions?.length}</div>
            <div className="text-xl font-medium">Transactions</div>
          </MotionDiv>
        </BorderBox>
        <MotionDiv initial={{ opacity: 0 }} transition={{ dduration: 0.4 }} animate={{ opacity: 1 }} className="text-center text-xl font-medium max-w-lg">
          You've been busy this year!
          You executed {transactions?.length} transactions across {chains?.length} chains.
        </MotionDiv>
        <BorderBox>
          <MotionDiv initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.4 }} className="flex flex-col items-center w-48 h-32 justify-center">
            <div className="text-4xl font-bold">{chains?.length}</div>
            <div className="text-xl font-medium">Chains</div>
          </MotionDiv>
        </BorderBox>
      </div>
      <div className="flex w-full justify-center items-center gap-2 mt-6 max-w-xl lg:max-w-6xl">
        <LinkButton href={`/gas?addresses=${addresses.join(",")}`}>
          Next <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-all duration-200" />
        </LinkButton>
      </div>
    </div>
  );
}
