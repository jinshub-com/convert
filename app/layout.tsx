import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Convert Any Image to JPG",
  description: "Convert any image to JPG. Fast, secure, ad-free. Files are converted in-browser for privacy.",
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
