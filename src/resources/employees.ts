/**
 * Employees resource
 */

import type { HttpClient } from '../utils/http-client';
import type {
  Employee,
  EmployeeCreate,
  EmployeeUpdate,
  EmployeeFile,
  EmployeeProject,
  GridData,
} from '../types';
import { BaseResource, type ListOptions, type GetOptions } from './base';

export interface EmployeeListOptions extends ListOptions {
  /** Filter by alive status */
  alive?: 0 | 1;
  /** Include hero image ID in response */
  withHeroImage?: 0 | 1;
}

export interface EmployeeGetOptions extends GetOptions {
  /** Include files expansion */
  files?: 'all';
  /** Include projects expansion */
  projects?: 'all';
  /** Include persons expansion */
  persons?: 'all';
  /** Include hero image ID in response */
  withHeroImage?: 0 | 1;
}

export interface EmployeeFileDisplayOrder {
  id: number;
  display_order: number;
}

/**
 * Employees resource for managing employees
 */
export class EmployeesResource extends BaseResource<Employee, EmployeeCreate, EmployeeUpdate> {
  protected readonly endpoint = '/Employees';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all employees
   */
  async getAll(options?: EmployeeListOptions, batchSize?: number): Promise<Employee[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List employees with pagination
   */
  async list(options?: EmployeeListOptions) {
    return super.list(options);
  }

  /**
   * Get a single employee by ID
   */
  async get(id: number, options?: EmployeeGetOptions): Promise<Employee> {
    return super.get(id, options);
  }

  /**
   * Get files associated with an employee
   * @param employeeId Employee ID
   * @param options Query options
   */
  async getFiles(employeeId: number, options?: ListOptions): Promise<EmployeeFile[]> {
    const response = await this.httpClient.get<EmployeeFile[]>(
      `${this.endpoint}/${employeeId}/Files`,
      this.toRequestOptions(options)
    );
    return response.data;
  }

  /**
   * Update file display order for an employee
   * @param employeeId Employee ID
   * @param files Array of file IDs with display orders
   */
  async updateFileDisplayOrder(
    employeeId: number,
    files: EmployeeFileDisplayOrder[]
  ): Promise<EmployeeFile[]> {
    const response = await this.httpClient.put<EmployeeFile[]>(
      `${this.endpoint}/${employeeId}/Files`,
      files
    );
    return response.data;
  }

  /**
   * Get projects associated with an employee
   * @param employeeId Employee ID
   * @param options Query options
   */
  async getProjects(employeeId: number, options?: ListOptions): Promise<EmployeeProject[]> {
    const response = await this.httpClient.get<EmployeeProject[]>(
      `${this.endpoint}/${employeeId}/Projects`,
      this.toRequestOptions(options)
    );
    return response.data;
  }

  /**
   * Get project roles for an employee
   * @param employeeId Employee ID
   * @param projectId Project ID
   */
  async getProjectRoles(employeeId: number, projectId: number): Promise<EmployeeProject> {
    const response = await this.httpClient.get<EmployeeProject[]>(
      `${this.endpoint}/${employeeId}/Projects/${projectId}`
    );
    return Array.isArray(response.data) ? response.data[0] : response.data;
  }

  /**
   * Update project roles for an employee
   * @param employeeId Employee ID
   * @param projectId Project ID
   * @param roles Grid data for roles
   */
  async updateProjectRoles(
    employeeId: number,
    projectId: number,
    roles: GridData
  ): Promise<EmployeeProject> {
    const response = await this.httpClient.post<EmployeeProject>(
      `${this.endpoint}/${employeeId}/Projects/${projectId}`,
      { id: projectId, roles }
    );
    return response.data;
  }
}
