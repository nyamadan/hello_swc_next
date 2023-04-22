import React from "react";
import "./globals.css";

export const metadata = {
  title: "Chat",
  description: "Chat",
};

interface Props {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
