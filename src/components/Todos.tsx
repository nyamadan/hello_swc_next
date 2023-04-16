"use client";

import useSWR from "@/hooks/useSWR";
import { GQL_GET_TODO_LIST } from "@/response/responses";

export default function Todos() {
  const { data } = useSWR({ query: GQL_GET_TODO_LIST });
  const todos = data != null ? data.getTodoList.slice() : [];
  todos.sort((a, b) => (a.id > b.id ? 1 : -1));

  return (
    <div className="flex flex-col gap-y-4 p-4">
      {todos.map(({ id, text, createdAt, status }) => {
        return (
          <div key={id}>
            <ul>
              <li>{id}</li>
              <li>{text}</li>
              <li>{status}</li>
              <li>{createdAt}</li>
            </ul>
          </div>
        );
      })}
    </div>
  );
}
