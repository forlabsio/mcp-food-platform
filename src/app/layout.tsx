import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { ShellLayout } from "./shell-layout";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "소담 — AI 주문 관리 플랫폼",
  description: "AI 에이전트로 주문하는 새로운 방식",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={urbanist.variable}
      data-theme="dark"
      data-accent="orange"
      data-density="comfortable"
    >
      <body>
        <ShellLayout>{children}</ShellLayout>
      </body>
    </html>
  );
}
