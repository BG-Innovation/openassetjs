/**
 * HTTP client for OpenAsset API
 */

import type { HttpMethod, QueryParams, PaginatedResponse, ResponseHeaders } from '../types';
import { createErrorFromStatus, OpenAssetError } from './errors';

/**
 * Authentication configuration
 */
export interface AuthConfig {
  /** Token ID from OpenAsset */
  tokenId: string;
  /** Token string from OpenAsset */
  tokenString: string;
}

/**
 * HTTP client configuration
 */
export interface HttpClientConfig {
  /** Base URL for the OpenAsset instance (e.g., https://your-domain.openasset.com) */
  baseUrl: string;
  /** Authentication configuration */
  auth: AuthConfig;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Custom headers to include in all requests */
  headers?: Record<string, string>;
}

/**
 * Request options
 */
export interface RequestOptions {
  /** Query parameters */
  params?: QueryParams & Record<string, unknown>;
  /** Request body */
  body?: unknown;
  /** Additional headers */
  headers?: Record<string, string>;
  /** Request timeout override */
  timeout?: number;
  /** Noun expansions (e.g., { files: 'all', keywords: 'all' }) */
  expand?: Record<string, 'all' | number | number[] | string>;
  /** Remote fields to include */
  remoteFields?: string | string[];
  /** Part numbers for file uploads */
  partNumbers?: string | number[];
}

/**
 * Response with headers
 */
export interface HttpResponse<T> {
  data: T;
  headers: ResponseHeaders;
  status: number;
}

/**
 * Build query string from params object
 */
function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  const processValue = (key: string, value: unknown): void => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      // Handle arrays - either as comma-separated or indexed
      if (value.length === 0) return;

      // For simple arrays, use comma-separated values
      if (value.every((v) => typeof v === 'string' || typeof v === 'number')) {
        searchParams.append(key, value.join(','));
      } else {
        // For complex arrays, use indexed notation
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            Object.entries(item).forEach(([subKey, subValue]) => {
              searchParams.append(`${key}[${index}][${subKey}]`, String(subValue));
            });
          } else {
            searchParams.append(`${key}[]`, String(item));
          }
        });
      }
    } else if (typeof value === 'object' && value !== null) {
      // Handle nested objects
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (subKey === '-or' || subKey === '-and') {
          processValue(`${key}[${subKey}]`, subValue);
        } else {
          processValue(`${key}[${subKey}]`, subValue);
        }
      });
    } else {
      searchParams.append(key, String(value));
    }
  };

  Object.entries(params).forEach(([key, value]) => {
    processValue(key, value);
  });

  return searchParams.toString();
}

/**
 * HTTP client for making requests to the OpenAsset API
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly auth: AuthConfig;
  private readonly timeout: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: HttpClientConfig) {
    // Remove trailing slash from base URL
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.auth = config.auth;
    this.timeout = config.timeout ?? 30000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...config.headers,
    };
  }

  /**
   * Get the authorization header value
   */
  private getAuthHeader(): string {
    return `OATU ${this.auth.tokenId}:${this.auth.tokenString}`;
  }

  /**
   * Build the full URL with query parameters
   */
  private buildUrl(endpoint: string, options?: RequestOptions): string {
    const url = `${this.baseUrl}/REST/1${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const params: Record<string, unknown> = {};

    // Add query params
    if (options?.params) {
      Object.assign(params, options.params);
    }

    // Add noun expansions
    if (options?.expand) {
      Object.entries(options.expand).forEach(([key, value]) => {
        params[key] = value;
      });
    }

    // Add remote fields
    if (options?.remoteFields) {
      params.remoteFields = Array.isArray(options.remoteFields)
        ? options.remoteFields.join(',')
        : options.remoteFields;
    }

    // Add part numbers for file uploads
    if (options?.partNumbers) {
      params.partNumbers = Array.isArray(options.partNumbers)
        ? options.partNumbers.join(',')
        : options.partNumbers;
    }

    const queryString = buildQueryString(params);
    return queryString ? `${url}?${queryString}` : url;
  }

  /**
   * Parse response headers
   */
  private parseResponseHeaders(headers: Headers): ResponseHeaders {
    const responseHeaders: ResponseHeaders = {};

    const headerMap: Record<string, keyof ResponseHeaders> = {
      'x-sessionkey': 'X-SessionKey',
      'x-full-results-count': 'X-Full-Results-Count',
      'x-display-results-count': 'X-Display-Results-Count',
      'x-offset': 'X-Offset',
      'x-timing': 'X-Timing',
      'x-username': 'X-Username',
      'x-user-id': 'X-User-Id',
      'x-openasset-version': 'X-OpenAsset-Version',
      'x-ignored-fields': 'X-Ignored-Fields',
    };

    headers.forEach((value, key) => {
      const normalizedKey = key.toLowerCase();
      if (headerMap[normalizedKey]) {
        responseHeaders[headerMap[normalizedKey]] = value;
      }
    });

    return responseHeaders;
  }

  /**
   * Make an HTTP request
   */
  async request<T>(method: HttpMethod, endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    const url = this.buildUrl(endpoint, options);

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      Authorization: this.getAuthHeader(),
      ...options?.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options?.timeout ?? this.timeout);

    try {
      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      if (options?.body && method !== 'GET' && method !== 'HEAD') {
        fetchOptions.body = JSON.stringify(options.body);
      }

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      const responseHeaders = this.parseResponseHeaders(response.headers);

      // Handle HEAD requests (no body)
      if (method === 'HEAD') {
        return {
          data: {} as T,
          headers: responseHeaders,
          status: response.status,
        };
      }

      // Parse response body
      let data: T;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = (await response.json()) as T;
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text) as T;
        } catch {
          data = text as unknown as T;
        }
      }

      // Handle error responses
      if (!response.ok) {
        const errorMessage = typeof data === 'object' && data !== null && 'message' in data
          ? String((data as Record<string, unknown>).message)
          : `Request failed with status ${response.status}`;
        throw createErrorFromStatus(response.status, errorMessage, data);
      }

      return {
        data,
        headers: responseHeaders,
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof OpenAssetError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new OpenAssetError('Request timeout', undefined, undefined);
        }
        throw new OpenAssetError(error.message, undefined, undefined);
      }

      throw new OpenAssetError('Unknown error occurred', undefined, undefined);
    }
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('GET', endpoint, options);
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('POST', endpoint, { ...options, body });
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', endpoint, { ...options, body });
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', endpoint, options);
  }

  /**
   * Make a MERGE request
   */
  async merge<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('MERGE', endpoint, { ...options, body });
  }

  /**
   * Make a HEAD request
   */
  async head(endpoint: string, options?: RequestOptions): Promise<HttpResponse<void>> {
    return this.request<void>('HEAD', endpoint, options);
  }

  /**
   * Get all items with automatic pagination
   */
  async getAll<T>(
    endpoint: string,
    options?: RequestOptions,
    batchSize: number = 100
  ): Promise<T[]> {
    const results: T[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await this.get<T[]>(endpoint, {
        ...options,
        params: {
          ...options?.params,
          limit: batchSize,
          offset,
        },
      });

      if (Array.isArray(response.data)) {
        results.push(...response.data);

        // Check if we've received all results
        const fullCount = parseInt(response.headers['X-Full-Results-Count'] || '0', 10);
        offset += batchSize;
        hasMore = offset < fullCount && response.data.length === batchSize;
      } else {
        // Single item response, shouldn't happen with getAll
        hasMore = false;
      }
    }

    return results;
  }

  /**
   * Get paginated results
   */
  async getPaginated<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<PaginatedResponse<T>> {
    const response = await this.get<T[]>(endpoint, options);

    return {
      data: Array.isArray(response.data) ? response.data : [response.data],
      fullResultsCount: parseInt(response.headers['X-Full-Results-Count'] || '0', 10),
      displayResultsCount: parseInt(response.headers['X-Display-Results-Count'] || '0', 10),
      offset: parseInt(response.headers['X-Offset'] || '0', 10),
    };
  }
}
