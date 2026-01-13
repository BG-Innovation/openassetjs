/**
 * Albums resource
 */

import type { HttpClient } from '../utils/http-client';
import type { Album, AlbumCreate, AlbumUpdate, IdReference } from '../types';
import { MergeableResource, type ListOptions, type GetOptions } from './base';

export interface AlbumListOptions extends ListOptions {
  /** Filter by user ID */
  user_id?: number;
  /** Filter by company album */
  company_album?: 0 | 1;
  /** Filter by shared album */
  shared_album?: 0 | 1;
}

export interface AlbumGetOptions extends GetOptions {
  /** Include groups expansion */
  groups?: 'all';
  /** Include projects expansion */
  projects?: 'all';
  /** Include topics expansion */
  topics?: 'all';
  /** Include users expansion */
  users?: 'all';
}

/**
 * Albums resource for managing albums
 */
export class AlbumsResource extends MergeableResource<Album, AlbumCreate, AlbumUpdate> {
  protected readonly endpoint = '/Albums';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all albums with optional filtering
   */
  async getAll(options?: AlbumListOptions, batchSize?: number): Promise<Album[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List albums with pagination
   */
  async list(options?: AlbumListOptions) {
    return super.list(options);
  }

  /**
   * Get a single album by ID
   */
  async get(id: number, options?: AlbumGetOptions): Promise<Album> {
    return super.get(id, options);
  }

  /**
   * Add files to an album
   * @param albumId Album ID
   * @param fileIds File IDs to add
   */
  async addFiles(albumId: number, fileIds: number | number[]): Promise<Album> {
    return this.update(albumId, { files: fileIds });
  }

  /**
   * Get files in an album
   * @param albumId Album ID
   * @param options Query options
   */
  async getFiles(albumId: number, options?: ListOptions): Promise<IdReference[]> {
    const response = await this.httpClient.get<IdReference[]>(
      `${this.endpoint}/${albumId}/Files`,
      this.toRequestOptions(options)
    );
    return response.data;
  }
}
