"use client";

import React from "react";
import { SWRConfig } from "swr";

interface Props {
  children: React.ReactNode;
  fallback?: Record<string, any>;
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

export default function SWRProvider({ children, fallback }: Props) {
  return (
    <SWRConfig value={{ fallback, fetcher, revalidateOnMount: false }}>
      {children}
    </SWRConfig>
  );
}
