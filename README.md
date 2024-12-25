![Group 427318941](https://github.com/user-attachments/assets/0451b76c-c544-4888-8637-e931d73e8175)

# 🖼️ Thirdweb for Frames

The Thirdweb SDK was intentionally built for as many platforms as possible, and Farcaster frames are no exception! While other libraries require custom, advanced connectors to use Frames, Thirdweb integrates with the Farcaster provider in a single line with our `EIP1193.fromProvider` utility. The Frame wallet can then behave like any other wallet you use Thirdweb with.

[🛠️ Frame Playground](https://warpcast.com/~/developers/frame-playground) (Mobile only)<br/>
[📦 Thirdweb SDK](https://portal.thirdweb.com/connect)<br/>

## ⭐ Start Here

First, clone this repo to your local machine. In most cases, you'll want to fork the repo and clone your own version so you can make edits as desired.

You've cloned your app, now set your environment variables by copying the `.env.example` file and setting a client ID and secret key. Don't set the app url just yet, we'll do that in a minute. For now, head over to the [thirdweb dashboard](https://thirdweb.com/login) to get your client ID and secret key.

> [!IMPORTANT]
> Never expose your secret key! Your client ID isn't meant to be private, but your secret key should never be shared or exposed on the frontend!

Once your environment variables are set, install dependencies and start your app.

```
pnpm i && pnpm dev
```

Your app is now running at http://localhost:3000, but it won't look as expected, because it's not running inside a frame! To preview the app in a frame, you'll need to tunnel it through ngrok (or another tunneling tool) and preview on a mobile device.

If you haven't setup ngrok before, install it [here](https://ngrok.com/our-product/secure-tunnels). Once you have ngrok installed, run `ngrok http http://localhost:3000` to start the tunnel. Copy the URL returned and leave the tunnel running.

> [!IMPORTANT]  
> Okay now it's time to set the app url in your `.env` file! Set it to the ngrok url, but in production you'll want to set it to your deployed URL.

Open the [frames playground](https://warpcast.com/~/developers/frame-playground) on your mobile device (with Warpcast installed). Paste your ngrok url and click "Launch". The splash screen will show for a moment then you'll see your profile appear within the frame. If you've already connected a wallet to Warpcast, you'll automatically be connected in the frame. You'll see your wallet address and be able to send a simple transaction. If not, press "Connect Wallet" and you'll be able to connect any Warpcast-compatible wallet.

<img src="https://github.com/user-attachments/assets/0d667c1d-12a2-4014-988f-d567b4bb7f44" width="300px" alt="" />

Congratulations! You've got your first frame running. Read the next section to understand how it all works (it's surprisingly simple). If you're already an expert, dive into the code and start building your Frame. Once you launch, share it with us in [/thirdweb](https://warpcast.com/~/channel/thirdweb)!

## 🔨 How it works

Thirdweb is by far the easiest way to build frames, and it's not even close. With minimal dependencies and lock-in, you can connect to the Warpcast wallet in a single line:
```ts
import { EIP1193 } from "thirdweb/wallets";

const wallet = EIP1193.fromProvider({ provider: sdk.wallet.ethProvider });
```
> [!TIP]
> You can use the `fromProvider` function with other libraries too! Connect wagmi, Dynamic, Privy, or Magic wallets to your Thirdweb app in a single line.

You now have a wallet ready to use with Thirdweb! Yeah, it's that simple. If you want to connect this wallet to your app's Thirdweb React context like in the example, just wrap this line in the React `connect` function from `useConnect`.

```tsx
import { useConnect } from "thirdweb/react";
import { EIP1193 } from "thirdweb/wallets";

...

connect(async () => {
  const wallet = EIP1193.fromProvider({ provider: sdk.wallet.ethProvider });
  await wallet.connect({ client: ThirdwebClient });
  return wallet;
})
```

That's it! Run this when the Frames SDK loads and you're all set:
```tsx
const connectWallet = useCallback(async () => {
    connect(async () => {
      const wallet = EIP1193.fromProvider({ provider: sdk.wallet.ethProvider });
      await wallet.connect({ client: ThirdwebClient });
      return wallet;
    })
  }, [connect]);

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready({});
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
      if (sdk.wallet) {
        connectWallet();
      }
    }
  }, [isSDKLoaded, connectWallet]);
```

Now send a transaction with your connected wallet. You can do this in React with the `useActiveAccount` hook, or in plain TypeScript:

```ts
const account = wallet.getAccount();
const tx = prepareTransaction({
  chain: mainnet,
  to: "0x...",
  value: 10000n,
  client: ThirdwebClient,
})
sendTransaction({ transaction: tx, account });
```

I know what you're thinking, where are the 30 dependencies I need to install? Where's the 500-line custom connector to get everything to play nicely??? We don't believe in those at Thirdweb.

## 👋 Say Hey
If any of this was confusing to you or you just want to show us what you're building, reach out to use on Farcaster in the [/thirdweb](https://warpcast.com/~/channel/thirdweb) channel!

---

The thirdweb SDK is open source and always looking for contributors! Check it out [here](https://github.com/thirdweb-dev/js).
