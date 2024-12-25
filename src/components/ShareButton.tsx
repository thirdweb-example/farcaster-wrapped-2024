"use client";

import { useWarpcast } from "~/hooks/useWarpcast";
import { LinkButton } from "./LinkButton";

export function ShareButton({ children, href, ...props }: React.ComponentPropsWithoutRef<"button"> & { href: string }) {
  const { openUrl, user } = useWarpcast();

  // Fallback to a standard link if we're not in a frame
  if (!user) {
    return <LinkButton target="_blank" href={href}>{children}</LinkButton>;
  }

  return (
    <button onClick={() => openUrl(href)} className="bg-foreground text-background rounded-full py-2 px-4 font-semibold flex justify-between items-center gap-1 group relative z-10 transition-all duration-200" {...props}>
      {children}
    </button>
  );
}
