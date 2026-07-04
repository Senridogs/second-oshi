import type { Metadata } from "next";
import Script from "next/script";
import { Zen_Maru_Gothic, Noto_Sans_JP } from "next/font/google";
import { getSiteUrl } from "@/lib/siteUrl";
import { GA_ID } from "@/lib/analytics";
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

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
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
        {/* GA4: NEXT_PUBLIC_GA_ID 設定時のみ読み込む（未設定なら何も出力しない） */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
