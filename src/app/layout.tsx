import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MCP Food Platform",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-sm">
          <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-foreground tracking-tight">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-accent text-white text-xs font-bold">M</span>
              MCP Food
            </Link>
            <div className="flex items-center gap-1 ml-auto">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-md text-sm text-muted hover:text-foreground hover:bg-accent-light transition-colors"
              >
                식당 찾기
              </Link>
              <Link
                href="/admin/restaurants"
                className="px-3 py-1.5 rounded-md text-sm text-muted hover:text-foreground hover:bg-accent-light transition-colors"
              >
                식당 등록
              </Link>
              <Link
                href="/admin/menu"
                className="px-3 py-1.5 rounded-md text-sm text-muted hover:text-foreground hover:bg-accent-light transition-colors"
              >
                메뉴 관리
              </Link>
              <Link
                href="/admin/dashboard"
                className="px-3 py-1.5 rounded-md text-sm text-muted hover:text-foreground hover:bg-accent-light transition-colors"
              >
                주문 현황
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
