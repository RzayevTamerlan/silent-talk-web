export function deepTrim<T>(data: T): T {
  if (typeof data === 'string') {
    return data.trim() as T;
  }

  if (Array.isArray(data)) {
    return data.map(item => deepTrim(item)) as unknown as T;
  }

  if (data !== null && typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = deepTrim(value);
    }
    return result as T;
  }

  return data;
}
