/**
 * Users resource
 */

import type { HttpClient } from '../utils/http-client';
import type { User, UserCreate, UserUpdate, IdReference } from '../types';
import { BaseResource, type ListOptions, type GetOptions } from './base';

export interface UserListOptions extends ListOptions {
  /** Filter by alive status */
  alive?: 0 | 1;
  /** Filter by username */
  username?: string;
  /** Filter by email */
  email?: string;
  /** Filter by full name */
  full_name?: string;
  /** Filter by valid status */
  valid?: 0 | 1;
  /** Filter by hidden status */
  hidden?: 0 | 1;
}

export interface UserGetOptions extends GetOptions {
  /** Include groups expansion */
  groups?: 'all';
}

/**
 * Users resource for managing users
 */
export class UsersResource extends BaseResource<User, UserCreate, UserUpdate> {
  protected readonly endpoint = '/Users';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all users
   */
  async getAll(options?: UserListOptions, batchSize?: number): Promise<User[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List users with pagination
   */
  async list(options?: UserListOptions) {
    return super.list(options);
  }

  /**
   * Get a single user by ID
   */
  async get(id: number, options?: UserGetOptions): Promise<User> {
    return super.get(id, options);
  }

  /**
   * Get groups a user belongs to
   * @param userId User ID
   */
  async getGroups(userId: number): Promise<IdReference[]> {
    const user = await this.get(userId, { groups: 'all' });
    return user.groups ?? [];
  }

  /**
   * Get user by username
   * @param username Username to search for
   */
  async getByUsername(username: string): Promise<User | undefined> {
    const users = await this.getAll({ username, textMatching: 'exact' });
    return users[0];
  }

  /**
   * Get user by email
   * @param email Email to search for
   */
  async getByEmail(email: string): Promise<User | undefined> {
    const users = await this.getAll({ email, textMatching: 'exact' });
    return users[0];
  }
}
