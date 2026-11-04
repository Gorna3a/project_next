import type { Metadata } from "next";
import "./globals.css";
import "./pixel-retro.css";
import { Providers } from "./providers";
import ScrollRestoration from "@/platform/components/ScrollRestoration";

export const metadata: Metadata = {
  title: "PixelCode",
  description: "PixelCode — Learn programming pixel by pixel",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ScrollRestoration />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
