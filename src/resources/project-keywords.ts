/**
 * ProjectKeywords resource
 */

import type { HttpClient } from '../utils/http-client';
import type { ProjectKeyword, ProjectKeywordCreate, ProjectKeywordUpdate } from '../types';
import { MergeableResource, type ListOptions } from './base';

export interface ProjectKeywordListOptions extends ListOptions {
  /** Filter by project keyword category ID */
  project_keyword_category_id?: number;
  /** Filter by name */
  name?: string;
}

/**
 * ProjectKeywords resource for managing project keywords
 */
export class ProjectKeywordsResource extends MergeableResource<
  ProjectKeyword,
  ProjectKeywordCreate,
  ProjectKeywordUpdate
> {
  protected readonly endpoint = '/ProjectKeywords';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all project keywords
   */
  async getAll(options?: ProjectKeywordListOptions, batchSize?: number): Promise<ProjectKeyword[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List project keywords with pagination
   */
  async list(options?: ProjectKeywordListOptions) {
    return super.list(options);
  }
}
