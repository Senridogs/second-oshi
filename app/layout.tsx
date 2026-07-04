import type { Metadata } from "next";
import { Zen_Maru_Gothic, Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const zenMaru = Zen_Maru_Gothic({
  weight: "900",
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-zen-maru",
});

const notoSans = Noto_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-noto-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "セカンド推し診断 〜次に推す国、見つけよう〜",
  description:
    "10問で「第二の祖国」への入国ビザを発行。日本ロスのあなたに、大会最終日まで観る理由を。サッカー知識ゼロでOK。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${zenMaru.variable} ${notoSans.variable}`}>
      <body className="min-h-dvh antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
