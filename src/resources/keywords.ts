/**
 * Keywords resource
 */

import type { HttpClient } from '../utils/http-client';
import type { Keyword, KeywordCreate, KeywordUpdate, IdReference } from '../types';
import { MergeableResource, type ListOptions, type GetOptions } from './base';

export interface KeywordListOptions extends ListOptions {
  /** Filter by keyword category ID */
  keyword_category_id?: number;
  /** Filter by name */
  name?: string;
}

export interface KeywordGetOptions extends GetOptions {
  /** Include files expansion */
  files?: 'all';
}

/**
 * Keywords resource for managing keywords
 */
export class KeywordsResource extends MergeableResource<Keyword, KeywordCreate, KeywordUpdate> {
  protected readonly endpoint = '/Keywords';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all keywords
   */
  async getAll(options?: KeywordListOptions, batchSize?: number): Promise<Keyword[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List keywords with pagination
   */
  async list(options?: KeywordListOptions) {
    return super.list(options);
  }

  /**
   * Get a single keyword by ID
   */
  async get(id: number, options?: KeywordGetOptions): Promise<Keyword> {
    return super.get(id, options);
  }

  /**
   * Get files tagged with a keyword
   * @param keywordId Keyword ID
   */
  async getFiles(keywordId: number): Promise<IdReference[]> {
    const keyword = await this.get(keywordId, { files: 'all' });
    return keyword.files ?? [];
  }
}
