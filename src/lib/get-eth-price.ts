"use server";
import { ok, err } from "neverthrow";

export async function getEthPrice() {
  const cmcResult = await fetch("https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=ETH&convert=USD",
    {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
      } as any,
    });

  if (!cmcResult.ok) {
    const error = await cmcResult.text();
    return err(error);
  }

  const data = await cmcResult.json();
  const ethQuote = data.data.ETH.find((quote: any) => quote.symbol === "ETH");
  return ok(ethQuote.quote.USD.price);
}
