/**
 * Groups resource
 */

import type { HttpClient } from '../utils/http-client';
import type { Group, GroupCreate, GroupUpdate, IdReference } from '../types';
import { BaseResource, type ListOptions, type GetOptions } from './base';

export interface GroupListOptions extends ListOptions {
  /** Filter by alive status */
  alive?: 0 | 1;
  /** Filter by hidden status */
  hidden?: 0 | 1;
  /** Filter by default_for_new_users status */
  default_for_new_users?: 0 | 1;
}

export interface GroupGetOptions extends GetOptions {
  /** Include users expansion */
  users?: 'all';
}

/**
 * Groups resource for managing user groups
 */
export class GroupsResource extends BaseResource<Group, GroupCreate, GroupUpdate> {
  protected readonly endpoint = '/Groups';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all groups
   */
  async getAll(options?: GroupListOptions, batchSize?: number): Promise<Group[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List groups with pagination
   */
  async list(options?: GroupListOptions) {
    return super.list(options);
  }

  /**
   * Get a single group by ID
   */
  async get(id: number, options?: GroupGetOptions): Promise<Group> {
    return super.get(id, options);
  }

  /**
   * Get users in a group
   * @param groupId Group ID
   */
  async getUsers(groupId: number): Promise<IdReference[]> {
    const group = await this.get(groupId, { users: 'all' });
    return group.users ?? [];
  }

  /**
   * Add users to a group
   * @param groupId Group ID
   * @param userIds User IDs to add
   */
  async addUsers(groupId: number, userIds: number[]): Promise<void> {
    const users = userIds.map((id) => ({ id }));
    await this.httpClient.post(`${this.endpoint}/${groupId}/Users`, users);
  }

  /**
   * Remove a user from a group
   * @param groupId Group ID
   * @param userId User ID to remove
   */
  async removeUser(groupId: number, userId: number): Promise<void> {
    await this.httpClient.delete(`${this.endpoint}/${groupId}/Users/${userId}`);
  }
}
