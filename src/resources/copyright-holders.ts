/**
 * CopyrightHolders resource
 */

import type { HttpClient } from '../utils/http-client';
import type { CopyrightHolder, CopyrightHolderCreate, CopyrightHolderUpdate } from '../types';
import { MergeableResource, type ListOptions } from './base';

export interface CopyrightHolderListOptions extends ListOptions {
  /** Filter by copyright policy ID */
  copyright_policy_id?: number;
  /** Filter by name */
  name?: string;
}

/**
 * CopyrightHolders resource for managing copyright holders
 */
export class CopyrightHoldersResource extends MergeableResource<
  CopyrightHolder,
  CopyrightHolderCreate,
  CopyrightHolderUpdate
> {
  protected readonly endpoint = '/CopyrightHolders';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all copyright holders
   */
  async getAll(options?: CopyrightHolderListOptions, batchSize?: number): Promise<CopyrightHolder[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List copyright holders with pagination
   */
  async list(options?: CopyrightHolderListOptions) {
    return super.list(options);
  }

  // CopyrightHolders cannot be deleted via API
  async delete(): Promise<never> {
    throw new Error('CopyrightHolders cannot be deleted via API');
  }

  async deleteMany(): Promise<never> {
    throw new Error('CopyrightHolders cannot be deleted via API');
  }
}
