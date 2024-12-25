import type { Metadata } from "next";
import { Space_Grotesk } from 'next/font/google'

import "~/app/globals.css";
import { Providers } from "~/components/Providers";
import Image from "next/image";
import WarpcastReady from "~/components/WarpcastReady";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
})


export const metadata: Metadata = {
  title: "Your Year Onchain",
  description: "See your top transactions, chains, and contracts for 2024.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceGrotesk.className}>
      <body className="bg-background text-foreground">
        <Providers>
          <main className="h-screen w-screen relative">
            {children}
            <WarpcastReady />
            <Image className="absolute w-[500px] opacity-10 h-auto -right-12 -bottom-16" src="/thirdweb.svg" width={128} height={128} alt="Thirdweb Logo" />
          </main>
        </Providers>
      </body>
    </html>
  );
}
