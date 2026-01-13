/**
 * Projects resource
 */

import type { HttpClient } from '../utils/http-client';
import type {
  Project,
  ProjectCreate,
  ProjectUpdate,
  ProjectEmployee,
  FieldValue,
  IdReference,
  GridData,
  Location,
} from '../types';
import { BaseResource, type ListOptions, type GetOptions } from './base';

export interface ProjectListOptions extends ListOptions {
  /** Filter by alive status */
  alive?: 0 | 1;
  /** Filter by code */
  code?: string;
  /** Filter by name */
  name?: string;
  /** Filter by latitude (supports operators) */
  latitude?: string | number;
  /** Filter by longitude (supports operators) */
  longitude?: string | number;
  /** Include embedded fields in response */
  withEmbeddedFields?: 0 | 1;
  /** Include embedded keywords in response */
  withEmbeddedKeywords?: 0 | 1;
  /** Include location in response */
  withLocation?: 0 | 1;
}

export interface ProjectGetOptions extends GetOptions {
  /** Include fields expansion */
  fields?: 'all';
  /** Include projectKeywords expansion */
  projectKeywords?: 'all';
  /** Include albums expansion */
  albums?: 'all';
  /** Include employees expansion */
  employees?: 'all';
  /** Include embedded fields in response */
  withEmbeddedFields?: 0 | 1;
  /** Include embedded keywords in response */
  withEmbeddedKeywords?: 0 | 1;
  /** Include location in response */
  withLocation?: 0 | 1;
}

/**
 * Projects resource for managing projects
 */
export class ProjectsResource extends BaseResource<Project, ProjectCreate, ProjectUpdate> {
  protected readonly endpoint = '/Projects';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all projects
   */
  async getAll(options?: ProjectListOptions, batchSize?: number): Promise<Project[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List projects with pagination
   */
  async list(options?: ProjectListOptions) {
    return super.list(options);
  }

  /**
   * Get a single project by ID
   */
  async get(id: number, options?: ProjectGetOptions): Promise<Project> {
    return super.get(id, options);
  }

  /**
   * Get fields for a project
   * @param projectId Project ID
   */
  async getFields(projectId: number): Promise<FieldValue[]> {
    const project = await this.get(projectId, { fields: 'all' });
    return project.fields ?? [];
  }

  /**
   * Update fields for a project
   * @param projectId Project ID
   * @param fields Field values to update
   */
  async updateFields(projectId: number, fields: FieldValue[]): Promise<Project> {
    const response = await this.httpClient.put<Project>(`${this.endpoint}/${projectId}`, { fields });
    return response.data;
  }

  /**
   * Get project keywords for a project
   * @param projectId Project ID
   */
  async getProjectKeywords(projectId: number): Promise<IdReference[]> {
    const project = await this.get(projectId, { projectKeywords: 'all' });
    return project.projectKeywords ?? [];
  }

  /**
   * Add project keywords to a project
   * @param projectId Project ID
   * @param keywordIds Project keyword IDs to add
   */
  async addProjectKeywords(projectId: number, keywordIds: number[]): Promise<void> {
    const keywords = keywordIds.map((id) => ({ id }));
    await this.httpClient.post(`${this.endpoint}/${projectId}/ProjectKeywords`, keywords);
  }

  /**
   * Remove a project keyword from a project
   * @param projectId Project ID
   * @param keywordId Project keyword ID to remove
   */
  async removeProjectKeyword(projectId: number, keywordId: number): Promise<void> {
    await this.httpClient.delete(`${this.endpoint}/${projectId}/ProjectKeywords/${keywordId}`);
  }

  /**
   * Get albums associated with a project
   * @param projectId Project ID
   */
  async getAlbums(projectId: number): Promise<IdReference[]> {
    const project = await this.get(projectId, { albums: 'all' });
    return project.albums ?? [];
  }

  /**
   * Get employees associated with a project
   * @param projectId Project ID
   * @param options Query options
   */
  async getEmployees(projectId: number, options?: ListOptions): Promise<ProjectEmployee[]> {
    const response = await this.httpClient.get<ProjectEmployee[]>(
      `${this.endpoint}/${projectId}/Employees`,
      this.toRequestOptions(options)
    );
    return response.data;
  }

  /**
   * Get employee roles for a project
   * @param projectId Project ID
   * @param employeeId Employee ID
   */
  async getEmployeeRoles(projectId: number, employeeId: number): Promise<ProjectEmployee> {
    const response = await this.httpClient.get<ProjectEmployee[]>(
      `${this.endpoint}/${projectId}/Employees/${employeeId}`
    );
    return Array.isArray(response.data) ? response.data[0] : response.data;
  }

  /**
   * Update employee roles for a project
   * @param projectId Project ID
   * @param employeeId Employee ID
   * @param roles Grid data for roles
   */
  async updateEmployeeRoles(
    projectId: number,
    employeeId: number,
    roles: GridData
  ): Promise<ProjectEmployee> {
    const response = await this.httpClient.post<ProjectEmployee>(
      `${this.endpoint}/${projectId}/Employees/${employeeId}`,
      { id: employeeId, roles }
    );
    return response.data;
  }

  /**
   * Update project location
   * @param projectId Project ID
   * @param location Location coordinates
   */
  async updateLocation(projectId: number, location: Location): Promise<Project> {
    return this.update(projectId, { location });
  }

  /**
   * Get files in a project
   * @param projectId Project ID
   * @param options Query options
   */
  async getFiles(projectId: number, options?: ListOptions): Promise<IdReference[]> {
    const response = await this.httpClient.get<IdReference[]>(
      `${this.endpoint}/${projectId}/Files`,
      this.toRequestOptions(options)
    );
    return response.data;
  }
}
