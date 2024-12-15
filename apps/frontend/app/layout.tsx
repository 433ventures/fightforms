import type { Metadata } from "next";
import localFont from "next/font/local";

import AppConfigContextProvider from '@app/contexts/config/provider';
import ApolloProvider from '@app/contexts/apollo/provider';
import config from '@app/contexts/config/config';

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FightForms",
  description: "FightForms demo app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppConfigContextProvider config={config}>
      <ApolloProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
          </body>
        </html>
      </ApolloProvider>
    </AppConfigContextProvider>
  );
}
