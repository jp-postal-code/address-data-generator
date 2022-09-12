type UniqueFn<T> = (value: T) => boolean;

export function isUniqueFactory<T>(): UniqueFn<T> {
  const set = new Set<T>();

  return (value) => {
    const hasValue = set.has(value);

    set.add(value);

    return !hasValue;
  };
}
