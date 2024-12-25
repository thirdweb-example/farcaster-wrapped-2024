import React from "react";
import MotionDiv from "~/components/MotionDiv";
import { getAddress, shortenHex } from "thirdweb/utils";
import { resolveScheme } from "thirdweb/storage";
import { getTransactions } from "~/lib/get-transactions";
import { formatGasCost } from "~/util";
import { getChainActivity } from "~/lib/get-chain-activity";
import { getEthPrice } from "~/lib/get-eth-price";
import { LinkButton } from "~/components/LinkButton";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ThirdwebClient } from "~/constants";

export default async function Page({ searchParams }: { searchParams: Promise<{ addresses: string }> }) {
  const addresses = await searchParams.then(params => params.addresses?.split(",").map(address => getAddress(address)) ?? []);

  const [transactionsResult, chainActivityResult, ethPriceResult] = await Promise.all([getTransactions(addresses), getChainActivity(addresses), getEthPrice()]);
  if (transactionsResult.isErr()) {
    return <div>Error: {transactionsResult.error}</div>;
  }
  if (chainActivityResult.isErr()) {
    return <div>Error: {chainActivityResult.error}</div>;
  }
  if (ethPriceResult.isErr()) {
    return <div>Error: {ethPriceResult.error}</div>;
  }
  const [transactions, chains, ethPrice] = [transactionsResult.value, chainActivityResult.value, ethPriceResult.value];
  if (!transactions || !chains || transactions.length === 0 || chains.length === 0) {
    return <div>Error: No transactions or chains</div>;
  }
  const sortedChains = chains.sort((a, b) => (b.gasUsed / b.transactions.length) - (a.gasUsed / a.transactions.length));
  const sortedTransactions = transactions.sort((a, b) => formatGasCost(b) - formatGasCost(a));

  return (
    <div className="flex flex-col gap-4 p-6 items-center justify-center h-full">
      <div className="flex justify-stretch w-full flex-col lg:max-w-4xl lg:flex-row gap-2 lg:items-end">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 flex flex-col items-start justify-between h-32 w-full lg:w-64">
          <div className="text-sm font-medium opacity-75 mb-4">Most expensive tx</div>
          <div>
            <span className="text-3xl font-bold translate-y-[1px]">${(formatGasCost(sortedTransactions[0]) * ethPrice).toFixed(4)}</span>
            <div className="flex gap-1 items-center">
              {(() => {
                const chain = chains.find(chain => chain.id === sortedTransactions[0].chain_id);
                if (!chain?.icon?.url) {
                  return null;
                }
                return (
                  <img src={resolveScheme({ uri: chain.icon?.url, client: ThirdwebClient })} className="size-4 rounded-full" />
                );
              })()}
              <div className="text-sm font-medium opacity-75">{shortenHex(sortedTransactions[0].hash)}</div>
            </div>
          </div>
        </MotionDiv>
        <div className="border-t-2 border-dashed w-full" />
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 flex flex-col items-start justify-between h-32 w-full lg:w-64">
          <div className="text-sm font-medium opacity-75 mb-4">Cheapest transaction</div>
          <div>
            <span className="text-3xl font-bold translate-y-[1px]">${(formatGasCost(sortedTransactions[sortedTransactions.length - 1]) * ethPrice).toFixed(4)}</span>
            <div className="flex gap-1 items-center">
              {(() => {
                const chain = chains.find(chain => chain.id === sortedTransactions[sortedTransactions.length - 1].chain_id);
                if (!chain?.icon?.url) {
                  return null;
                }
                return (
                  <img src={resolveScheme({ uri: chain.icon?.url, client: ThirdwebClient })} className="size-4 rounded-full" />
                );
              })()}
              <div className="text-sm font-medium opacity-75">{shortenHex(sortedTransactions[sortedTransactions.length - 1].hash)}</div>
            </div>
          </div>
        </MotionDiv>
        <div className="border-t-2 border-dashed w-full" />
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-4 flex flex-col items-start justify-between h-32 w-full lg:w-64">
          <div className="text-sm font-medium opacity-75 mb-4">Most expensive chain</div>
          <div>
            <div className="flex gap-1 items-end">
              <span className="text-3xl font-bold translate-y-[1px]">${(sortedChains[0].gasUsed / sortedChains[0].transactions.length * ethPrice).toFixed(4)}</span>
              <span className="text-base font-medium opacity-75">/tx</span>
            </div>
            <div className="flex gap-1 items-center">
              {(() => {
                const chain = chains.find(chain => chain.id === sortedChains[0].id);
                if (!chain?.icon?.url) {
                  return null;
                }
                return (
                  <img src={resolveScheme({ uri: chain.icon?.url, client: ThirdwebClient })} className="size-4 rounded-full" />
                );
              })()}
              <div className="text-sm font-medium opacity-75">{sortedChains[0].name}</div>
            </div>
          </div>
        </MotionDiv>
        <div className="border-t-2 border-dashed w-full" />
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0 }}
          className="p-4 flex flex-col items-start justify-between h-32 w-full lg:w-64">
          <div className="text-sm font-medium opacity-75 mb-4">Cheapest chain</div>
          <div>
            <div className="flex gap-1 items-end">
              <span className="text-3xl font-bold translate-y-[1px]">${(sortedChains[sortedChains.length - 1].gasUsed / sortedChains[sortedChains.length - 1].transactions.length * ethPrice).toFixed(4)}</span>
              <span className="text-base font-medium opacity-75">/tx</span>
            </div>
            <div className="flex gap-1 items-center">
              {(() => {
                const chain = chains.find(chain => chain.id === sortedChains[sortedChains.length - 1].id);
                if (!chain?.icon?.url) {
                  return null;
                }
                return (
                  <img src={resolveScheme({ uri: chain.icon?.url, client: ThirdwebClient })} className="size-4 rounded-full" />
                );
              })()}
              <div className="text-sm font-medium opacity-75">{sortedChains[sortedChains.length - 1].name}</div>
            </div>
          </div>
        </MotionDiv>
      </div>
      <div className="flex w-full justify-between items-center gap-2 pt-6 lg:max-w-4xl">
        <LinkButton href={`/transactions?addresses=${addresses.join(",")}`}>
          <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-all duration-200" />
          Previous
        </LinkButton>

        <LinkButton href={`/chains?addresses=${addresses.join(",")}`}>
          Next <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-all duration-200" />
        </LinkButton>
      </div>
    </div>
  );
}
