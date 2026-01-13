/**
 * CopyrightPolicies resource
 */

import type { HttpClient } from '../utils/http-client';
import type { CopyrightPolicy, CopyrightPolicyCreate, CopyrightPolicyUpdate } from '../types';
import { MergeableResource, type ListOptions } from './base';

export interface CopyrightPolicyListOptions extends ListOptions {
  /** Filter by name */
  name?: string;
}

/**
 * CopyrightPolicies resource for managing copyright policies
 */
export class CopyrightPoliciesResource extends MergeableResource<
  CopyrightPolicy,
  CopyrightPolicyCreate,
  CopyrightPolicyUpdate
> {
  protected readonly endpoint = '/CopyrightPolicies';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all copyright policies
   */
  async getAll(options?: CopyrightPolicyListOptions, batchSize?: number): Promise<CopyrightPolicy[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List copyright policies with pagination
   */
  async list(options?: CopyrightPolicyListOptions) {
    return super.list(options);
  }
}
