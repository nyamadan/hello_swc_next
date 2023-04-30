import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import Chat from "./Chat";

test("find-button", () => {
  render(
    <Chat
      user={{ name: "Dummy name", id: "dummy id", createdAt: "0000-00-00" }}
    />
  );
  const button = within(screen.getByRole("button")).getByText("Submit");
  expect(button).toBeDefined();
});
