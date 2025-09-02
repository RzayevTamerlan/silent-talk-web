export function stringify(
  params: Record<string, unknown>,
  options: {
    encode?: boolean;
    arrayFormat?: 'none' | 'comma' | 'bracket' | 'index';
    skipEmpty?: boolean;
  } = {},
): string {
  const { encode = true, arrayFormat = 'none', skipEmpty = true } = options;

  const encodeValue = (value: string) => (encode ? encodeURIComponent(value) : value);

  const processArray = (key: string, arr: unknown[]): string[] => {
    switch (arrayFormat) {
      case 'comma':
        return [`${key}=${arr.join(',')}`];
      case 'bracket':
        return arr.map(item => `${key}[]=${encodeValue(String(item))}`);
      case 'index':
        return arr.map((item, i) => `${key}[${i}]=${encodeValue(String(item))}`);
      default:
        return arr.map(item => `${key}=${encodeValue(String(item))}`);
    }
  };

  const buildQueryString = (obj: Record<string, unknown>, parentKey = ''): string[] => {
    const queryParts: string[] = [];

    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

      const value = obj[key];
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      if (value === undefined || (skipEmpty && (value === null || value === ''))) {
        continue;
      }

      if (Array.isArray(value)) {
        queryParts.push(...processArray(fullKey, value));
      } else if (typeof value === 'object' && value !== null) {
        // Добавляем явное приведение типа для вложенных объектов
        queryParts.push(...buildQueryString(value as Record<string, unknown>, fullKey));
      } else {
        queryParts.push(`${encodeValue(fullKey)}=${encodeValue(String(value))}`);
      }
    }

    return queryParts;
  };

  return buildQueryString(params).join('&');
}
