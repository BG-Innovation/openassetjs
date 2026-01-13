/**
 * KeywordCategories resource
 */

import type { HttpClient } from '../utils/http-client';
import type { KeywordCategory, KeywordCategoryCreate, KeywordCategoryUpdate } from '../types';
import { MergeableResource, type ListOptions } from './base';

export interface KeywordCategoryListOptions extends ListOptions {
  /** Filter by category ID */
  category_id?: number;
  /** Filter by name */
  name?: string;
}

/**
 * KeywordCategories resource for managing keyword categories
 */
export class KeywordCategoriesResource extends MergeableResource<
  KeywordCategory,
  KeywordCategoryCreate,
  KeywordCategoryUpdate
> {
  protected readonly endpoint = '/KeywordCategories';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all keyword categories
   */
  async getAll(options?: KeywordCategoryListOptions, batchSize?: number): Promise<KeywordCategory[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List keyword categories with pagination
   */
  async list(options?: KeywordCategoryListOptions) {
    return super.list(options);
  }
}
