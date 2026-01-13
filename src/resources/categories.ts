/**
 * Categories resource
 */

import type { HttpClient } from '../utils/http-client';
import type { Category, CategoryUpdate } from '../types';
import { BaseResource, type ListOptions } from './base';

export interface CategoryListOptions extends ListOptions {
  /** Filter by alive status */
  alive?: 0 | 1;
  /** Filter by projects category */
  projects_category?: 0 | 1;
}

/**
 * Categories resource for managing categories
 * Note: Categories cannot be created or deleted via API
 */
export class CategoriesResource extends BaseResource<Category, never, CategoryUpdate> {
  protected readonly endpoint = '/Categories';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all categories
   */
  async getAll(options?: CategoryListOptions, batchSize?: number): Promise<Category[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List categories with pagination
   */
  async list(options?: CategoryListOptions) {
    return super.list(options);
  }

  // Override create/delete methods (not supported)
  async create(): Promise<never> {
    throw new Error('Categories cannot be created via API');
  }

  async createMany(): Promise<never> {
    throw new Error('Categories cannot be created via API');
  }

  async delete(): Promise<never> {
    throw new Error('Categories cannot be deleted via API');
  }

  async deleteMany(): Promise<never> {
    throw new Error('Categories cannot be deleted via API');
  }
}
