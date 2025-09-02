export const validateNumberParam = (
  value: string | null | undefined | number,
  defaultValue: number,
): number => {
  if (value === null) return defaultValue;
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : defaultValue;
};
