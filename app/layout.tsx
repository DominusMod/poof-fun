import type { Metadata } from "next";
import { Inter, Space_Grotesk, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import FragmentField from "@/components/FragmentField";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { listDocs } from "@/lib/docs";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: "600" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://poof.fun";

/**
 * Pre-paint theme bootstrap. Runs before hydration so the correct
 * [data-theme] is on <html> for first paint — no flashing.
 * Must stay in sync with ThemeProvider's STORAGE_KEY.
 */
const themeBootstrap = `(function(){try{var s=localStorage.getItem('poof-theme');var t=(s==='smoke'||s==='paper')?s:(matchMedia('(prefers-color-scheme: light)').matches?'paper':'smoke');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme',matchMedia('(prefers-color-scheme: light)').matches?'paper':'smoke');}})();`;

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
  const docs = listDocs();
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${fraunces.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <FragmentField />
          <Header docs={docs} />
          <main className="wrap flex-1 py-6 sm:py-8">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
