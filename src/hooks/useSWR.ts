"use client";
import { MyRequest, MyResponse } from "@/query/query";
import _useSWR from "swr";

export default function useSWR<T extends MyRequest>(req: T) {
  return _useSWR<MyResponse[T["query"]]>(JSON.stringify(req));
}
