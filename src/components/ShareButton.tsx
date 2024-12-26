"use client";

import { useWarpcast } from "~/hooks/useWarpcast";
import { LinkButton } from "./LinkButton";

export function ShareButton({ children, topChain, topContract, transactions, ...props }: React.ComponentPropsWithoutRef<"button"> & { topChain?: string, topContract?: string, transactions?: number }) {
  const { openUrl, user } = useWarpcast();
  const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(`Check out my year onchain!\n\nTransactions: ${transactions}\nMy top chain: ${topChain}\nMy top contract: ${topContract}`)}&embeds[]=${encodeURIComponent(`${process.env.NEXT_PUBLIC_URL}/summary?fid=${user?.fid}`)}`;

  // Fallback to a standard link if we're not in a frame
  if (!user) {
    return <LinkButton target="_blank" href={shareUrl}>{children}</LinkButton>;
  }

  return (
    <button disabled={!user} onClick={() => openUrl(shareUrl)} className="disabled:animate-pulse bg-foreground text-background rounded-full py-2 px-4 font-semibold flex justify-between items-center gap-1 group relative z-10 transition-all duration-200" {...props}>
      {children}
    </button>
  );
}
