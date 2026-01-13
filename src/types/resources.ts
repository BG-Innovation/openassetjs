/**
 * Resource type definitions for OpenAsset API
 */

import type {
  BooleanInt,
  DateTime,
  FieldDisplayType,
  FieldType,
  ValueOrderBy,
  Colourspace,
  FileFormat,
  DataIntegrationType,
  IdReference,
  IdReferenceWithModify,
  GridData,
  FieldValue,
  Location,
  SizeInfo,
  AWSPresignedUrl,
} from './common';

// ============================================================================
// Albums
// ============================================================================

export interface Album {
  id: number;
  all_users_can_modify: BooleanInt;
  approved_company_album: BooleanInt;
  can_modify: BooleanInt;
  code: string;
  company_album: BooleanInt;
  created: DateTime;
  description: string;
  locked: BooleanInt;
  my_album: BooleanInt;
  name: string;
  private_image_count: string;
  public_image_count: string;
  share_with_all_users: BooleanInt;
  shared_album: BooleanInt;
  unapproved_image_count: string;
  updated: DateTime;
  user_id: number;
  /** Expanded: groups */
  groups?: IdReferenceWithModify[];
  /** Expanded: projects */
  projects?: IdReference[];
  /** Expanded: topics */
  topics?: IdReference[];
  /** Expanded: users */
  users?: IdReferenceWithModify[];
}

export interface AlbumCreate {
  name: string;
  description?: string;
  all_users_can_modify?: BooleanInt;
  approved_company_album?: BooleanInt;
  company_album?: BooleanInt;
  locked?: BooleanInt;
  share_with_all_users?: BooleanInt;
}

export interface AlbumUpdate {
  id?: number;
  all_users_can_modify?: BooleanInt;
  approved_company_album?: BooleanInt;
  company_album?: BooleanInt;
  description?: string;
  locked?: BooleanInt;
  name?: string;
  share_with_all_users?: BooleanInt;
  files?: number | number[];
}

// ============================================================================
// Aspect Ratios
// ============================================================================

export interface AspectRatio {
  id: number;
  code: string;
  label: string;
}

// ============================================================================
// Categories
// ============================================================================

export interface Category {
  id: number;
  alive: BooleanInt;
  code: string;
  default_access_level: number;
  default_rank: number;
  description: string;
  display_order: number;
  maximum_rank: number;
  name: string;
  projects_category: BooleanInt;
  updated: DateTime;
}

export interface CategoryUpdate {
  id?: number;
  alive?: BooleanInt;
  default_access_level?: number;
  default_rank?: number;
  description?: string;
  display_order?: number;
  name?: string;
}

// ============================================================================
// Copyright Holders
// ============================================================================

export interface CopyrightHolder {
  id: number;
  copyright_policy_id: number;
  name: string;
  updated: DateTime;
}

export interface CopyrightHolderCreate {
  name: string;
  copyright_policy_id: number;
}

export interface CopyrightHolderUpdate {
  id?: number;
  name?: string;
  copyright_policy_id?: number;
}

// ============================================================================
// Copyright Policies
// ============================================================================

export interface CopyrightPolicy {
  id: number;
  code: string;
  description: string;
  name: string;
  updated: DateTime;
}

export interface CopyrightPolicyCreate {
  name: string;
  description?: string;
}

export interface CopyrightPolicyUpdate {
  id?: number;
  name?: string;
  description?: string;
}

// ============================================================================
// Data Integrations
// ============================================================================

export interface DataIntegration {
  id: number;
  alive: BooleanInt;
  name: string;
  last_ping: DateTime;
  display_order: number;
  address: string;
  last_connect: DateTime;
  data_integration_type: DataIntegrationType;
  version: string;
  /** Expanded: employeeKeywordCategories */
  employeeKeywordCategories?: IdReference[];
  /** Expanded: fields */
  fields?: IdReference[];
  /** Expanded: keywordCategories */
  keywordCategories?: IdReference[];
  /** Expanded: projectKeywordCategories */
  projectKeywordCategories?: IdReference[];
}

export interface DataIntegrationCreate {
  name: string;
  display_order: number;
  address: string;
  data_integration_type: DataIntegrationType;
}

export interface DataIntegrationUpdate {
  id?: number;
  alive?: BooleanInt;
  name?: string;
  display_order?: number;
  address?: string;
}

// ============================================================================
// Employees
// ============================================================================

export interface Employee {
  id: number;
  alive: BooleanInt;
  code: string;
  created: DateTime;
  first_name: string;
  descriptor: string;
  last_name: string;
  updated: DateTime;
  /** Custom fields - dynamic based on configuration */
  [key: string]: unknown;
  /** Expanded: files */
  files?: EmployeeFile[];
  /** Expanded: projects */
  projects?: EmployeeProject[];
  /** Expanded: persons */
  persons?: IdReference[];
}

export interface EmployeeFile {
  id: number;
  display_order: number;
}

export interface EmployeeProject {
  id: number;
  roles?: GridData;
}

export interface EmployeeCreate {
  first_name: string;
  last_name: string;
  code?: string;
  /** Additional required fields depend on configuration */
  [key: string]: unknown;
}

export interface EmployeeUpdate {
  id?: number;
  alive?: BooleanInt;
  first_name?: string;
  last_name?: string;
  code?: string;
  /** Additional fields depend on configuration */
  [key: string]: unknown;
}

// ============================================================================
// Fields
// ============================================================================

export interface Field {
  id: number;
  alive: BooleanInt;
  built_in: BooleanInt;
  cardinality: number;
  code: string;
  description: string;
  display_order: number;
  field_display_type: FieldDisplayType;
  field_type: FieldType;
  hero: BooleanInt;
  include_on_info: BooleanInt;
  include_on_search: BooleanInt;
  name: string;
  protected: BooleanInt;
  regex: string;
  regex_description: string;
  required: BooleanInt;
  rest_code: string;
  updated: DateTime;
  value_order_by: ValueOrderBy;
  metadata?: BooleanInt;
  /** Expanded: fieldLookupStrings */
  fieldLookupStrings?: FieldLookupString[];
}

export interface FieldLookupString {
  id: number;
  value: string;
  display_order: number;
}

export interface FieldCreate {
  name: string;
  field_type: FieldType;
  field_display_type: FieldDisplayType;
  description?: string;
  display_order?: number;
}

export interface FieldUpdate {
  id?: number;
  alive?: BooleanInt;
  description?: string;
  name?: string;
  display_order?: number;
}

// ============================================================================
// Grid Columns
// ============================================================================

export interface GridColumn {
  id: number;
  code: string;
  display_order: number;
  field_display_type: FieldDisplayType;
  name: string;
  field_id?: number;
}

export interface GridColumnCreate {
  name: string;
  field_display_type: FieldDisplayType;
}

export interface GridColumnUpdate {
  id?: number;
  code?: string;
  name?: string;
  display_order?: number;
}

// ============================================================================
// Files
// ============================================================================

export interface File {
  id: number;
  access_level: number;
  alive?: BooleanInt;
  alternate_store_id: number;
  caption: string;
  category_id: number;
  click_count: number;
  contains_audio: BooleanInt;
  contains_video: BooleanInt;
  copyright_holder_id: number;
  created: DateTime;
  description: string;
  download_count: number;
  duration: number;
  filename: string;
  is_vr: BooleanInt;
  md5_at_upload: string;
  md5_now: string;
  original_filename: string;
  photographer_id: number;
  processing_failures: number;
  project_id: number;
  project_display_order?: number;
  rank: number;
  recheck: BooleanInt;
  replaced: DateTime;
  replaced_user_id: number;
  rotate_degrees: number;
  rotation_since_upload: number;
  similarity_indexed: DateTime;
  updated: DateTime;
  uploaded: DateTime;
  user_id: number;
  video_frames_per_second: number;
  deleted?: DateTime;
  deleted_user_id?: number;
  original_details_verified?: BooleanInt;
  similarity_attempts?: number;
  /** Expanded: fields */
  fields?: FieldValue[];
  /** Expanded: keywords */
  keywords?: IdReference[];
  /** Expanded: albums */
  albums?: IdReference[];
  /** Expanded: sizes */
  sizes?: SizeInfo[];
  /** Expanded: employees */
  employees?: IdReference[];
}

export interface FileCreate {
  category_id: number;
  original_filename: string;
  project_id?: number;
  original_filesize?: number;
  part_size?: number;
}

export interface FileCreateResponse extends File {
  aws_presigned_urls?: AWSPresignedUrl[];
}

export interface FileUpdate {
  id?: number;
  access_level?: number;
  caption?: string;
  copyright_holder_id?: number;
  description?: string;
  photographer_id?: number;
  rank?: number;
  rotate_degrees?: 0 | 90 | 180 | 270;
  project_display_order?: number;
}

export interface FileUploadComplete {
  id: number;
  s3_upload_complete: 1;
  etags: Record<number, string> | string[];
}

// ============================================================================
// Groups
// ============================================================================

export interface Group {
  id: number;
  alive: BooleanInt;
  default_for_new_users: BooleanInt;
  expires: BooleanInt;
  expiry_date: DateTime;
  hidden: BooleanInt;
  name: string;
  protected?: BooleanInt;
  /** Expanded: users */
  users?: IdReference[];
}

export interface GroupCreate {
  name: string;
  alive?: BooleanInt;
  default_for_new_users?: BooleanInt;
  expires?: BooleanInt;
  expiry_date?: DateTime;
}

export interface GroupUpdate {
  id?: number;
  alive?: BooleanInt;
  default_for_new_users?: BooleanInt;
  expires?: BooleanInt;
  expiry_date?: DateTime;
  name?: string;
}

// ============================================================================
// Keywords
// ============================================================================

export interface Keyword {
  id: number;
  name: string;
  keyword_category_id: number;
  updated: DateTime;
  dead_image_count?: number;
  private_image_count?: number;
  public_image_count?: number;
  unapproved_image_count?: number;
  /** Expanded: files */
  files?: IdReference[];
}

export interface KeywordCreate {
  name: string;
  keyword_category_id: number;
}

export interface KeywordUpdate {
  id?: number;
  name?: string;
}

// ============================================================================
// Keyword Categories
// ============================================================================

export interface KeywordCategory {
  id: number;
  category_id: number;
  code: string;
  display_order: number;
  name: string;
  updated: DateTime;
}

export interface KeywordCategoryCreate {
  name: string;
  category_id: number;
}

export interface KeywordCategoryUpdate {
  id?: number;
  name?: string;
  display_order?: number;
}

// ============================================================================
// Photographers
// ============================================================================

export interface Photographer {
  id: number;
  name: string;
  updated: DateTime;
}

export interface PhotographerCreate {
  name: string;
}

export interface PhotographerUpdate {
  id?: number;
  name?: string;
}

// ============================================================================
// Projects
// ============================================================================

export interface Project {
  id: number;
  alive: BooleanInt;
  code: string;
  code_alias_1: string;
  code_alias_2: string;
  created: DateTime;
  dead_image_count: number;
  name: string;
  name_alias_1: string;
  name_alias_2: string;
  private_image_count: number;
  public_image_count: number;
  unapproved_image_count: number;
  updated: DateTime;
  deleted?: BooleanInt;
  /** Location (when withLocation=1) */
  location?: Location;
  /** Custom fields (when withEmbeddedFields=1) */
  [key: string]: unknown;
  /** Expanded: fields */
  fields?: FieldValue[];
  /** Expanded: projectKeywords */
  projectKeywords?: IdReference[];
  /** Expanded: albums */
  albums?: IdReference[];
  /** Expanded: employees */
  employees?: ProjectEmployee[];
}

export interface ProjectEmployee {
  id: number;
  roles?: GridData;
}

export interface ProjectCreate {
  name: string;
  code: string;
  code_alias_1?: string;
  code_alias_2?: string;
  name_alias_1?: string;
  name_alias_2?: string;
  /** Additional custom fields */
  [key: string]: unknown;
}

export interface ProjectUpdate {
  id?: number;
  name?: string;
  code?: string;
  alive?: BooleanInt;
  code_alias_1?: string;
  code_alias_2?: string;
  name_alias_1?: string;
  name_alias_2?: string;
  location?: Location;
  /** Additional custom fields */
  [key: string]: unknown;
}

// ============================================================================
// Project Keywords
// ============================================================================

export interface ProjectKeyword {
  id: number;
  name: string;
  project_count: number;
  project_keyword_category_id: number;
  updated: DateTime;
}

export interface ProjectKeywordCreate {
  name: string;
  project_keyword_category_id: number;
}

export interface ProjectKeywordUpdate {
  id?: number;
  name?: string;
}

// ============================================================================
// Project Keyword Categories
// ============================================================================

export interface ProjectKeywordCategory {
  id: number;
  code: string;
  display_order: number;
  name: string;
  updated: DateTime;
}

export interface ProjectKeywordCategoryCreate {
  name: string;
}

export interface ProjectKeywordCategoryUpdate {
  id?: number;
  name?: string;
  display_order?: number;
}

// ============================================================================
// Searches
// ============================================================================

export interface Search {
  id: number;
  all_users_can_modify: BooleanInt;
  approved_company_saved_search: BooleanInt;
  can_modify: BooleanInt;
  code: string;
  company_saved_search: BooleanInt;
  created: DateTime;
  locked: BooleanInt;
  name: string;
  saved: BooleanInt;
  search_items: SearchItem[];
  share_with_all_users: BooleanInt;
  updated: DateTime;
  user_id: number;
  /** Expanded: groups */
  groups?: IdReferenceWithModify[];
  /** Expanded: users */
  users?: IdReferenceWithModify[];
}

export interface SearchItem {
  code: SearchItemCode;
  exclude: BooleanInt;
  operator?: 'AND' | 'OR';
  values?: string[];
  ids?: (string | number)[];
}

export type SearchItemCode =
  | 'album'
  | 'project'
  | 'created'
  | 'uploaded'
  | 'caption'
  | 'description'
  | 'filename'
  | 'originalFilename'
  | 'photographer'
  | 'copyrightHolder'
  | 'user'
  | 'colourspace'
  | 'category'
  | 'accessLevel'
  | 'aspectRatio'
  | 'rank'
  | 'size'
  | 'width'
  | 'keywordCount'
  | 'popularFields'
  | 'deleted'
  | 'fileFormat'
  | `keyword.${number}`
  | `projectKeyword.${number}`
  | `field.${number}`;

export interface SearchCreate {
  name: string;
  search_items: SearchItem[];
  all_users_can_modify?: BooleanInt;
  approved_company_saved_search?: BooleanInt;
  company_saved_search?: BooleanInt;
  locked?: BooleanInt;
  share_with_all_users?: BooleanInt;
}

export interface SearchUpdate {
  id?: number;
  all_users_can_modify?: BooleanInt;
  approved_company_saved_search?: BooleanInt;
  company_saved_search?: BooleanInt;
  locked?: BooleanInt;
  name?: string;
  saved?: BooleanInt;
  search_items?: SearchItem[];
  share_with_all_users?: BooleanInt;
}

// ============================================================================
// Sizes
// ============================================================================

export interface Size {
  id: number;
  alive: BooleanInt;
  allow_use: BooleanInt;
  always_create: BooleanInt;
  colourspace: Colourspace;
  crop_to_fit: BooleanInt;
  description: string;
  display_order: number;
  file_format: FileFormat;
  height: number;
  is_video: BooleanInt;
  name: string;
  original: BooleanInt;
  postfix: string;
  protected: BooleanInt;
  quality: number;
  size_protected: BooleanInt;
  updated: DateTime;
  use_for_contact_sheet: BooleanInt;
  use_for_power_point: BooleanInt;
  use_for_zip: BooleanInt;
  width: number;
  x_resolution: number;
  y_resolution: number;
}

export interface SizeCreate {
  postfix: string;
  file_format: FileFormat;
  colourspace: Colourspace;
  width: number;
  height: number;
  always_create: BooleanInt;
  name?: string;
  description?: string;
  quality?: number;
  x_resolution?: number;
  y_resolution?: number;
}

export interface SizeUpdate {
  id?: number;
  description?: string;
  display_order?: number;
  name?: string;
  use_for_contact_sheet?: BooleanInt;
  use_for_power_point?: BooleanInt;
  use_for_zip?: BooleanInt;
}

// ============================================================================
// Text Rewrites
// ============================================================================

export interface TextRewrite {
  id: number;
  case_sensitive: BooleanInt;
  preserve_first_letter_case: BooleanInt;
  text_match: string;
  text_replace: string;
}

// ============================================================================
// Topics
// ============================================================================

export interface Topic {
  id: number;
  code: string;
  display_order: number;
  name: string;
  protected: BooleanInt;
  updated: DateTime;
  /** Expanded: albums */
  albums?: IdReference[];
}

export interface TopicCreate {
  name: string;
  display_order?: number;
}

export interface TopicUpdate {
  id?: number;
  name?: string;
  display_order?: number;
}

// ============================================================================
// Users
// ============================================================================

export interface User {
  id: number;
  alive: BooleanInt;
  current_album_id: number;
  email: string;
  expires: BooleanInt;
  expiry_date: DateTime;
  full_name: string;
  hidden: BooleanInt;
  invited: BooleanInt;
  protected: BooleanInt;
  username: string;
  valid: BooleanInt;
  sso_provider_id?: number;
  /** Expanded: groups */
  groups?: IdReference[];
}

export interface UserCreate {
  full_name: string;
  username: string;
  password: string;
  email?: string;
  expires?: BooleanInt;
  expiry_date?: DateTime;
}

export interface UserUpdate {
  id?: number;
  alive?: BooleanInt;
  email?: string;
  expires?: BooleanInt;
  expiry_date?: DateTime;
  full_name?: string;
  username?: string;
}
