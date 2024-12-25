"use client"

import { useWarpcast } from "~/hooks/useWarpcast"

export function ProfilePicture() {
  const { user } = useWarpcast();

  if (!user) return null;

  return <div className="rounded-full size-24 object-center"><img src={user?.pfpUrl} className="rounded-full w-12 h-12" /></div>
}
