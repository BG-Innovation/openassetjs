/**
 * Searches resource
 */

import type { HttpClient } from '../utils/http-client';
import type { Search, SearchCreate, SearchUpdate, IdReferenceWithModify, File, PaginatedResponse } from '../types';
import { BaseResource, type ListOptions, type GetOptions } from './base';

export interface SearchListOptions extends ListOptions {
  /** Filter by saved status */
  saved?: 0 | 1;
  /** Filter by user ID */
  user_id?: number;
  /** Filter by company saved search */
  company_saved_search?: 0 | 1;
  /** Filter by name */
  name?: string;
}

export interface SearchGetOptions extends GetOptions {
  /** Include groups expansion */
  groups?: 'all';
  /** Include users expansion */
  users?: 'all';
}

/**
 * Searches resource for managing saved searches
 */
export class SearchesResource extends BaseResource<Search, SearchCreate, SearchUpdate> {
  protected readonly endpoint = '/Searches';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all searches
   */
  async getAll(options?: SearchListOptions, batchSize?: number): Promise<Search[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List searches with pagination
   */
  async list(options?: SearchListOptions) {
    return super.list(options);
  }

  /**
   * Get a single search by ID
   */
  async get(id: number, options?: SearchGetOptions): Promise<Search> {
    return super.get(id, options);
  }

  /**
   * Get groups with access to a search
   * @param searchId Search ID
   */
  async getGroups(searchId: number): Promise<IdReferenceWithModify[]> {
    const search = await this.get(searchId, { groups: 'all' });
    return search.groups ?? [];
  }

  /**
   * Get users with access to a search
   * @param searchId Search ID
   */
  async getUsers(searchId: number): Promise<IdReferenceWithModify[]> {
    const search = await this.get(searchId, { users: 'all' });
    return search.users ?? [];
  }

  /**
   * Share search with groups
   * @param searchId Search ID
   * @param groups Array of group IDs with modify permissions
   */
  async shareWithGroups(
    searchId: number,
    groups: { id: number; can_modify?: 0 | 1 }[]
  ): Promise<void> {
    await this.httpClient.post(`${this.endpoint}/${searchId}/Groups`, groups);
  }

  /**
   * Share search with users
   * @param searchId Search ID
   * @param users Array of user IDs with modify permissions
   */
  async shareWithUsers(
    searchId: number,
    users: { id: number; can_modify?: 0 | 1 }[]
  ): Promise<void> {
    await this.httpClient.post(`${this.endpoint}/${searchId}/Users`, users);
  }

  /**
   * Execute a search and get results
   * @param searchId Search ID
   * @param options Query options
   */
  async execute(searchId: number, options?: ListOptions): Promise<PaginatedResponse<File>> {
    return this.httpClient.getPaginated<File>(
      `${this.endpoint}/${searchId}/Files`,
      this.toRequestOptions(options)
    );
  }
}
