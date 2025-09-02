import { HttpError } from '@infra/api/HttpError.ts';
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

export type Refetch<T> = (
  options?: RefetchOptions | undefined,
) => Promise<QueryObserverResult<T, HttpError>>;
