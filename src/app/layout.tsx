import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkWay — Every Link. One Smarter Way.",
  description:
    "Intelligent Link Management Platform: Campaign DNA, Advanced UTM Builder, Collision-Resistant Short Links, Dynamic QR Identity, Version Ledgers, and Honest Analytics.",
  icons: {
    icon: "/brand/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/brand/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-[#F6F8FC] text-[#111D3B] antialiased">
        {children}
      </body>
    </html>
  );
}
