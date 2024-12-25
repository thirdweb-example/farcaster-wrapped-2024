"use client";

import { useWarpcast } from "~/hooks/useWarpcast";
import { LinkButton } from "./LinkButton";

export function ShareButton({ children, ...props }: React.ComponentPropsWithoutRef<"button">) {
  const { openUrl, user } = useWarpcast();
  const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent("Check out my year onchain!")}%0A%0A${encodeURIComponent(process.env.NEXT_PUBLIC_URL!)}%2Fsummary%3Ffid=${user?.fid}`;

  // Fallback to a standard link if we're not in a frame
  if (!user) {
    return <LinkButton target="_blank" href={shareUrl}>{children}</LinkButton>;
  }

  return (
    <button onClick={() => openUrl(shareUrl)} className="bg-foreground text-background rounded-full py-2 px-4 font-semibold flex justify-between items-center gap-1 group relative z-10 transition-all duration-200" {...props}>
      {children}
    </button>
  );
}
