/**
 * Files resource
 */

import type { HttpClient, RequestOptions } from '../utils/http-client';
import type {
  File,
  FileCreate,
  FileCreateResponse,
  FileUpdate,
  FileUploadComplete,
  FieldValue,
  IdReference,
  SizeInfo,
  PaginatedResponse,
} from '../types';
import { BaseResource, type ListOptions, type GetOptions } from './base';

export interface FileListOptions extends ListOptions {
  /** Filter by category ID */
  category_id?: number;
  /** Filter by project ID */
  project_id?: number;
  /** Filter by access level */
  access_level?: number;
  /** Filter by photographer ID */
  photographer_id?: number;
  /** Filter by copyright holder ID */
  copyright_holder_id?: number;
  /** Filter by user ID */
  user_id?: number;
  /** Filter by rank (supports operators: <, <=, >, >=, =) */
  rank?: string | number;
  /** Filter by filename */
  filename?: string;
  /** Filter by original filename */
  original_filename?: string;
  /** Filter by created date (supports operators: <, <=, >, >=, =) */
  created?: string;
  /** Filter by uploaded date (supports operators: <, <=, >, >=, =) */
  uploaded?: string;
  /** Remote fields to include (e.g., 'photographer', 'copyright_holder', 'project_code') */
  remoteFields?: string | string[];
}

export interface FileGetOptions extends GetOptions {
  /** Include fields expansion */
  fields?: 'all';
  /** Include keywords expansion */
  keywords?: 'all';
  /** Include albums expansion */
  albums?: 'all';
  /** Include sizes expansion (can be 'all' or comma-separated size IDs) */
  sizes?: 'all' | string;
  /** Include employees expansion */
  employees?: 'all';
  /** Remote fields to include */
  remoteFields?: string | string[];
}

export interface FileUploadOptions {
  /** Category ID to upload to */
  category_id: number;
  /** Original filename */
  original_filename: string;
  /** Project ID (required for project-based categories) */
  project_id?: number;
  /** File size in bytes (for S3 direct upload) */
  original_filesize?: number;
  /** Part size in bytes for multipart upload (default: 1GB) */
  part_size?: number;
  /** Part numbers to get presigned URLs for */
  partNumbers?: string | number[];
}

/**
 * Files resource for managing files
 */
export class FilesResource extends BaseResource<File, FileCreate, FileUpdate> {
  protected readonly endpoint = '/Files';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all files with automatic pagination
   */
  async getAll(options?: FileListOptions, batchSize?: number): Promise<File[]> {
    // Use smaller batch size for files due to large response size
    return super.getAll(options, batchSize ?? 100);
  }

  /**
   * List files with pagination
   */
  async list(options?: FileListOptions): Promise<PaginatedResponse<File>> {
    const requestOptions: RequestOptions = {};

    if (options) {
      const { remoteFields, ...params } = options;
      requestOptions.params = params;
      if (remoteFields) {
        requestOptions.remoteFields = remoteFields;
      }
    }

    return this.httpClient.getPaginated<File>(this.endpoint, requestOptions);
  }

  /**
   * Get a single file by ID
   */
  async get(id: number, options?: FileGetOptions): Promise<File> {
    return super.get(id, options);
  }

  /**
   * Get file with specific size info
   * @param id File ID
   * @param sizeIds Size IDs to include (or 'all')
   */
  async getWithSizes(id: number, sizeIds: 'all' | number[]): Promise<File & { sizes: SizeInfo[] }> {
    const sizes = sizeIds === 'all' ? 'all' : sizeIds.join(',');
    return super.get(id, { expand: { sizes } }) as Promise<File & { sizes: SizeInfo[] }>;
  }

  /**
   * Generate an image URL for a specific size
   * @param id File ID
   * @param sizeId Size ID
   */
  async getImageUrl(id: number, sizeId: number): Promise<string> {
    const file = await this.getWithSizes(id, [sizeId]);
    const size = file.sizes?.find((s) => s.id === sizeId);
    if (!size) {
      throw new Error(`Size ${sizeId} not found for file ${id}`);
    }
    return `https:${size.http_root}${size.http_relative_path}`;
  }

  /**
   * Initiate file upload (for S3 direct upload)
   * @param options Upload options
   */
  async initiateUpload(options: FileUploadOptions): Promise<FileCreateResponse> {
    const requestOptions: RequestOptions = {};

    if (options.partNumbers) {
      requestOptions.partNumbers = options.partNumbers;
    }

    const body: FileCreate = {
      category_id: options.category_id,
      original_filename: options.original_filename,
      project_id: options.project_id,
      original_filesize: options.original_filesize,
      part_size: options.part_size,
    };

    const response = await this.httpClient.post<FileCreateResponse>(
      this.endpoint,
      body,
      requestOptions
    );
    return response.data;
  }

  /**
   * Get presigned URLs for additional parts
   * @param fileId File ID
   * @param partNumbers Part numbers to get URLs for
   */
  async getPresignedUrls(
    fileId: number,
    partNumbers: number[]
  ): Promise<FileCreateResponse> {
    const response = await this.httpClient.get<FileCreateResponse>(
      `${this.endpoint}/${fileId}`,
      { partNumbers }
    );
    return response.data;
  }

  /**
   * Complete S3 upload
   * @param fileId File ID
   * @param etags ETags from S3 upload responses
   */
  async completeUpload(
    fileId: number,
    etags: Record<number, string> | string[]
  ): Promise<File> {
    const body: FileUploadComplete = {
      id: fileId,
      s3_upload_complete: 1,
      etags,
    };

    const response = await this.httpClient.put<File>(`${this.endpoint}/${fileId}`, body);
    return response.data;
  }

  /**
   * Get fields for a file
   * @param fileId File ID
   */
  async getFields(fileId: number): Promise<FieldValue[]> {
    const file = await this.get(fileId, { expand: { fields: 'all' } });
    return file.fields ?? [];
  }

  /**
   * Update fields for a file
   * @param fileId File ID
   * @param fields Field values to update
   */
  async updateFields(fileId: number, fields: FieldValue[]): Promise<File> {
    const response = await this.httpClient.put<File>(`${this.endpoint}/${fileId}`, { fields });
    return response.data;
  }

  /**
   * Get keywords for a file
   * @param fileId File ID
   */
  async getKeywords(fileId: number): Promise<IdReference[]> {
    const file = await this.get(fileId, { expand: { keywords: 'all' } });
    return file.keywords ?? [];
  }

  /**
   * Add keywords to a file
   * @param fileId File ID
   * @param keywordIds Keyword IDs to add
   */
  async addKeywords(fileId: number, keywordIds: number[]): Promise<void> {
    const keywords = keywordIds.map((id) => ({ id }));
    await this.httpClient.post(`${this.endpoint}/${fileId}/Keywords`, keywords);
  }

  /**
   * Remove a keyword from a file
   * @param fileId File ID
   * @param keywordId Keyword ID to remove
   */
  async removeKeyword(fileId: number, keywordId: number): Promise<void> {
    await this.httpClient.delete(`${this.endpoint}/${fileId}/Keywords/${keywordId}`);
  }

  /**
   * Get albums containing a file
   * @param fileId File ID
   */
  async getAlbums(fileId: number): Promise<IdReference[]> {
    const file = await this.get(fileId, { expand: { albums: 'all' } });
    return file.albums ?? [];
  }

  /**
   * Get employees associated with a file
   * @param fileId File ID
   */
  async getEmployees(fileId: number): Promise<IdReference[]> {
    const file = await this.get(fileId, { expand: { employees: 'all' } });
    return file.employees ?? [];
  }

  /**
   * Associate employees with a file
   * @param fileId File ID
   * @param employeeIds Employee IDs to associate
   */
  async addEmployees(fileId: number, employeeIds: number[]): Promise<void> {
    const employees = employeeIds.map((id) => ({ id }));
    await this.httpClient.post(`${this.endpoint}/${fileId}/Employees`, employees);
  }

  /**
   * Remove an employee association from a file
   * @param fileId File ID
   * @param employeeId Employee ID to remove
   */
  async removeEmployee(fileId: number, employeeId: number): Promise<void> {
    await this.httpClient.delete(`${this.endpoint}/${fileId}/Employees/${employeeId}`);
  }

  /**
   * Rotate a file
   * @param fileId File ID
   * @param degrees Rotation degrees (0, 90, 180, 270)
   */
  async rotate(fileId: number, degrees: 0 | 90 | 180 | 270): Promise<File> {
    return this.update(fileId, { rotate_degrees: degrees });
  }

  /**
   * Update project display order for files
   * @param updates Array of file IDs with display orders
   */
  async updateProjectDisplayOrder(
    updates: { id: number; project_display_order: number }[]
  ): Promise<File[]> {
    const response = await this.httpClient.put<File[]>(this.endpoint, updates);
    return response.data;
  }
}
