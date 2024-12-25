import React from "react";
import { getAddress } from "thirdweb/utils";
import { resolveScheme } from "thirdweb/storage";
import { getChainActivity } from "~/lib/get-chain-activity";
import { ThirdwebClient } from "~/constants";
import { LinkButton } from "~/components/LinkButton";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import MotionDiv from "~/components/MotionDiv";

export default async function Page({ searchParams }: { searchParams: Promise<{ addresses: string }> }) {
  const addresses = await searchParams.then(params => params.addresses?.split(",").map(address => getAddress(address)) ?? []);

  const chainsResult = await getChainActivity(addresses);
  if (chainsResult.isErr()) {
    return <div>Error: {chainsResult.error}</div>;
  }
  const chains = chainsResult.value.sort((a, b) => b.transactions.length - a.transactions.length).slice(0, 5);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col w-full max-w-lg relative py-12">
        <div className="absolute top-0 bottom-0 left-8 w-1 h-full border-l-2 border-dashed" />
        <div className="absolute top-0 bottom-0 right-8 w-1 h-full border-r-2 border-dashed" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-transparent to-black" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-black via-transparent to-black" />
        <div className="border-t-2 border-dashed w-full" />
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 flex justify-start px-12 py-4 mb-12 relative z-10 text-3xl font-bold">
          Your top chains
        </MotionDiv>
        <div className="flex justify-end px-12 py-2 relative z-10 text-sm opacity-75">
          Transactions
        </div>
        <div className="border-t-2 border-dashed w-full" />
        {chains?.map((chain, index) => (
          <div key={chain.id}>
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="text-xl relative z-10 font-medium flex px-12 py-4 flex-row justify-between">
              <div className="flex gap-2 items-center">{chain.icon && <img className="size-4" src={resolveScheme({ client: ThirdwebClient, uri: chain.icon.url })} width={chain.icon.width} height={chain.icon.height} />}<span className="truncate max-w-[250px]">{chain.name}</span></div>
              <div>{chain.transactions.length}</div>
            </MotionDiv>
            {index < chains.length - 1 && <div className="border-t-2 border-dashed w-full" />}
          </div>
        ))}
        <div className="border-t-2 border-dashed w-full" />
      </div>
      <div className="p-6 flex w-full justify-between items-center gap-2 max-w-lg">
        <LinkButton href={`/gas?addresses=${addresses.join(",")}`}>
          <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-all duration-200" />
          Previous
        </LinkButton>

        <LinkButton href={`/contracts?addresses=${addresses.join(",")}`}>
          Next <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-all duration-200" />
        </LinkButton>
      </div>
    </div>
  );
}
