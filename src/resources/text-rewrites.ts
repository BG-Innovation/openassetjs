/**
 * TextRewrites resource
 */

import type { HttpClient } from '../utils/http-client';
import type { TextRewrite } from '../types';
import { BaseResource, type ListOptions } from './base';

/**
 * TextRewrites resource (read-only)
 */
export class TextRewritesResource extends BaseResource<TextRewrite, never, never> {
  protected readonly endpoint = '/TextRewrites';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all text rewrites
   */
  async getAll(options?: ListOptions, batchSize?: number): Promise<TextRewrite[]> {
    return super.getAll(options, batchSize);
  }

  // Override write methods to throw errors (read-only resource)
  async create(): Promise<never> {
    throw new Error('TextRewrites is a read-only resource');
  }

  async createMany(): Promise<never> {
    throw new Error('TextRewrites is a read-only resource');
  }

  async update(): Promise<never> {
    throw new Error('TextRewrites is a read-only resource');
  }

  async updateMany(): Promise<never> {
    throw new Error('TextRewrites is a read-only resource');
  }

  async delete(): Promise<never> {
    throw new Error('TextRewrites is a read-only resource');
  }

  async deleteMany(): Promise<never> {
    throw new Error('TextRewrites is a read-only resource');
  }
}
