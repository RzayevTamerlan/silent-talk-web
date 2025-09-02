import { HttpError } from '@infra/api/HttpError.ts';
import type { BackendErrorResponse } from '@infra/api/IBackendError.ts';
import { deepTrim } from '@infra/shared/utils/deepTrim.ts';
import { getAccessToken } from '@infra/shared/utils/getAccessToken.ts';
import { removeEmptyParams } from '@infra/shared/utils/removeEmptyParams.ts';
import removeFalsyObjKeys from '@infra/shared/utils/removeFalsyObjKeys.ts';
import { stringify } from '@infra/shared/utils/stringify.ts';
import axios, { AxiosError, type InternalAxiosRequestConfig, type Method } from 'axios';

console.log("Backend API URL:", import.meta.env.VITE_BACKEND_API);

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API as string,
  timeout: 2147483646,
});

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

api.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
    const accessToken: string = getAccessToken();

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
);

type HttpParams = Record<string, unknown>;

type HttpProps<D = unknown> = {
  url: string;
  params?: HttpParams;
  method?: Method;
  data?: D;
  headers?: Record<string, string>;
};

export const http = async <T, D = unknown>({
  url,
  params = {},
  headers = {},
  method = 'GET',
  data,
}: HttpProps<D>): Promise<T> => {
  const filteredParams = removeFalsyObjKeys(params);

  const query = filteredParams
    ? `?${stringify({
        ...params,
      })}`
    : '';

  const emptyParamsRemoved = removeEmptyParams(query);

  try {
    const mergedHeaders = { ...DEFAULT_HEADERS, ...headers };
    const contentType = mergedHeaders['Content-Type'];

    let processedData = data;
    if (contentType === 'application/json' && data !== undefined) {
      processedData = deepTrim(data);
    }

    const response = await api.request<T>({
      url: `${url}${emptyParamsRemoved}`,
      method,
      headers: mergedHeaders,
      data: processedData,
    });

    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      const error = e as AxiosError<BackendErrorResponse>;
      throw new HttpError(
        error.response?.data?.message || ['Unexpected error'],
        error.response?.status || 500,
      );
    }

    throw new HttpError(['Unexpected error'], 500);
  }
};
