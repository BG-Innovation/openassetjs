/**
 * Photographers resource
 */

import type { HttpClient } from '../utils/http-client';
import type { Photographer, PhotographerCreate, PhotographerUpdate } from '../types';
import { MergeableResource, type ListOptions } from './base';

export interface PhotographerListOptions extends ListOptions {
  /** Filter by name */
  name?: string;
}

/**
 * Photographers resource for managing photographers
 */
export class PhotographersResource extends MergeableResource<
  Photographer,
  PhotographerCreate,
  PhotographerUpdate
> {
  protected readonly endpoint = '/Photographers';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all photographers
   */
  async getAll(options?: PhotographerListOptions, batchSize?: number): Promise<Photographer[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List photographers with pagination
   */
  async list(options?: PhotographerListOptions) {
    return super.list(options);
  }
}
