export interface BackendErrorResponse {
  statusCode: number;
  message: string[];
  timestamp?: string;
  path?: string;
}
