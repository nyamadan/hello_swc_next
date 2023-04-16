"use client";

import { assertIfNull } from "@/asserts";
import useSWR from "@/hooks/uswSRW";

interface Props {}

export default function Todos({}: Props) {
  const { data: todos } = useSWR({ url: "/api/todos" });
  assertIfNull(todos);
  return (
    <div>
      {todos.map(({ id, content }) => {
        return <p key={id}>{content}</p>;
      })}
    </div>
  );
}
