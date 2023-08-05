import { Roboto, Syne, Inter } from "next/font/google";
import localFont from "next/font/local";

export const satoshi = localFont({ src: "Satoshi-Variable.ttf" });

export const syne = Syne({ subsets: ["latin"] });
export const inter = Inter({ subsets: ["latin"] });

export const robot = Roboto({
  subsets: ["latin"],
  weight: ["500"],
});
