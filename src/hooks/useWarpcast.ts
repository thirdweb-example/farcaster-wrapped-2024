import { useEffect, useMemo, useState } from "react";
import { Account, EIP1193 } from "thirdweb/wallets";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { ThirdwebClient } from "~/constants";

export function useWarpcast() {
  const [context, setContext] = useState<FrameContext>();
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState<Account>();

  const wallet = useMemo(() => {
    if (!isLoading && sdk.wallet) {
      try {
        return EIP1193.fromProvider({ provider: sdk.wallet.ethProvider });
      } catch { }
    }
    return undefined;
  }, [sdk.wallet, isLoading]);

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready({});
    };
    if (sdk && isLoading) {
      load().then(() => setIsLoading(false));
    }
  }, [isLoading]);

  // Autoconnect
  useEffect(() => {
    if (wallet) {
      connect();
    }
  }, [wallet]);

  const connect = async () => {
    if (typeof wallet !== "undefined") {
      wallet.connect({ client: ThirdwebClient }).then(setAccount);
    }
  };

  return { wallet, account, connect, user: context?.user, openUrl: sdk.actions.openUrl, isLoading };
}
