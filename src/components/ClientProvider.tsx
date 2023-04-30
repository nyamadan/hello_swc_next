"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { SWRConfig } from "swr";

interface Props {
  children: React.ReactNode;
  fallback: Record<string, any>;
  session: Session | null;
}

async function fetcher(body: string) {
  const response = await fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
  const { data } = await response.json();
  return data;
}

export default function ClientProvider({ session, children, fallback }: Props) {
  return (
    <SessionProvider session={session}>
      <SWRConfig value={{ fallback, fetcher, revalidateOnMount: false }}>
        <ChakraProvider>{children}</ChakraProvider>
      </SWRConfig>
    </SessionProvider>
  );
}
