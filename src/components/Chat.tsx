"use client";

import {
  ChatGPTMessage,
  ChatGPTMessageType,
  schemaPostChat,
} from "@/app/api/openai";
import {
  Loading,
  addLoading,
  createLoading,
  includeLoadingType,
  isLoading,
  removeLoading,
} from "@/loading";
import { User } from "@/types/generated/graphql";
import { Button, Input, useToast } from "@chakra-ui/react";
import classNames from "classnames";
import React, { useCallback, useState } from "react";
import z from "zod";

const initialMessages = [
  {
    role: "assistant",
    content: "こんにちは！何でも聞いてください！",
  },
] satisfies ChatGPTMessageType[];

interface Props {
  user: User;
}

export default function Chat({ user }: Props) {
  const toast = useToast();
  const [messages, setMessages] =
    useState<ChatGPTMessageType[]>(initialMessages);
  const [loadings, setLoading] = useState<Loading<"POST_MESSAGE">[]>([]);
  const [input, setInput] = useState("");
  const isInvalidInput = /^\s*$/.test(input);

  const showErrorToast = useCallback(
    (title: string) => {
      toast({
        title,
        status: "error",
        isClosable: true,
        position: "bottom-right",
        duration: 3000,
      });
    },
    [toast]
  );

  const onChangeInput = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (ev) => {
      setInput(ev.target.value);
    },
    []
  );

  const onSubmit = useCallback<React.FormEventHandler>(
    async (ev) => {
      ev.preventDefault();

      if (isInvalidInput) {
        showErrorToast("Please input message");
        return;
      }

      const loading =
        createLoading<(typeof loadings)[number]["type"]>("POST_MESSAGE");
      setLoading(addLoading(loading));

      try {
        const params = schemaPostChat.parse({
          distance: 0.5,
          text: input,
          messages: messages.slice(-10) satisfies z.infer<
            typeof ChatGPTMessage
          >[],
        } satisfies z.infer<typeof schemaPostChat>);
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        if (response.status !== 200) {
          throw new Error("Request failed");
        }

        const { text } = await response.json();
        setMessages((prev) => {
          return [
            ...prev,
            {
              role: "user",
              content: input,
            },
            {
              role: "assistant",
              content: text,
            },
          ];
        });
      } catch (e) {
        showErrorToast("Unexpected exception");
      } finally {
        setLoading(removeLoading(loading));
        setInput("");
      }
    },
    [input, isInvalidInput, messages, showErrorToast]
  );

  return (
    <div>
      <div>
        {messages.map(({ content }, idx) => (
          <p key={idx}>{content}</p>
        ))}
      </div>
      <form onSubmit={onSubmit}>
        <div className={classNames("flex", "flex-row", "max-w-xl")}>
          <Input
            readOnly={isLoading(loadings)}
            value={input}
            onChange={onChangeInput}
          />
          <Button
            className={classNames("flex-grow-0", "w-48")}
            type="submit"
            isLoading={includeLoadingType(loadings, "POST_MESSAGE")}
            loadingText="Processing"
            isDisabled={isLoading(loadings) || isInvalidInput}
          >
            Post Message
          </Button>
        </div>
      </form>
    </div>
  );
}
