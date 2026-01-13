/**
 * Topics resource
 */

import type { HttpClient } from '../utils/http-client';
import type { Topic, TopicCreate, TopicUpdate, IdReference } from '../types';
import { MergeableResource, type ListOptions, type GetOptions } from './base';

export interface TopicListOptions extends ListOptions {
  /** Filter by name */
  name?: string;
  /** Filter by protected status */
  protected?: 0 | 1;
}

export interface TopicGetOptions extends GetOptions {
  /** Include albums expansion */
  albums?: 'all';
}

/**
 * Topics resource for managing topics
 */
export class TopicsResource extends MergeableResource<Topic, TopicCreate, TopicUpdate> {
  protected readonly endpoint = '/Topics';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all topics
   */
  async getAll(options?: TopicListOptions, batchSize?: number): Promise<Topic[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List topics with pagination
   */
  async list(options?: TopicListOptions) {
    return super.list(options);
  }

  /**
   * Get a single topic by ID
   */
  async get(id: number, options?: TopicGetOptions): Promise<Topic> {
    return super.get(id, options);
  }

  /**
   * Get albums in a topic
   * @param topicId Topic ID
   */
  async getAlbums(topicId: number): Promise<IdReference[]> {
    const topic = await this.get(topicId, { albums: 'all' });
    return topic.albums ?? [];
  }
}
