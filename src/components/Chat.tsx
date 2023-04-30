"use client";

import {
  ChatGPTMessage,
  ChatGPTMessageType,
  OpenAIResponse,
} from "@/app/api/chat/openai";
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
    content: "Hi! I am a friendly AI assistant. Ask me anything!",
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
        const message = {
          role: "user",
          content: input,
        } as const;
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: user.id,
            messages: [...messages, message].slice(-10) satisfies z.infer<
              typeof ChatGPTMessage
            >[],
          }),
        });

        const data = OpenAIResponse.parse(await response.json());
        if (data.error != null) {
          showErrorToast(data.error.message);
        } else {
          const responseMessages = data.choices.map(
            ({ message: { content, role } }) => ({
              content,
              role: z.enum(["user", "system", "assistant"]).parse(role),
            })
          );
          setMessages((prev) => {
            return [...prev, message, ...responseMessages];
          });
        }
      } catch (e) {
        showErrorToast("Unexpected exception");
      } finally {
        setLoading(removeLoading(loading));
        setInput("");
      }
    },
    [input, isInvalidInput, messages, showErrorToast, user.id]
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
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
