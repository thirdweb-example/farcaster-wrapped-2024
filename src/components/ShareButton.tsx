"use client";

import { useWarpcast } from "~/hooks/useWarpcast";
import { useMemo } from "react";

export function ShareButton({ children, topChain, topContract, transactions, ...props }: React.ComponentPropsWithoutRef<"button"> & { topChain?: string, topContract?: string, transactions?: number }) {
  const { openUrl, user } = useWarpcast();
  const shareUrl = useMemo(() => `https://warpcast.com/~/compose?text=${encodeURIComponent(`Check out my year onchain!\n\nTransactions: ${transactions}\nMy top chain: ${topChain}\nMy top contract: ${topContract}`)}&embeds[]=${encodeURIComponent(`${process.env.NEXT_PUBLIC_URL}/summary?fid=${user?.fid}`)}`, [user]);

  // Show nothing if we're not in a frame
  if (!user) {
    return <div />;
  }

  return (
    <button disabled={!user} onClick={() => openUrl(shareUrl)} className="disabled:animate-pulse bg-foreground text-background rounded-full py-2 px-4 font-semibold flex justify-between items-center gap-1 group relative z-10 transition-all duration-200" {...props}>
      {children}
    </button>
  );
}
