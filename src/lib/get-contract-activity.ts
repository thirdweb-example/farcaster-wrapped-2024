"use server"
import { ok } from "neverthrow";
import { Address, defineChain, getContract, ThirdwebContract } from "thirdweb";
import { getChainMetadata } from "thirdweb/chains";
import { getContractMetadata } from "thirdweb/extensions/common";
import { Transaction } from "~/types/Transaction";
import { ThirdwebClient } from "~/constants";
import { getTransactions } from "./get-transactions";

export async function getContractActivity(addresses: readonly Address[]) {
  const transactionsResult = await getTransactions(addresses);
  if (transactionsResult.isErr()) {
    return transactionsResult;
  }
  const transactions = transactionsResult.value;


  // We assume transactions with a function selector are contract calls
  const contractCalls = transactions.filter(tx => tx.function_selector && tx.function_selector.startsWith("0x"));
  const uniqueContracts = Array.from(new Set(contractCalls.map(tx => tx.to_address)));
  const contracts = await Promise.all(uniqueContracts.map(contractAddress => {
    const transactions = contractCalls.filter(tx => tx.to_address === contractAddress);
    const contract = getContract({
      address: contractAddress,
      chain: defineChain(transactions[0].chain_id),
      client: ThirdwebClient
    });
    return getContractData(contract, transactions);
  }));

  return ok(contracts.sort((a, b) => b.transactions.length - a.transactions.length));
}

async function getContractData<ChainId extends number = number>(contract: ThirdwebContract, transactions: readonly Transaction<ChainId>[]) {
  const [metadata, chain] = await Promise.all([getContractMetadata({
    contract
  }), getChainMetadata(contract.chain)]);

  return {
    name: metadata.name,
    address: contract.address,
    chain,
    transactions
  };
}
