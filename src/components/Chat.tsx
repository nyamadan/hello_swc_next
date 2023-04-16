"use client";

import { type ChatGPTMessage } from "@/app/api/chat/openai";
import { useCallback, useState } from "react";

export default function Chat() {
  const [lastMessage, setLastMessage] = useState("");
  const onClickPost = useCallback(async () => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: "jldsadsadsa",
        messages: [
          {
            role: "assistant",
            content: "Hi! I am a friendly AI assistant. Ask me anything!",
          },
          { role: "user", content: "Hello!What your name?" },
        ] satisfies ChatGPTMessage[],
      }),
    });

    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let lastMessage = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      lastMessage = lastMessage + chunkValue;
      setLastMessage(lastMessage);
    }
  }, []);

  return (
    <div>
      <button onClick={onClickPost}>POST</button> {lastMessage}
    </div>
  );
}
