import { GetTodosResponse } from "@/response/todo";
import { NextResponse } from "next/server";

export async function GET() {
  const response: GetTodosResponse = [
    { id: "0", content: "買い物", completed: false },
  ];
  return NextResponse.json(response);
}
