export function assertIfNull<T>(x: T): asserts x is NonNullable<T> {
  if (x == null) {
    throw new Error("Unexpected null value.");
  }
}
