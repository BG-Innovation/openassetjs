/**
 * Common types used across the OpenAsset SDK
 */

/**
 * DateTime format used by OpenAsset API: YYYYMMDDhhmmss
 */
export type DateTime = string;

/**
 * Boolean represented as 0 or 1
 */
export type BooleanInt = 0 | 1;

/**
 * HTTP methods supported by the API
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'MERGE' | 'HEAD';

/**
 * Text matching modes for filtering
 */
export type TextMatching = 'contains' | 'exact' | 'wildcard';

/**
 * Search operators
 */
export type SearchOperator = 'AND' | 'OR';

/**
 * Field display types
 */
export type FieldDisplayType =
  | 'suggestion'
  | 'fixedSuggestion'
  | 'option'
  | 'singleLine'
  | 'multiLine'
  | 'date'
  | 'boolean'
  | 'grid';

/**
 * Field types
 */
export type FieldType = 'image' | 'project' | 'employee';

/**
 * Value order by options
 */
export type ValueOrderBy = 'displayOrder' | 'name' | 'nameDesc';

/**
 * Colourspace options
 */
export type Colourspace = 'RGB' | 'CMYK' | 'Grayscale';

/**
 * File format options for sizes
 */
export type FileFormat = 'jpg' | 'png' | 'tiff' | 'gif' | 'webp';

/**
 * Data integration types
 */
export type DataIntegrationType = 'cosential' | 'vision';

/**
 * Query parameters common to all endpoints
 */
export interface QueryParams {
  /** Limit number of results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Text matching mode */
  textMatching?: TextMatching;
  /** Order by field (append Desc for descending) */
  orderBy?: string | string[];
  /** Fields to display in response */
  displayFields?: string | string[];
  /** Advanced filtering */
  filterBy?: FilterBy;
  /** Grid limit for grid fields */
  gridLimit?: number;
  /** Grid offset for grid fields */
  gridOffset?: number;
}

/**
 * Advanced filter options
 */
export type FilterBy = FilterObject | FilterObject[] | string;

export interface FilterObject {
  [key: string]: string | number | boolean | FilterObject | FilterObject[] | undefined;
}

/**
 * Response headers returned by the API
 */
export interface ResponseHeaders {
  'X-SessionKey'?: string;
  'X-Full-Results-Count'?: string;
  'X-Display-Results-Count'?: string;
  'X-Offset'?: string;
  'X-Timing'?: string;
  'X-Username'?: string;
  'X-User-Id'?: string;
  'X-OpenAsset-Version'?: string;
  'X-Ignored-Fields'?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  fullResultsCount: number;
  displayResultsCount: number;
  offset: number;
}

/**
 * Base response for batch operations
 */
export interface BatchResponseItem {
  id: number;
  _http_header_X_Ignored_Fields?: string;
  _http_header_Location?: string;
  http_status_code: number;
}

/**
 * Nested noun expansion options
 */
export interface NounExpansion {
  [key: string]: 'all' | number | number[] | string;
}

/**
 * ID reference used in nested objects
 */
export interface IdReference {
  id: number;
}

/**
 * ID reference with modify permission
 */
export interface IdReferenceWithModify extends IdReference {
  can_modify?: BooleanInt;
}

/**
 * Grid field row
 */
export interface GridRow {
  _row?: number;
  [key: string]: string | number | DateTime | undefined;
}

/**
 * Grid field data structure
 */
export interface GridData {
  limit: number;
  offset: number;
  total: number;
  rows: GridRow[];
}

/**
 * Field value structure
 */
export interface FieldValue {
  id: number;
  values: (string | number)[];
}

/**
 * Location coordinates
 */
export interface Location {
  latitude: number;
  longitude: number;
}

/**
 * AWS presigned URL info for file uploads
 */
export interface AWSPresignedUrl {
  url: string;
  part_number: number;
}

/**
 * S3 upload completion info
 */
export interface S3UploadComplete {
  s3_upload_complete: BooleanInt;
  etags: Record<number, string> | string[];
}

/**
 * Size info returned in file expansions
 */
export interface SizeInfo {
  id: number;
  cropped: BooleanInt;
  width: number;
  height: number;
  file_format: string;
  relative_path: string;
  colourspace: string;
  y_resolution: number;
  x_resolution: number;
  quality: number;
  allow_use: BooleanInt;
  http_root: string;
  recreate: BooleanInt;
  watermarked: BooleanInt;
  filesize: number;
  unc_root: string;
  http_relative_path: string;
  default_office_size: BooleanInt;
}
