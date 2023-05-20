"use client";

import {
  Loading,
  addLoading,
  createLoading,
  includeLoadingType,
  isLoading,
  removeLoading,
} from "@/loading";
import { Button, Input, useToast } from "@chakra-ui/react";
import classNames from "classnames";
import React, { useCallback, useState } from "react";

interface Props {}

export default function PostEmbedding({}: Props) {
  const toast = useToast();
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
        await fetch("/api/embedding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "url",
            url: input,
          }),
        });
      } catch (e) {
        showErrorToast("Unexpected exception");
      } finally {
        setLoading(removeLoading(loading));
        setInput("");
      }
    },
    [input, isInvalidInput, showErrorToast]
  );

  return (
    <div>
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
            Post Embedding
          </Button>
        </div>
      </form>
    </div>
  );
}
