type HttpParams = Record<string, unknown>;

interface ConvertOptions {
  excludeNullish?: boolean;
  excludeEmptyStrings?: boolean;
  excludeEmptyArrays?: boolean;
  arrayStrategy?: 'brackets' | 'repeat' | 'comma';
  maxDepth?: number;
  nestedSeparator?: string;
}

const isPrimitive = (value: unknown): value is string | number | boolean => {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
};

/**
 * Проверяет, является ли значение plain object
 */
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    !(value instanceof RegExp) &&
    !(value instanceof File) &&
    !(value instanceof Blob)
  );
};

/**
 * Конвертирует любую структуру данных в HttpParams
 */
export const convertToHttpParams = (data: unknown, options: ConvertOptions = {}): HttpParams => {
  const {
    excludeNullish = true,
    excludeEmptyStrings = true,
    excludeEmptyArrays = false,
    arrayStrategy = 'brackets',
    maxDepth = 10,
    nestedSeparator = '.',
  } = options;

  const result: HttpParams = {};

  /**
   * Рекурсивная функция для обработки значений
   */
  const processValue = (value: unknown, key: string, depth: number = 0): void => {
    // Проверка максимальной глубины
    if (depth > maxDepth) {
      console.warn(`Maximum depth (${maxDepth}) exceeded for key: ${key}`);
      return;
    }

    // Обработка null и undefined
    if (value === null || value === undefined) {
      if (!excludeNullish) {
        result[key] = value;
      }
      return;
    }

    // Обработка примитивных типов
    if (isPrimitive(value)) {
      // Исключаем пустые строки если нужно
      if (excludeEmptyStrings && value === '') {
        return;
      }
      result[key] = value;
      return;
    }

    // Обработка Date
    if (value instanceof Date) {
      result[key] = value.toISOString();
      return;
    }

    // Обработка File и Blob
    if (value instanceof File || value instanceof Blob) {
      result[key] = value;
      return;
    }

    // Обработка массивов
    if (Array.isArray(value)) {
      // Исключаем пустые массивы если нужно
      if (excludeEmptyArrays && value.length === 0) {
        return;
      }

      switch (arrayStrategy) {
        case 'brackets':
          value.forEach((item, index) => {
            processValue(item, `${key}[${index}]`, depth + 1);
          });
          break;

        case 'repeat':
          value.forEach(item => {
            if (isPrimitive(item) || item instanceof Date) {
              const processedItem = item instanceof Date ? item.toISOString() : item;
              // Создаем массив для повторяющихся ключей
              if (result[key]) {
                if (!Array.isArray(result[key])) {
                  result[key] = [result[key]];
                }
                (result[key] as unknown[]).push(processedItem);
              } else {
                result[key] = [processedItem];
              }
            } else {
              console.warn(
                `Cannot use 'repeat' strategy for non-primitive array item in key: ${key}`,
              );
            }
          });
          break;

        case 'comma': {
          const primitiveItems = value
            .filter(item => isPrimitive(item) || item instanceof Date)
            .map(item => (item instanceof Date ? item.toISOString() : String(item)));

          if (primitiveItems.length > 0) {
            result[key] = primitiveItems.join(',');
          }

          if (primitiveItems.length !== value.length) {
            console.warn(`Some non-primitive items were skipped in comma strategy for key: ${key}`);
          }
          break;
        }
      }
      return;
    }

    // Обработка объектов
    if (isPlainObject(value)) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        const fullKey = `${key}${nestedSeparator}${nestedKey}`;
        processValue(nestedValue, fullKey, depth + 1);
      });
      return;
    }

    // Для всех остальных типов пытаемся преобразовать в строку
    try {
      result[key] = String(value);
    } catch (error) {
      console.warn(`Failed to convert value to string for key: ${key}`, error);
    }
  };

  // Начинаем обработку
  if (isPlainObject(data)) {
    Object.entries(data).forEach(([key, value]) => {
      processValue(value, key);
    });
  } else {
    console.warn('Input data is not a plain object, returning empty params');
  }

  return result;
};

/**
 * Упрощенная версия для базового использования
 */
export const toHttpParams = (data: unknown): HttpParams => {
  return convertToHttpParams(data);
};

/**
 * Предустановленные конфигурации
 */
export const httpParamsPresets = {
  standard: (): ConvertOptions => ({
    excludeNullish: true,
    excludeEmptyStrings: true,
    excludeEmptyArrays: false,
    arrayStrategy: 'brackets',
    maxDepth: 10,
    nestedSeparator: '.',
  }),

  /**
   * Конфигурация для query параметров
   */
  query: (): ConvertOptions => ({
    excludeNullish: true,
    excludeEmptyStrings: true,
    excludeEmptyArrays: true,
    arrayStrategy: 'repeat',
    maxDepth: 3,
    nestedSeparator: '.',
  }),

  /**
   * Конфигурация для form data
   */
  formData: (): ConvertOptions => ({
    excludeNullish: false,
    excludeEmptyStrings: false,
    excludeEmptyArrays: false,
    arrayStrategy: 'brackets',
    maxDepth: 5,
    nestedSeparator: '.',
  }),
};

// Примеры использования:
/*
// Базовое использование
const params1 = toHttpParams({
  page: 1,
  limit: 10,
  search: 'test'
});

// С опциями
const params2 = convertToHttpParams({
  filters: {
    category: ['tech', 'science'],
    date: new Date(),
    active: true
  },
  pagination: {
    page: 1,
    size: 20
  }
}, {
  arrayStrategy: 'comma',
  nestedSeparator: '_'
});

// С предустановками
const params3 = convertToHttpParams(data, httpParamsPresets.query());
*/
