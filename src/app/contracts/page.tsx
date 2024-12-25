import React from "react";
import { getAddress, shortenAddress } from "thirdweb/utils";
import { resolveScheme } from "thirdweb/storage";
import { getContractActivity } from "~/lib/get-contract-activity";
import { ThirdwebClient } from "~/constants";
import { LinkButton } from "~/components/LinkButton";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import MotionDiv from "~/components/MotionDiv";

export default async function Contracts({ searchParams }: { searchParams: Promise<{ addresses: string }> }) {
  const addresses = await searchParams.then(params => params.addresses?.split(",").map(address => getAddress(address)) ?? []);

  const contractsResult = await getContractActivity(addresses);
  if (contractsResult.isErr()) {
    return <div>Error: {contractsResult.error}</div>;
  }
  const contracts = contractsResult.value.sort((a, b) => b.transactions.length - a.transactions.length).slice(0, 5);

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
          className="flex justify-start px-12 py-4 mb-12 relative z-10 text-3xl font-bold relative z-10">
          Your top contracts
        </MotionDiv>
        <div className="flex justify-end px-12 py-2 relative z-10 text-sm opacity-75">
          Transactions
        </div>
        <div className="border-t-2 border-dashed w-full" />
        {contracts?.map((contract, index) => (
          <Link key={contract.address} href={`${contract.chain.explorers?.[0].url}/address/${contract.address}`} className="cursor-pointer" target="_blank">
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="text-xl relative z-10 font-medium flex px-12 py-4 flex-row justify-between">
              <div className="flex gap-2 items-center">{contract.chain.icon && <img className="size-4" src={resolveScheme({ client: ThirdwebClient, uri: contract.chain.icon.url })} width={contract.chain.icon.width} height={contract.chain.icon.height} />}<span className="truncate max-w-[250px]">{contract.name || shortenAddress(contract.address)}</span></div>
              <div>{contract.transactions.length}</div>
            </MotionDiv>
            {index < contracts.length - 1 && <div className="border-t-2 border-dashed w-full" />}
          </Link>
        ))}
        <div className="border-t-2 border-dashed w-full" />
      </div>
      <div className="flex w-full justify-between items-center gap-2 p-6 max-w-lg">
        <LinkButton href={`/chains?addresses=${addresses.join(",")}`}>
          <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-all duration-200" />
          Previous
        </LinkButton>

        <LinkButton href={`/summary?addresses=${addresses.join(",")}`}>
          Next <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-all duration-200" />
        </LinkButton>
      </div>
    </div>
  );
}
