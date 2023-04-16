import SWRProvider from "@/components/SWRProvider";
import { GQL_GET_TODO_LIST } from "@/response/responses";
import fetchGraphQL from "@/server/fetchGraphQL";
import React from "react";
import "./globals.css";

export const metadata = {
  title: "Todo",
  description: "Todo",
};

interface Props {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Props) {
  const responses = await Promise.all([
    fetchGraphQL({ query: GQL_GET_TODO_LIST }),
  ]);

  const fallback: Record<string, any> = {};
  for (const { key, data } of responses) {
    fallback[key] = data;
  }

  return (
    <html lang="en">
      <body>
        <SWRProvider fallback={fallback}>{children}</SWRProvider>
      </body>
    </html>
  );
}
