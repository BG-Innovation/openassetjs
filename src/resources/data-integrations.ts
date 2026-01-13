/**
 * DataIntegrations resource
 */

import type { HttpClient } from '../utils/http-client';
import type { DataIntegration, DataIntegrationCreate, DataIntegrationUpdate, DataIntegrationType } from '../types';
import { BaseResource, type ListOptions, type GetOptions } from './base';

export interface DataIntegrationListOptions extends ListOptions {
  /** Filter by alive status */
  alive?: 0 | 1;
  /** Filter by data integration type */
  data_integration_type?: DataIntegrationType;
}

export interface DataIntegrationGetOptions extends GetOptions {
  /** Include employeeKeywordCategories expansion */
  employeeKeywordCategories?: 'all';
  /** Include fields expansion */
  fields?: 'all';
  /** Include keywordCategories expansion */
  keywordCategories?: 'all';
  /** Include projectKeywordCategories expansion */
  projectKeywordCategories?: 'all';
}

/**
 * DataIntegrations resource for managing data integrations
 */
export class DataIntegrationsResource extends BaseResource<
  DataIntegration,
  DataIntegrationCreate,
  DataIntegrationUpdate
> {
  protected readonly endpoint = '/DataIntegrations';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all data integrations
   */
  async getAll(options?: DataIntegrationListOptions, batchSize?: number): Promise<DataIntegration[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List data integrations with pagination
   */
  async list(options?: DataIntegrationListOptions) {
    return super.list(options);
  }

  /**
   * Get a single data integration by ID
   */
  async get(id: number, options?: DataIntegrationGetOptions): Promise<DataIntegration> {
    return super.get(id, options);
  }
}
