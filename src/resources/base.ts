/**
 * Base resource class for OpenAsset API resources
 */

import type { HttpClient, RequestOptions } from '../utils/http-client';
import type { QueryParams, PaginatedResponse, BatchResponseItem } from '../types';

/**
 * Options for list operations
 */
export interface ListOptions extends QueryParams {
  /** Noun expansions */
  expand?: Record<string, 'all' | number | number[] | string>;
  /** Remote fields to include */
  remoteFields?: string | string[];
}

/**
 * Options for get operations
 */
export interface GetOptions {
  /** Fields to display in response */
  displayFields?: string | string[];
  /** Noun expansions */
  expand?: Record<string, 'all' | number | number[] | string>;
  /** Remote fields to include */
  remoteFields?: string | string[];
}

/**
 * Base resource class with common CRUD operations
 */
export abstract class BaseResource<
  T,
  TCreate = Partial<T>,
  TUpdate = Partial<T>
> {
  protected readonly httpClient: HttpClient;
  protected abstract readonly endpoint: string;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Convert ListOptions to RequestOptions
   */
  protected toRequestOptions(options?: ListOptions | GetOptions): RequestOptions {
    if (!options) return {};

    const { expand, remoteFields, ...params } = options as ListOptions;

    return {
      params,
      expand,
      remoteFields,
    };
  }

  /**
   * Get all resources with automatic pagination
   * @param options Query options
   * @param batchSize Number of items per batch (default: 100)
   */
  async getAll(options?: ListOptions, batchSize: number = 100): Promise<T[]> {
    return this.httpClient.getAll<T>(this.endpoint, this.toRequestOptions(options), batchSize);
  }

  /**
   * Get resources with pagination
   * @param options Query options
   */
  async list(options?: ListOptions): Promise<PaginatedResponse<T>> {
    return this.httpClient.getPaginated<T>(this.endpoint, this.toRequestOptions(options));
  }

  /**
   * Get a single resource by ID
   * @param id Resource ID
   * @param options Query options
   */
  async get(id: number, options?: GetOptions): Promise<T> {
    const response = await this.httpClient.get<T | T[]>(
      `${this.endpoint}/${id}`,
      this.toRequestOptions(options)
    );
    // API sometimes returns array with single item
    return Array.isArray(response.data) ? response.data[0] : response.data;
  }

  /**
   * Create a new resource
   * @param data Resource data
   */
  async create(data: TCreate): Promise<T> {
    const response = await this.httpClient.post<T>(this.endpoint, data);
    return response.data;
  }

  /**
   * Create multiple resources
   * @param data Array of resource data
   */
  async createMany(data: TCreate[]): Promise<(T & BatchResponseItem)[]> {
    const response = await this.httpClient.post<(T & BatchResponseItem)[]>(this.endpoint, data);
    return response.data;
  }

  /**
   * Update a resource by ID
   * @param id Resource ID
   * @param data Update data
   */
  async update(id: number, data: TUpdate): Promise<T> {
    const response = await this.httpClient.put<T>(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  /**
   * Update multiple resources
   * @param data Array of resources with IDs
   */
  async updateMany(data: (TUpdate & { id: number })[]): Promise<(T & BatchResponseItem)[]> {
    const response = await this.httpClient.put<(T & BatchResponseItem)[]>(this.endpoint, data);
    return response.data;
  }

  /**
   * Delete a resource by ID
   * @param id Resource ID
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Delete multiple resources by IDs
   * @param ids Array of resource IDs
   */
  async deleteMany(ids: number[]): Promise<void> {
    await this.httpClient.delete(this.endpoint, {
      params: { id: ids.join(',') },
    });
  }

  /**
   * Get resource headers only (HEAD request)
   * @param id Optional resource ID
   */
  async head(id?: number): Promise<{ fullResultsCount: number }> {
    const endpoint = id ? `${this.endpoint}/${id}` : this.endpoint;
    const response = await this.httpClient.head(endpoint);
    return {
      fullResultsCount: parseInt(response.headers['X-Full-Results-Count'] || '0', 10),
    };
  }
}

/**
 * Base resource class with merge support
 */
export abstract class MergeableResource<
  T,
  TCreate = Partial<T>,
  TUpdate = Partial<T>
> extends BaseResource<T, TCreate, TUpdate> {
  /**
   * Merge multiple resources into one
   * @param targetId ID of the resource to merge into
   * @param sourceIds IDs of resources to merge from
   */
  async merge(targetId: number, sourceIds: number[]): Promise<T> {
    const body = sourceIds.map((id) => ({ id }));
    const response = await this.httpClient.merge<T>(`${this.endpoint}/${targetId}`, body);
    return response.data;
  }
}
