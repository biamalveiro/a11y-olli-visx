import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${inter.variable} font-sans`}>
      <Component {...pageProps} />
      <Analytics />
    </div>
  );
}
