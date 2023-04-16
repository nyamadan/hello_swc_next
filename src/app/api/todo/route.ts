import { GetTodoResponse } from "@/response/todo";
import { NextResponse } from "next/server";

export async function GET() {
  const response: GetTodoResponse = {
    id: "0",
    content: "買い物",
    completed: false,
  };
  return NextResponse.json(response);
}
