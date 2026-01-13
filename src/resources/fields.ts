/**
 * Fields resource
 */

import type { HttpClient } from '../utils/http-client';
import type {
  Field,
  FieldCreate,
  FieldUpdate,
  FieldLookupString,
  FieldType,
  FieldDisplayType,
  GridColumn,
  GridColumnCreate,
  GridColumnUpdate,
} from '../types';
import { BaseResource, type ListOptions, type GetOptions } from './base';

export interface FieldListOptions extends ListOptions {
  /** Filter by alive status */
  alive?: 0 | 1;
  /** Filter by field type */
  field_type?: FieldType;
  /** Filter by field display type */
  field_display_type?: FieldDisplayType;
  /** Filter by built-in status */
  built_in?: 0 | 1;
  /** Filter by required status */
  required?: 0 | 1;
}

export interface FieldGetOptions extends GetOptions {
  /** Include fieldLookupStrings expansion */
  fieldLookupStrings?: 'all';
}

/**
 * Fields resource for managing fields
 */
export class FieldsResource extends BaseResource<Field, FieldCreate, FieldUpdate> {
  protected readonly endpoint = '/Fields';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get all fields
   */
  async getAll(options?: FieldListOptions, batchSize?: number): Promise<Field[]> {
    return super.getAll(options, batchSize);
  }

  /**
   * List fields with pagination
   */
  async list(options?: FieldListOptions) {
    return super.list(options);
  }

  /**
   * Get a single field by ID
   */
  async get(id: number, options?: FieldGetOptions): Promise<Field> {
    return super.get(id, options);
  }

  /**
   * Get field lookup strings (dropdown values) for a field
   * @param fieldId Field ID
   * @param options Query options
   */
  async getFieldLookupStrings(fieldId: number, options?: ListOptions): Promise<FieldLookupString[]> {
    const response = await this.httpClient.get<FieldLookupString[]>(
      `${this.endpoint}/${fieldId}/FieldLookupStrings`,
      this.toRequestOptions(options)
    );
    return response.data;
  }

  /**
   * Get grid columns for a grid field
   * @param fieldId Field ID
   * @param options Query options
   */
  async getGridColumns(fieldId: number, options?: ListOptions): Promise<GridColumn[]> {
    const response = await this.httpClient.get<GridColumn[]>(
      `${this.endpoint}/${fieldId}/GridColumns`,
      this.toRequestOptions(options)
    );
    return response.data;
  }

  /**
   * Create a grid column for a grid field
   * @param fieldId Field ID
   * @param data Grid column data
   */
  async createGridColumn(fieldId: number, data: GridColumnCreate): Promise<GridColumn> {
    const response = await this.httpClient.post<GridColumn>(
      `${this.endpoint}/${fieldId}/GridColumns`,
      data
    );
    return response.data;
  }

  /**
   * Update a grid column
   * @param fieldId Field ID
   * @param columnId Column ID
   * @param data Update data
   */
  async updateGridColumn(
    fieldId: number,
    columnId: number,
    data: GridColumnUpdate
  ): Promise<GridColumn> {
    const response = await this.httpClient.put<GridColumn>(
      `${this.endpoint}/${fieldId}/GridColumns/${columnId}`,
      data
    );
    return response.data;
  }

  /**
   * Delete a grid column
   * @param fieldId Field ID
   * @param columnId Column ID
   */
  async deleteGridColumn(fieldId: number, columnId: number): Promise<void> {
    await this.httpClient.delete(`${this.endpoint}/${fieldId}/GridColumns/${columnId}`);
  }
}
