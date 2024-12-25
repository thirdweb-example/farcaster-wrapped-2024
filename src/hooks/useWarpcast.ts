import { useEffect, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";

export function useWarpcast() {
  const [context, setContext] = useState<FrameContext>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready({});
    };
    if (sdk && isLoading) {
      load().then(() => setIsLoading(false));
    }
  }, [isLoading]);

  return { user: context?.user, openUrl: sdk.actions.openUrl, isLoading };
}
