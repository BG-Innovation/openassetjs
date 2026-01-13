/**
 * OpenAsset SDK
 *
 * A modern TypeScript SDK for the OpenAsset REST API
 *
 * @packageDocumentation
 */

// Main client
export { OpenAssetClient, createClient } from './client';
export type { OpenAssetClientConfig } from './client';

// Types
export * from './types';

// Utils
export {
  HttpClient,
  type HttpClientConfig,
  type AuthConfig,
  type RequestOptions,
  type HttpResponse,
} from './utils/http-client';

export {
  OpenAssetError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  MethodNotAllowedError,
  ConflictError,
  UnprocessableEntityError,
  BadRequestError,
  ServerError,
} from './utils/errors';

// Resources
export {
  BaseResource,
  MergeableResource,
  type ListOptions,
  type GetOptions,
} from './resources/base';

export { AlbumsResource, type AlbumListOptions, type AlbumGetOptions } from './resources/albums';
export { AspectRatiosResource } from './resources/aspect-ratios';
export { CategoriesResource, type CategoryListOptions } from './resources/categories';
export {
  CopyrightHoldersResource,
  type CopyrightHolderListOptions,
} from './resources/copyright-holders';
export {
  CopyrightPoliciesResource,
  type CopyrightPolicyListOptions,
} from './resources/copyright-policies';
export {
  DataIntegrationsResource,
  type DataIntegrationListOptions,
  type DataIntegrationGetOptions,
} from './resources/data-integrations';
export {
  EmployeesResource,
  type EmployeeListOptions,
  type EmployeeGetOptions,
  type EmployeeFileDisplayOrder,
} from './resources/employees';
export {
  FieldsResource,
  type FieldListOptions,
  type FieldGetOptions,
} from './resources/fields';
export {
  FilesResource,
  type FileListOptions,
  type FileGetOptions,
  type FileUploadOptions,
} from './resources/files';
export { GroupsResource, type GroupListOptions, type GroupGetOptions } from './resources/groups';
export { KeywordsResource, type KeywordListOptions, type KeywordGetOptions } from './resources/keywords';
export {
  KeywordCategoriesResource,
  type KeywordCategoryListOptions,
} from './resources/keyword-categories';
export { PhotographersResource, type PhotographerListOptions } from './resources/photographers';
export {
  ProjectsResource,
  type ProjectListOptions,
  type ProjectGetOptions,
} from './resources/projects';
export {
  ProjectKeywordsResource,
  type ProjectKeywordListOptions,
} from './resources/project-keywords';
export {
  ProjectKeywordCategoriesResource,
  type ProjectKeywordCategoryListOptions,
} from './resources/project-keyword-categories';
export {
  SearchesResource,
  type SearchListOptions,
  type SearchGetOptions,
} from './resources/searches';
export { SizesResource, type SizeListOptions } from './resources/sizes';
export { TextRewritesResource } from './resources/text-rewrites';
export { TopicsResource, type TopicListOptions, type TopicGetOptions } from './resources/topics';
export { UsersResource, type UserListOptions, type UserGetOptions } from './resources/users';
