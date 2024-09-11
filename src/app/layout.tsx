import "@/styles/globals.css";

import { inter as fontSans } from "@/styles/fonts";

import { cn } from "@/lib/utils";
import type { Metadata } from 'next'

/**
 * @param layoutPros - The root layout component props
 * @param layoutPros.children - The layout children
 * @returns The root layout component
 */


export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.className,
        )}
      >
        {children}
      </body>
    </html>
  );
}
