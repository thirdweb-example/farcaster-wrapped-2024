"use client";
import { useWarpcast } from "~/hooks/useWarpcast";

/**
 * Sends the ready signal to Warpcast
 */
export default function WarpcastReady() {
  useWarpcast();
  return null;
}
