"use client";

import React from "react";
import { SWRConfig } from "swr";

interface Props {
  children: React.ReactNode;
  fallback?: { [K in string]: any };
}

async function fetcher(url: string) {
  const response = await fetch(url);
  return await response.json();
}

export default function SWRProvider({ children, fallback }: Props) {
  return <SWRConfig value={{ fallback, fetcher }}>{children}</SWRConfig>;
}
