/**
 * ProjectKeywordCategories resource
 */

import type { HttpClient } from '../utils/http-client';
import type {
  ProjectKeywordCategory,
  ProjectKeywordCategoryCreate,
  ProjectKeywordCategoryUpdate,
} from '../types';
import { MergeableResource, type ListOptions } from './base';

export interface ProjectKeywordCategoryListOptions extends ListOptions {
  /** Filter by name */
  name?: string;
}

/**
 * ProjectKeywordCategories resource for managing project keyword categories
 */
export class ProjectKeywordCategoriesResource extends MergeableResource<
  ProjectKeywordCategory,
  ProjectKeywordCategoryCreate,
  ProjectKeywordCategoryUpdate
> {
  protected readonly endpoint = '/ProjectKeywordCategories';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all project keyword categories
   */
  async getAll(
    options?: ProjectKeywordCategoryListOptions,
    batchSize?: number
  ): Promise<ProjectKeywordCategory[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List project keyword categories with pagination
   */
  async list(options?: ProjectKeywordCategoryListOptions) {
    return super.list(options);
  }
}
