/**
 * OpenAsset Client
 *
 * Main entry point for the OpenAsset SDK
 */

import { HttpClient, type HttpClientConfig, type AuthConfig } from './utils/http-client';
import { AlbumsResource } from './resources/albums';
import { AspectRatiosResource } from './resources/aspect-ratios';
import { CategoriesResource } from './resources/categories';
import { CopyrightHoldersResource } from './resources/copyright-holders';
import { CopyrightPoliciesResource } from './resources/copyright-policies';
import { DataIntegrationsResource } from './resources/data-integrations';
import { EmployeesResource } from './resources/employees';
import { FieldsResource } from './resources/fields';
import { FilesResource } from './resources/files';
import { GroupsResource } from './resources/groups';
import { KeywordsResource } from './resources/keywords';
import { KeywordCategoriesResource } from './resources/keyword-categories';
import { PhotographersResource } from './resources/photographers';
import { ProjectsResource } from './resources/projects';
import { ProjectKeywordsResource } from './resources/project-keywords';
import { ProjectKeywordCategoriesResource } from './resources/project-keyword-categories';
import { SearchesResource } from './resources/searches';
import { SizesResource } from './resources/sizes';
import { TextRewritesResource } from './resources/text-rewrites';
import { TopicsResource } from './resources/topics';
import { UsersResource } from './resources/users';

/**
 * Configuration options for OpenAssetClient
 */
export interface OpenAssetClientConfig {
  /**
   * Your OpenAsset domain (e.g., 'your-company' for 'your-company.openasset.com')
   * Can also be a full URL (e.g., 'https://your-company.openasset.com')
   */
  domain: string;

  /**
   * Token ID from OpenAsset security settings
   */
  tokenId: string;

  /**
   * Token string from OpenAsset security settings
   */
  tokenString: string;

  /**
   * Request timeout in milliseconds (default: 30000)
   */
  timeout?: number;

  /**
   * Custom headers to include in all requests
   */
  headers?: Record<string, string>;
}

/**
 * OpenAsset API Client
 *
 * @example
 * ```typescript
 * import { OpenAssetClient } from 'openasset-sdk';
 *
 * const client = new OpenAssetClient({
 *   domain: 'your-company',
 *   tokenId: 'your-token-id',
 *   tokenString: 'your-token-string',
 * });
 *
 * // Get all projects
 * const projects = await client.projects.getAll();
 *
 * // Get a specific file with sizes
 * const file = await client.files.get(123, { sizes: 'all' });
 *
 * // Create a new album
 * const album = await client.albums.create({ name: 'My Album' });
 * ```
 */
export class OpenAssetClient {
  private readonly httpClient: HttpClient;

  /** Albums resource */
  public readonly albums: AlbumsResource;

  /** Aspect Ratios resource (read-only) */
  public readonly aspectRatios: AspectRatiosResource;

  /** Categories resource */
  public readonly categories: CategoriesResource;

  /** Copyright Holders resource */
  public readonly copyrightHolders: CopyrightHoldersResource;

  /** Copyright Policies resource */
  public readonly copyrightPolicies: CopyrightPoliciesResource;

  /** Data Integrations resource */
  public readonly dataIntegrations: DataIntegrationsResource;

  /** Employees resource */
  public readonly employees: EmployeesResource;

  /** Fields resource */
  public readonly fields: FieldsResource;

  /** Files resource */
  public readonly files: FilesResource;

  /** Groups resource */
  public readonly groups: GroupsResource;

  /** Keywords resource */
  public readonly keywords: KeywordsResource;

  /** Keyword Categories resource */
  public readonly keywordCategories: KeywordCategoriesResource;

  /** Photographers resource */
  public readonly photographers: PhotographersResource;

  /** Projects resource */
  public readonly projects: ProjectsResource;

  /** Project Keywords resource */
  public readonly projectKeywords: ProjectKeywordsResource;

  /** Project Keyword Categories resource */
  public readonly projectKeywordCategories: ProjectKeywordCategoriesResource;

  /** Searches resource */
  public readonly searches: SearchesResource;

  /** Sizes resource */
  public readonly sizes: SizesResource;

  /** Text Rewrites resource (read-only) */
  public readonly textRewrites: TextRewritesResource;

  /** Topics resource */
  public readonly topics: TopicsResource;

  /** Users resource */
  public readonly users: UsersResource;

  constructor(config: OpenAssetClientConfig) {
    // Build the base URL from domain
    let baseUrl: string;
    if (config.domain.startsWith('http://') || config.domain.startsWith('https://')) {
      baseUrl = config.domain;
    } else {
      baseUrl = `https://${config.domain}.openasset.com`;
    }

    const auth: AuthConfig = {
      tokenId: config.tokenId,
      tokenString: config.tokenString,
    };

    const httpClientConfig: HttpClientConfig = {
      baseUrl,
      auth,
      timeout: config.timeout,
      headers: config.headers,
    };

    this.httpClient = new HttpClient(httpClientConfig);

    // Initialize all resources
    this.albums = new AlbumsResource(this.httpClient);
    this.aspectRatios = new AspectRatiosResource(this.httpClient);
    this.categories = new CategoriesResource(this.httpClient);
    this.copyrightHolders = new CopyrightHoldersResource(this.httpClient);
    this.copyrightPolicies = new CopyrightPoliciesResource(this.httpClient);
    this.dataIntegrations = new DataIntegrationsResource(this.httpClient);
    this.employees = new EmployeesResource(this.httpClient);
    this.fields = new FieldsResource(this.httpClient);
    this.files = new FilesResource(this.httpClient);
    this.groups = new GroupsResource(this.httpClient);
    this.keywords = new KeywordsResource(this.httpClient);
    this.keywordCategories = new KeywordCategoriesResource(this.httpClient);
    this.photographers = new PhotographersResource(this.httpClient);
    this.projects = new ProjectsResource(this.httpClient);
    this.projectKeywords = new ProjectKeywordsResource(this.httpClient);
    this.projectKeywordCategories = new ProjectKeywordCategoriesResource(this.httpClient);
    this.searches = new SearchesResource(this.httpClient);
    this.sizes = new SizesResource(this.httpClient);
    this.textRewrites = new TextRewritesResource(this.httpClient);
    this.topics = new TopicsResource(this.httpClient);
    this.users = new UsersResource(this.httpClient);
  }

  /**
   * Get the underlying HTTP client for advanced usage
   */
  getHttpClient(): HttpClient {
    return this.httpClient;
  }
}

/**
 * Create a new OpenAsset client
 *
 * @example
 * ```typescript
 * import { createClient } from 'openasset-sdk';
 *
 * const client = createClient({
 *   domain: 'your-company',
 *   tokenId: 'your-token-id',
 *   tokenString: 'your-token-string',
 * });
 * ```
 */
export function createClient(config: OpenAssetClientConfig): OpenAssetClient {
  return new OpenAssetClient(config);
}
