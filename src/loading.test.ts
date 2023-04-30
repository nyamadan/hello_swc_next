import { expect, test } from "vitest";
import { Loading, addLoading, createLoading, includeLoadingType, isLoading, removeLoading } from "./loading";

test("loading", () => {
  type LoadingType = "A" | "B";
  let loadings: Loading<LoadingType>[] = [];

  const loadingA = createLoading<LoadingType>("A");
  const loadingB = createLoading<LoadingType>("B");
  expect(includeLoadingType(loadings, "A")).toBeFalsy();
  expect(includeLoadingType(loadings, "B")).toBeFalsy();
  expect(isLoading(loadings)).toBeFalsy();

  loadings = addLoading(loadingA)(loadings);
  expect(includeLoadingType(loadings, "A")).toBeTruthy();
  expect(includeLoadingType(loadings, "B")).toBeFalsy();
  expect(isLoading(loadings)).toBeTruthy();

  loadings = addLoading(loadingB)(loadings);
  expect(includeLoadingType(loadings, "A")).toBeTruthy();
  expect(includeLoadingType(loadings, "B")).toBeTruthy();
  expect(isLoading(loadings)).toBeTruthy();

  loadings = removeLoading(loadingB)(loadings);
  expect(includeLoadingType(loadings, "A")).toBeTruthy();
  expect(includeLoadingType(loadings, "B")).toBeFalsy();
  expect(isLoading(loadings)).toBeTruthy();

  loadings = removeLoading(loadingA)(loadings);
  expect(includeLoadingType(loadings, "A")).toBeFalsy();
  expect(includeLoadingType(loadings, "B")).toBeFalsy();
  expect(isLoading(loadings)).toBeFalsy();
});
