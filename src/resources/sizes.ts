/**
 * Sizes resource
 */

import type { HttpClient } from '../utils/http-client';
import type { Size, SizeCreate, SizeUpdate } from '../types';
import { BaseResource, type ListOptions } from './base';

export interface SizeListOptions extends ListOptions {
  /** Filter by alive status */
  alive?: 0 | 1;
  /** Filter by original status */
  original?: 0 | 1;
  /** Filter by file format */
  file_format?: string;
}

/**
 * Sizes resource for managing image sizes
 */
export class SizesResource extends BaseResource<Size, SizeCreate, SizeUpdate> {
  protected readonly endpoint = '/Sizes';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all sizes
   */
  async getAll(options?: SizeListOptions, batchSize?: number): Promise<Size[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List sizes with pagination
   */
  async list(options?: SizeListOptions) {
    return super.list(options);
  }

  /**
   * Get the original size
   */
  async getOriginal(): Promise<Size | undefined> {
    const sizes = await this.getAll({ original: 1 });
    return sizes[0];
  }

  /**
   * Get sizes that can be used for zip exports
   */
  async getZipSizes(): Promise<Size[]> {
    const sizes = await this.getAll();
    return sizes.filter((s) => s.use_for_zip === 1);
  }
}
