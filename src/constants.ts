import { createThirdwebClient } from "thirdweb";

// This will use your secret key on the server, your client ID on the client
export const ThirdwebClient = createThirdwebClient(
  process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
    ? {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      }
    : {
        secretKey: process.env.THIRDWEB_SECRET_KEY as string,
    }
);
