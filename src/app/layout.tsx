import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import Header from '@/components/Header';

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Fintech Radar | Financial Technology Trends",
  description: "Stay informed about emerging technologies and trends in the financial sector",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <Theme appearance="dark" accentColor="blue" radius="large">
          <Header />
          {children}
        </Theme>
      </body>
    </html>
  );
}
