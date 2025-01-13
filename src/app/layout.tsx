import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { AuthProvider } from '@/contexts/AuthContext';
import FeedbackButton from '@/components/FeedbackButton';

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
      <body className={inter.variable} style={{ position: 'relative' }}>
        <Theme appearance="dark" accentColor="blue" radius="large">
          <AuthProvider>
            <div style={{ position: 'relative', zIndex: 1 }}>
              {children}
            </div>
            <div id="portal-root" style={{ position: 'fixed', zIndex: 999999 }}>
              <FeedbackButton />
            </div>
          </AuthProvider>
        </Theme>
      </body>
    </html>
  );
}
