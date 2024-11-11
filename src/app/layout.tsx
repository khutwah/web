import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khutwah Web",
  description: "Khutwah Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}