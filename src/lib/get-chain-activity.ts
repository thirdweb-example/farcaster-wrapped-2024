"use server";
import { Address, defineChain } from "thirdweb";
import { ok } from "neverthrow";
import { getChainMetadata } from "thirdweb/chains";
import { Transaction } from "~/types/Transaction";
import { getTransactions } from "./get-transactions";
import { formatGasCost } from "~/util";

export async function getChainActivity(addresses: readonly Address[]) {
  const transactionsResult = await getTransactions(addresses);
  if (transactionsResult.isErr()) {
    return transactionsResult;
  }
  const transactions = transactionsResult.value;

  const uniqueChains = Array.from(new Set(transactions.map(tx => tx.chain_id)));
  const chains = await Promise.all(uniqueChains.map(chainId => getAcrivityForChain(chainId, transactions.filter(tx => tx.chain_id === chainId))));

  return ok(chains);
}

async function getAcrivityForChain<ChainId extends number = number>(chainId: ChainId, transactions: readonly Transaction<ChainId>[]) {
  const chain = await getChainMetadata(defineChain(chainId));

  return {
    id: chainId,
    name: chain.name,
    icon: chain.icon,
    blockExplorer: chain.explorers?.[0].url,
    gasUsed: transactions.reduce((acc, tx) => acc + formatGasCost(tx), 0),
    transactions,
  };
}
