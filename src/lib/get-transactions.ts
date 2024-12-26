"use server";
import { Result, ok, err } from "neverthrow";
import { Address } from "thirdweb";
import { Transaction } from "~/types/Transaction";

const SUPPORTED_CHAINS = [8453, 466, 1, 480, 8333, 42161];

export async function getTransactions(addresses: readonly Address[]) {
  const addressChainPairs = addresses.map(address => SUPPORTED_CHAINS.map(chain => [address, chain] as const)).flat();

  const chainTransactionResults = await Promise.all(addressChainPairs.map(([address, chain]) => getTransactionsForChain(address, chain)));

  if (chainTransactionResults.some(result => result.isErr())) {
    return err(chainTransactionResults.find(result => result.isErr())!.error);
  }

  const chainTransactions = chainTransactionResults.filter(result => result.isOk()).map(result => result.value);
  const transactions = chainTransactions.flat();

  return ok(transactions);
}

const txCache = new Map<string, Transaction<number>[]>();
async function getTransactionsForChain<ChainId extends number>(address: string, chain: ChainId): Promise<Result<Transaction<ChainId>[], string>> {
  const cacheKey = `${address}-${chain}`;
  if (txCache.has(cacheKey)) {
    return ok(txCache.get(cacheKey) as Transaction<ChainId>[]);
  }

  let data: Transaction<ChainId>[] = [];
  let batchLength = 0;
  let page = 1;
  do {
    const result = await fetch(`https://${chain}.insight.thirdweb.com/v1/transactions?filter_block_timestamp_gt=1704067200&filter_from_address=${address}&limit=250&page=${page}`, {
      headers: {
        "x-secret-key": process.env.THIRDWEB_SECRET_KEY,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    if (!result.ok) {
      const error = await result.text();
      console.error(error);
      return err(error);
    }

    const batch = await result.json();
    batchLength = batch.data.length;
    data = [...data, ...batch.data];
    page++;
  } while (batchLength === 250);

  txCache.set(cacheKey, data);

  return ok(data);
}
