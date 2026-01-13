/**
 * AspectRatios resource
 */

import type { HttpClient } from '../utils/http-client';
import type { AspectRatio } from '../types';
import { BaseResource, type ListOptions } from './base';

/**
 * AspectRatios resource (read-only)
 */
export class AspectRatiosResource extends BaseResource<AspectRatio, never, never> {
  protected readonly endpoint = '/AspectRatios';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all aspect ratios
   */
  async getAll(options?: ListOptions, batchSize?: number): Promise<AspectRatio[]> {
    return super.getAll(options, batchSize);
  }

  // Override write methods to throw errors (read-only resource)
  async create(): Promise<never> {
    throw new Error('AspectRatios is a read-only resource');
  }

  async createMany(): Promise<never> {
    throw new Error('AspectRatios is a read-only resource');
  }

  async update(): Promise<never> {
    throw new Error('AspectRatios is a read-only resource');
  }

  async updateMany(): Promise<never> {
    throw new Error('AspectRatios is a read-only resource');
  }

  async delete(): Promise<never> {
    throw new Error('AspectRatios is a read-only resource');
  }

  async deleteMany(): Promise<never> {
    throw new Error('AspectRatios is a read-only resource');
  }
}
