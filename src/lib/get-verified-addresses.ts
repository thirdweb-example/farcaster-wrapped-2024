"use server";

export async function getVerifiedAddresses(fid: number) {
  const userResult = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
    headers: {
      "x-api-key": process.env.NEYNAR_API_KEY,
      "content-type": "application/json",
    } as any,
  });

  if (!userResult.ok) {
    const error = await userResult.json();
    throw new Error(error.message);
  }

  const userData = await userResult.json();
  if (userData.users.length === 0) {
    throw new Error(`No users found with fid ${fid}`);
  }

  return userData.users[0].verified_addresses.eth_addresses;
}
