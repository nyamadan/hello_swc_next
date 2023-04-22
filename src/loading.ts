import { ulid } from "ulid";

type LoadingType = string;

export interface Loading<T extends LoadingType> {
  id: string;
  type: T;
}

export function createLoading<T extends LoadingType>(type: T): Loading<T> {
  return { id: ulid(), type };
}

export function addLoading<T extends LoadingType>(
  loading: Loading<T>
): (loadings: Loading<T>[]) => Loading<T>[] {
  return (loadings) => [...loadings, loading];
}

export function removeLoading<T extends LoadingType>(
  loading: Loading<T>
): (loadings: Loading<T>[]) => Loading<T>[] {
  return (loadings) => loadings.filter((x) => x !== loading);
}

export function includeLoadingType<T extends LoadingType>(
  loadings: Loading<T>[],
  type: Loading<T>["type"]
): boolean {
  return !!loadings.find((x) => x.type === type);
}

export function isLoading<T extends LoadingType>(loadings: Loading<T>[]) {
  return loadings.length > 0;
}
