import { Hex } from "thirdweb";

export type Transaction<ChainId extends number = number> = {
  "chain_id": ChainId,
  "hash": Hex,
  "nonce": number,
  "block_hash": Hex,
  "block_number": number,
  "transaction_index": number,
  "from_address": Hex,
  "to_address": Hex,
  "value": number,
  "gas": number,
  "gas_price": number,
  "data": Hex,
  "function_selector": Hex | string | null,
  "max_fee_per_gas": number,
  "max_priority_fee_per_gas": number,
  "transaction_type": number,
  "access_list_json": string,
  "contract_address": Hex | null,
  "gas_used": number | null,
  "cumulative_gas_used": number | null,
  "effective_gas_price": number | null,
  "blob_gas_used": number | null,
  "blob_gas_price": number | null,
  "logs_bloom": Hex | null,
  "status": number | null
};
