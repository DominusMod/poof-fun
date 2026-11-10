import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://poof.fun";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "poof.fun — one narrative, three tokens",
  description:
    "poof.fun is a Solana multi-token memecoin launchpad concept. One narrative launches three independent tokens with coordinated buying. Simulation only.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "poof.fun — one narrative, three tokens",
    description:
      "poof.fun is a Solana multi-token memecoin launchpad concept. One narrative launches three independent tokens with coordinated buying. Simulation only.",
    url: "/",
    siteName: "poof.fun",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "poof.fun — one narrative, three tokens",
    description:
      "poof.fun is a Solana multi-token memecoin launchpad concept. One narrative launches three independent tokens with coordinated buying. Simulation only.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="wrap flex-1 py-6 sm:py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
