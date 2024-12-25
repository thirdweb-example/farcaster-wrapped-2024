import { toTokens } from "thirdweb";
import { Transaction } from "~/types/Transaction";

export function formatTransactionValue(transaction: Transaction<number>): number {
  return Number(toTokens(BigInt(transaction.value), 18));
}

// Returns the gas used for a transaction in ETH
export function formatGasCost(transaction: Transaction<number>): number {
  const gasUsed = transaction.gas_used ?? transaction.gas;
  const gasPrice = transaction.gas_price;
  // Gas price is in wei originally
  return gasUsed * Number(toTokens(BigInt(gasPrice), 18));
}
