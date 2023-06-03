"use client";
import {
  ChatGPTMessage,
  ChatGPTMessageType,
  schemaPostChat,
} from "@/app/api/openai";
import { assertIfNull } from "@/asserts";
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
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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
  interface Inputs {
    input: string;
  }

  const { register, handleSubmit, reset, formState } = useForm<Inputs>();

  const toast = useToast();
  const [messages, setMessages] =
    useState<ChatGPTMessageType[]>(initialMessages);
  const [loadings, setLoading] = useState<Loading<"POST_MESSAGE">[]>([]);

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

  const onSubmit: SubmitHandler<Inputs> = useCallback<SubmitHandler<Inputs>>(
    async ({ input }) => {
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

        setMessages((prev) => {
          return [
            ...prev,
            {
              role: "user",
              content: input,
            },
            {
              role: "assistant",
              content: "",
            },
          ];
        });
        const reader = response.body?.getReader();
        assertIfNull(reader);

        const decoder = new TextDecoder("utf8");

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          assertIfNull(value);

          setMessages((prev) => {
            const next = [...prev];
            let i = next.length - 1;
            next[i] = {
              ...prev[i],
              content: prev[i].content + decoder.decode(value),
            };
            return next;
          });
        }
      } catch (e) {
        showErrorToast("Unexpected exception");
      } finally {
        reset();
        setLoading(removeLoading(loading));
      }
    },
    [messages, reset, showErrorToast]
  );

  return (
    <div>
      <div>
        {messages.map(({ content }, idx) => (
          <div className={classNames("whitespace-pre-wrap")} key={idx}>
            {content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={classNames("flex", "flex-row", "max-w-xl")}>
          <Input
            readOnly={isLoading(loadings)}
            {...register("input", { required: true })}
          />
          <Button
            className={classNames("flex-grow-0", "w-48")}
            type="submit"
            isLoading={includeLoadingType(loadings, "POST_MESSAGE")}
            loadingText="Processing"
            isDisabled={isLoading(loadings) || !formState.isValid}
          >
            Post Message
          </Button>
        </div>
      </form>
    </div>
  );
}
