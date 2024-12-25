import { Metadata } from "next";
import WarpcastRedirect from "~/components/WarpcastRedirect";

const appUrl = process.env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/frame.png`,
  button: {
    title: "See yours",
    action: {
      type: "launch_frame",
      name: "Your Year Onchain",
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#000000",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Your Year Onchain",
    openGraph: {
      title: "Your Year Onchain",
      description: "See your top transactions, chains, and contracts for 2024.",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default async function Page() {
  return (<WarpcastRedirect />);
}
