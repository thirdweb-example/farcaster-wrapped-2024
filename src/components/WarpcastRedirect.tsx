"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWarpcast } from "~/hooks/useWarpcast";
import { getVerifiedAddresses } from "~/lib/get-verified-addresses";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Redirects the user if they're inside a frame (we'll already have their wallets)
 */
export default function WarpcastRedirect() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useWarpcast();
  const router = useRouter();

  useEffect(() => {
    const redirectWithAddresses = async (fid: number) => {
      const addresses = await getVerifiedAddresses(fid).catch((e) => {
        alert(e);
        return e;
      });
      if (addresses.length > 0) {
        router.replace(`/transactions?addresses=${addresses.join(",")}`);
      } else {
        alert("No verified addresses found for your account.");
        setIsLoading(false);
      }
    };
    if (user?.fid) {
      setIsLoading(true);
      redirectWithAddresses(user?.fid);
    }
  }, [router, user]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return null;
}
