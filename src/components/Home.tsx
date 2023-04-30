"use client";

import { assertIfNull } from "@/asserts";
import useSWR from "@/hooks/useSWR";
import { GQL_GET_HOME_PAGE } from "@/query/query";
import Link from "next/link";
import Chat from "./Chat";

export default function Home() {
  const { data: page } = useSWR({
    query: GQL_GET_HOME_PAGE,
  });
  assertIfNull(page, "Failed to retrieve page data.");

  const { user } = page.getHomePage;
  assertIfNull(user, "Failed to retrieve user.");

  return (
    <div>
      <p>Hi, {user.name}.</p>
      <Chat user={user} />
      <Link href="/api/auth/signout">Sign out</Link>
    </div>
  );
}
