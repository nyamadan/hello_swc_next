"use client";
import { MyRequest, MyResponse } from "@/response/responses";
import _useSWR from "swr";

export default function useSWR<T extends MyRequest>(key: T) {
  return _useSWR<MyResponse[T["url"]]>(key.url);
}
