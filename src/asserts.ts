export function assertIfNull<T>(x: T, message?: string): asserts x is NonNullable<T> {
  if (x == null) {
    throw new Error(message ?? "Unexpected null value.");
  }
}
