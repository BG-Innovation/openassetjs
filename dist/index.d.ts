/**
 * Common types used across the OpenAsset SDK
 */
/**
 * DateTime format used by OpenAsset API: YYYYMMDDhhmmss
 */
type DateTime = string;
/**
 * Boolean represented as 0 or 1
 */
type BooleanInt = 0 | 1;
/**
 * HTTP methods supported by the API
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'MERGE' | 'HEAD';
/**
 * Text matching modes for filtering
 */
type TextMatching = 'contains' | 'exact' | 'wildcard';
/**
 * Search operators
 */
type SearchOperator = 'AND' | 'OR';
/**
 * Field display types
 */
type FieldDisplayType = 'suggestion' | 'fixedSuggestion' | 'option' | 'singleLine' | 'multiLine' | 'date' | 'boolean' | 'grid';
/**
 * Field types
 */
type FieldType = 'image' | 'project' | 'employee';
/**
 * Value order by options
 */
type ValueOrderBy = 'displayOrder' | 'name' | 'nameDesc';
/**
 * Colourspace options
 */
type Colourspace = 'RGB' | 'CMYK' | 'Grayscale';
/**
 * File format options for sizes
 */
type FileFormat = 'jpg' | 'png' | 'tiff' | 'gif' | 'webp';
/**
 * Data integration types
 */
type DataIntegrationType = 'cosential' | 'vision';
/**
 * Query parameters common to all endpoints
 */
interface QueryParams {
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
type FilterBy = FilterObject | FilterObject[] | string;
interface FilterObject {
    [key: string]: string | number | boolean | FilterObject | FilterObject[] | undefined;
}
/**
 * Response headers returned by the API
 */
interface ResponseHeaders {
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
interface PaginatedResponse<T> {
    data: T[];
    fullResultsCount: number;
    displayResultsCount: number;
    offset: number;
}
/**
 * Base response for batch operations
 */
interface BatchResponseItem {
    id: number;
    _http_header_X_Ignored_Fields?: string;
    _http_header_Location?: string;
    http_status_code: number;
}
/**
 * Nested noun expansion options
 */
interface NounExpansion {
    [key: string]: 'all' | number | number[] | string;
}
/**
 * ID reference used in nested objects
 */
interface IdReference {
    id: number;
}
/**
 * ID reference with modify permission
 */
interface IdReferenceWithModify extends IdReference {
    can_modify?: BooleanInt;
}
/**
 * Grid field row
 */
interface GridRow {
    _row?: number;
    [key: string]: string | number | DateTime | undefined;
}
/**
 * Grid field data structure
 */
interface GridData {
    limit: number;
    offset: number;
    total: number;
    rows: GridRow[];
}
/**
 * Field value structure
 */
interface FieldValue {
    id: number;
    values: (string | number)[];
}
/**
 * Location coordinates
 */
interface Location {
    latitude: number;
    longitude: number;
}
/**
 * AWS presigned URL info for file uploads
 */
interface AWSPresignedUrl {
    url: string;
    part_number: number;
}
/**
 * S3 upload completion info
 */
interface S3UploadComplete {
    s3_upload_complete: BooleanInt;
    etags: Record<number, string> | string[];
}
/**
 * Size info returned in file expansions
 */
interface SizeInfo {
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

/**
 * Resource type definitions for OpenAsset API
 */

interface Album {
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
interface AlbumCreate {
    name: string;
    description?: string;
    all_users_can_modify?: BooleanInt;
    approved_company_album?: BooleanInt;
    company_album?: BooleanInt;
    locked?: BooleanInt;
    share_with_all_users?: BooleanInt;
}
interface AlbumUpdate {
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
interface AspectRatio {
    id: number;
    code: string;
    label: string;
}
interface Category {
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
interface CategoryUpdate {
    id?: number;
    alive?: BooleanInt;
    default_access_level?: number;
    default_rank?: number;
    description?: string;
    display_order?: number;
    name?: string;
}
interface CopyrightHolder {
    id: number;
    copyright_policy_id: number;
    name: string;
    updated: DateTime;
}
interface CopyrightHolderCreate {
    name: string;
    copyright_policy_id: number;
}
interface CopyrightHolderUpdate {
    id?: number;
    name?: string;
    copyright_policy_id?: number;
}
interface CopyrightPolicy {
    id: number;
    code: string;
    description: string;
    name: string;
    updated: DateTime;
}
interface CopyrightPolicyCreate {
    name: string;
    description?: string;
}
interface CopyrightPolicyUpdate {
    id?: number;
    name?: string;
    description?: string;
}
interface DataIntegration {
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
interface DataIntegrationCreate {
    name: string;
    display_order: number;
    address: string;
    data_integration_type: DataIntegrationType;
}
interface DataIntegrationUpdate {
    id?: number;
    alive?: BooleanInt;
    name?: string;
    display_order?: number;
    address?: string;
}
interface Employee {
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
interface EmployeeFile {
    id: number;
    display_order: number;
}
interface EmployeeProject {
    id: number;
    roles?: GridData;
}
interface EmployeeCreate {
    first_name: string;
    last_name: string;
    code?: string;
    /** Additional required fields depend on configuration */
    [key: string]: unknown;
}
interface EmployeeUpdate {
    id?: number;
    alive?: BooleanInt;
    first_name?: string;
    last_name?: string;
    code?: string;
    /** Additional fields depend on configuration */
    [key: string]: unknown;
}
interface Field {
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
interface FieldLookupString {
    id: number;
    value: string;
    display_order: number;
}
interface FieldCreate {
    name: string;
    field_type: FieldType;
    field_display_type: FieldDisplayType;
    description?: string;
    display_order?: number;
}
interface FieldUpdate {
    id?: number;
    alive?: BooleanInt;
    description?: string;
    name?: string;
    display_order?: number;
}
interface GridColumn {
    id: number;
    code: string;
    display_order: number;
    field_display_type: FieldDisplayType;
    name: string;
    field_id?: number;
}
interface GridColumnCreate {
    name: string;
    field_display_type: FieldDisplayType;
}
interface GridColumnUpdate {
    id?: number;
    code?: string;
    name?: string;
    display_order?: number;
}
interface File {
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
interface FileCreate {
    category_id: number;
    original_filename: string;
    project_id?: number;
    original_filesize?: number;
    part_size?: number;
}
interface FileCreateResponse extends File {
    aws_presigned_urls?: AWSPresignedUrl[];
}
interface FileUpdate {
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
interface FileUploadComplete {
    id: number;
    s3_upload_complete: 1;
    etags: Record<number, string> | string[];
}
interface Group {
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
interface GroupCreate {
    name: string;
    alive?: BooleanInt;
    default_for_new_users?: BooleanInt;
    expires?: BooleanInt;
    expiry_date?: DateTime;
}
interface GroupUpdate {
    id?: number;
    alive?: BooleanInt;
    default_for_new_users?: BooleanInt;
    expires?: BooleanInt;
    expiry_date?: DateTime;
    name?: string;
}
interface Keyword {
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
interface KeywordCreate {
    name: string;
    keyword_category_id: number;
}
interface KeywordUpdate {
    id?: number;
    name?: string;
}
interface KeywordCategory {
    id: number;
    category_id: number;
    code: string;
    display_order: number;
    name: string;
    updated: DateTime;
}
interface KeywordCategoryCreate {
    name: string;
    category_id: number;
}
interface KeywordCategoryUpdate {
    id?: number;
    name?: string;
    display_order?: number;
}
interface Photographer {
    id: number;
    name: string;
    updated: DateTime;
}
interface PhotographerCreate {
    name: string;
}
interface PhotographerUpdate {
    id?: number;
    name?: string;
}
interface Project {
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
interface ProjectEmployee {
    id: number;
    roles?: GridData;
}
interface ProjectCreate {
    name: string;
    code: string;
    code_alias_1?: string;
    code_alias_2?: string;
    name_alias_1?: string;
    name_alias_2?: string;
    /** Additional custom fields */
    [key: string]: unknown;
}
interface ProjectUpdate {
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
interface ProjectKeyword {
    id: number;
    name: string;
    project_count: number;
    project_keyword_category_id: number;
    updated: DateTime;
}
interface ProjectKeywordCreate {
    name: string;
    project_keyword_category_id: number;
}
interface ProjectKeywordUpdate {
    id?: number;
    name?: string;
}
interface ProjectKeywordCategory {
    id: number;
    code: string;
    display_order: number;
    name: string;
    updated: DateTime;
}
interface ProjectKeywordCategoryCreate {
    name: string;
}
interface ProjectKeywordCategoryUpdate {
    id?: number;
    name?: string;
    display_order?: number;
}
interface Search {
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
interface SearchItem {
    code: SearchItemCode;
    exclude: BooleanInt;
    operator?: 'AND' | 'OR';
    values?: string[];
    ids?: (string | number)[];
}
type SearchItemCode = 'album' | 'project' | 'created' | 'uploaded' | 'caption' | 'description' | 'filename' | 'originalFilename' | 'photographer' | 'copyrightHolder' | 'user' | 'colourspace' | 'category' | 'accessLevel' | 'aspectRatio' | 'rank' | 'size' | 'width' | 'keywordCount' | 'popularFields' | 'deleted' | 'fileFormat' | `keyword.${number}` | `projectKeyword.${number}` | `field.${number}`;
interface SearchCreate {
    name: string;
    search_items: SearchItem[];
    all_users_can_modify?: BooleanInt;
    approved_company_saved_search?: BooleanInt;
    company_saved_search?: BooleanInt;
    locked?: BooleanInt;
    share_with_all_users?: BooleanInt;
}
interface SearchUpdate {
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
interface Size {
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
interface SizeCreate {
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
interface SizeUpdate {
    id?: number;
    description?: string;
    display_order?: number;
    name?: string;
    use_for_contact_sheet?: BooleanInt;
    use_for_power_point?: BooleanInt;
    use_for_zip?: BooleanInt;
}
interface TextRewrite {
    id: number;
    case_sensitive: BooleanInt;
    preserve_first_letter_case: BooleanInt;
    text_match: string;
    text_replace: string;
}
interface Topic {
    id: number;
    code: string;
    display_order: number;
    name: string;
    protected: BooleanInt;
    updated: DateTime;
    /** Expanded: albums */
    albums?: IdReference[];
}
interface TopicCreate {
    name: string;
    display_order?: number;
}
interface TopicUpdate {
    id?: number;
    name?: string;
    display_order?: number;
}
interface User {
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
interface UserCreate {
    full_name: string;
    username: string;
    password: string;
    email?: string;
    expires?: BooleanInt;
    expiry_date?: DateTime;
}
interface UserUpdate {
    id?: number;
    alive?: BooleanInt;
    email?: string;
    expires?: BooleanInt;
    expiry_date?: DateTime;
    full_name?: string;
    username?: string;
}

/**
 * HTTP client for OpenAsset API
 */

/**
 * Authentication configuration
 */
interface AuthConfig {
    /** Token ID from OpenAsset */
    tokenId: string;
    /** Token string from OpenAsset */
    tokenString: string;
}
/**
 * HTTP client configuration
 */
interface HttpClientConfig {
    /** Base URL for the OpenAsset instance (e.g., https://your-domain.openasset.com) */
    baseUrl: string;
    /** Authentication configuration */
    auth: AuthConfig;
    /** Request timeout in milliseconds (default: 30000) */
    timeout?: number;
    /** Custom headers to include in all requests */
    headers?: Record<string, string>;
}
/**
 * Request options
 */
interface RequestOptions {
    /** Query parameters */
    params?: QueryParams & Record<string, unknown>;
    /** Request body */
    body?: unknown;
    /** Additional headers */
    headers?: Record<string, string>;
    /** Request timeout override */
    timeout?: number;
    /** Noun expansions (e.g., { files: 'all', keywords: 'all' }) */
    expand?: Record<string, 'all' | number | number[] | string>;
    /** Remote fields to include */
    remoteFields?: string | string[];
    /** Part numbers for file uploads */
    partNumbers?: string | number[];
}
/**
 * Response with headers
 */
interface HttpResponse<T> {
    data: T;
    headers: ResponseHeaders;
    status: number;
}
/**
 * HTTP client for making requests to the OpenAsset API
 */
declare class HttpClient {
    private readonly baseUrl;
    private readonly auth;
    private readonly timeout;
    private readonly defaultHeaders;
    constructor(config: HttpClientConfig);
    /**
     * Get the authorization header value
     */
    private getAuthHeader;
    /**
     * Build the full URL with query parameters
     */
    private buildUrl;
    /**
     * Parse response headers
     */
    private parseResponseHeaders;
    /**
     * Make an HTTP request
     */
    request<T>(method: HttpMethod, endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>>;
    /**
     * Make a GET request
     */
    get<T>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>>;
    /**
     * Make a POST request
     */
    post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<HttpResponse<T>>;
    /**
     * Make a PUT request
     */
    put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<HttpResponse<T>>;
    /**
     * Make a DELETE request
     */
    delete<T>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>>;
    /**
     * Make a MERGE request
     */
    merge<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<HttpResponse<T>>;
    /**
     * Make a HEAD request
     */
    head(endpoint: string, options?: RequestOptions): Promise<HttpResponse<void>>;
    /**
     * Get all items with automatic pagination
     */
    getAll<T>(endpoint: string, options?: RequestOptions, batchSize?: number): Promise<T[]>;
    /**
     * Get paginated results
     */
    getPaginated<T>(endpoint: string, options?: RequestOptions): Promise<PaginatedResponse<T>>;
}

/**
 * Base resource class for OpenAsset API resources
 */

/**
 * Options for list operations
 */
interface ListOptions extends QueryParams {
    /** Noun expansions */
    expand?: Record<string, 'all' | number | number[] | string>;
    /** Remote fields to include */
    remoteFields?: string | string[];
}
/**
 * Options for get operations
 */
interface GetOptions {
    /** Fields to display in response */
    displayFields?: string | string[];
    /** Noun expansions */
    expand?: Record<string, 'all' | number | number[] | string>;
    /** Remote fields to include */
    remoteFields?: string | string[];
}
/**
 * Base resource class with common CRUD operations
 */
declare abstract class BaseResource<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
    protected readonly httpClient: HttpClient;
    protected abstract readonly endpoint: string;
    constructor(httpClient: HttpClient);
    /**
     * Convert ListOptions to RequestOptions
     */
    protected toRequestOptions(options?: ListOptions | GetOptions): RequestOptions;
    /**
     * Get all resources with automatic pagination
     * @param options Query options
     * @param batchSize Number of items per batch (default: 100)
     */
    getAll(options?: ListOptions, batchSize?: number): Promise<T[]>;
    /**
     * Get resources with pagination
     * @param options Query options
     */
    list(options?: ListOptions): Promise<PaginatedResponse<T>>;
    /**
     * Get a single resource by ID
     * @param id Resource ID
     * @param options Query options
     */
    get(id: number, options?: GetOptions): Promise<T>;
    /**
     * Create a new resource
     * @param data Resource data
     */
    create(data: TCreate): Promise<T>;
    /**
     * Create multiple resources
     * @param data Array of resource data
     */
    createMany(data: TCreate[]): Promise<(T & BatchResponseItem)[]>;
    /**
     * Update a resource by ID
     * @param id Resource ID
     * @param data Update data
     */
    update(id: number, data: TUpdate): Promise<T>;
    /**
     * Update multiple resources
     * @param data Array of resources with IDs
     */
    updateMany(data: (TUpdate & {
        id: number;
    })[]): Promise<(T & BatchResponseItem)[]>;
    /**
     * Delete a resource by ID
     * @param id Resource ID
     */
    delete(id: number): Promise<void>;
    /**
     * Delete multiple resources by IDs
     * @param ids Array of resource IDs
     */
    deleteMany(ids: number[]): Promise<void>;
    /**
     * Get resource headers only (HEAD request)
     * @param id Optional resource ID
     */
    head(id?: number): Promise<{
        fullResultsCount: number;
    }>;
}
/**
 * Base resource class with merge support
 */
declare abstract class MergeableResource<T, TCreate = Partial<T>, TUpdate = Partial<T>> extends BaseResource<T, TCreate, TUpdate> {
    /**
     * Merge multiple resources into one
     * @param targetId ID of the resource to merge into
     * @param sourceIds IDs of resources to merge from
     */
    merge(targetId: number, sourceIds: number[]): Promise<T>;
}

interface AlbumListOptions extends ListOptions {
    /** Filter by user ID */
    user_id?: number;
    /** Filter by company album */
    company_album?: 0 | 1;
    /** Filter by shared album */
    shared_album?: 0 | 1;
}
interface AlbumGetOptions extends GetOptions {
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
declare class AlbumsResource extends MergeableResource<Album, AlbumCreate, AlbumUpdate> {
    protected readonly endpoint = "/Albums";
    constructor(httpClient: HttpClient);
    /**
     * Get all albums with optional filtering
     */
    getAll(options?: AlbumListOptions, batchSize?: number): Promise<Album[]>;
    /**
     * List albums with pagination
     */
    list(options?: AlbumListOptions): Promise<PaginatedResponse<Album>>;
    /**
     * Get a single album by ID
     */
    get(id: number, options?: AlbumGetOptions): Promise<Album>;
    /**
     * Add files to an album
     * @param albumId Album ID
     * @param fileIds File IDs to add
     */
    addFiles(albumId: number, fileIds: number | number[]): Promise<Album>;
    /**
     * Get files in an album
     * @param albumId Album ID
     * @param options Query options
     */
    getFiles(albumId: number, options?: ListOptions): Promise<IdReference[]>;
}

/**
 * AspectRatios resource
 */

/**
 * AspectRatios resource (read-only)
 */
declare class AspectRatiosResource extends BaseResource<AspectRatio, never, never> {
    protected readonly endpoint = "/AspectRatios";
    constructor(httpClient: HttpClient);
    /**
     * Get all aspect ratios
     */
    getAll(options?: ListOptions, batchSize?: number): Promise<AspectRatio[]>;
    create(): Promise<never>;
    createMany(): Promise<never>;
    update(): Promise<never>;
    updateMany(): Promise<never>;
    delete(): Promise<never>;
    deleteMany(): Promise<never>;
}

interface CategoryListOptions extends ListOptions {
    /** Filter by alive status */
    alive?: 0 | 1;
    /** Filter by projects category */
    projects_category?: 0 | 1;
}
/**
 * Categories resource for managing categories
 * Note: Categories cannot be created or deleted via API
 */
declare class CategoriesResource extends BaseResource<Category, never, CategoryUpdate> {
    protected readonly endpoint = "/Categories";
    constructor(httpClient: HttpClient);
    /**
     * Get all categories
     */
    getAll(options?: CategoryListOptions, batchSize?: number): Promise<Category[]>;
    /**
     * List categories with pagination
     */
    list(options?: CategoryListOptions): Promise<PaginatedResponse<Category>>;
    create(): Promise<never>;
    createMany(): Promise<never>;
    delete(): Promise<never>;
    deleteMany(): Promise<never>;
}

interface CopyrightHolderListOptions extends ListOptions {
    /** Filter by copyright policy ID */
    copyright_policy_id?: number;
    /** Filter by name */
    name?: string;
}
/**
 * CopyrightHolders resource for managing copyright holders
 */
declare class CopyrightHoldersResource extends MergeableResource<CopyrightHolder, CopyrightHolderCreate, CopyrightHolderUpdate> {
    protected readonly endpoint = "/CopyrightHolders";
    constructor(httpClient: HttpClient);
    /**
     * Get all copyright holders
     */
    getAll(options?: CopyrightHolderListOptions, batchSize?: number): Promise<CopyrightHolder[]>;
    /**
     * List copyright holders with pagination
     */
    list(options?: CopyrightHolderListOptions): Promise<PaginatedResponse<CopyrightHolder>>;
    delete(): Promise<never>;
    deleteMany(): Promise<never>;
}

interface CopyrightPolicyListOptions extends ListOptions {
    /** Filter by name */
    name?: string;
}
/**
 * CopyrightPolicies resource for managing copyright policies
 */
declare class CopyrightPoliciesResource extends MergeableResource<CopyrightPolicy, CopyrightPolicyCreate, CopyrightPolicyUpdate> {
    protected readonly endpoint = "/CopyrightPolicies";
    constructor(httpClient: HttpClient);
    /**
     * Get all copyright policies
     */
    getAll(options?: CopyrightPolicyListOptions, batchSize?: number): Promise<CopyrightPolicy[]>;
    /**
     * List copyright policies with pagination
     */
    list(options?: CopyrightPolicyListOptions): Promise<PaginatedResponse<CopyrightPolicy>>;
}

interface DataIntegrationListOptions extends ListOptions {
    /** Filter by alive status */
    alive?: 0 | 1;
    /** Filter by data integration type */
    data_integration_type?: DataIntegrationType;
}
interface DataIntegrationGetOptions extends GetOptions {
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
declare class DataIntegrationsResource extends BaseResource<DataIntegration, DataIntegrationCreate, DataIntegrationUpdate> {
    protected readonly endpoint = "/DataIntegrations";
    constructor(httpClient: HttpClient);
    /**
     * Get all data integrations
     */
    getAll(options?: DataIntegrationListOptions, batchSize?: number): Promise<DataIntegration[]>;
    /**
     * List data integrations with pagination
     */
    list(options?: DataIntegrationListOptions): Promise<PaginatedResponse<DataIntegration>>;
    /**
     * Get a single data integration by ID
     */
    get(id: number, options?: DataIntegrationGetOptions): Promise<DataIntegration>;
}

interface EmployeeListOptions extends ListOptions {
    /** Filter by alive status */
    alive?: 0 | 1;
    /** Include hero image ID in response */
    withHeroImage?: 0 | 1;
}
interface EmployeeGetOptions extends GetOptions {
    /** Include files expansion */
    files?: 'all';
    /** Include projects expansion */
    projects?: 'all';
    /** Include persons expansion */
    persons?: 'all';
    /** Include hero image ID in response */
    withHeroImage?: 0 | 1;
}
interface EmployeeFileDisplayOrder {
    id: number;
    display_order: number;
}
/**
 * Employees resource for managing employees
 */
declare class EmployeesResource extends BaseResource<Employee, EmployeeCreate, EmployeeUpdate> {
    protected readonly endpoint = "/Employees";
    constructor(httpClient: HttpClient);
    /**
     * Get all employees
     */
    getAll(options?: EmployeeListOptions, batchSize?: number): Promise<Employee[]>;
    /**
     * List employees with pagination
     */
    list(options?: EmployeeListOptions): Promise<PaginatedResponse<Employee>>;
    /**
     * Get a single employee by ID
     */
    get(id: number, options?: EmployeeGetOptions): Promise<Employee>;
    /**
     * Get files associated with an employee
     * @param employeeId Employee ID
     * @param options Query options
     */
    getFiles(employeeId: number, options?: ListOptions): Promise<EmployeeFile[]>;
    /**
     * Update file display order for an employee
     * @param employeeId Employee ID
     * @param files Array of file IDs with display orders
     */
    updateFileDisplayOrder(employeeId: number, files: EmployeeFileDisplayOrder[]): Promise<EmployeeFile[]>;
    /**
     * Get projects associated with an employee
     * @param employeeId Employee ID
     * @param options Query options
     */
    getProjects(employeeId: number, options?: ListOptions): Promise<EmployeeProject[]>;
    /**
     * Get project roles for an employee
     * @param employeeId Employee ID
     * @param projectId Project ID
     */
    getProjectRoles(employeeId: number, projectId: number): Promise<EmployeeProject>;
    /**
     * Update project roles for an employee
     * @param employeeId Employee ID
     * @param projectId Project ID
     * @param roles Grid data for roles
     */
    updateProjectRoles(employeeId: number, projectId: number, roles: GridData): Promise<EmployeeProject>;
}

interface FieldListOptions extends ListOptions {
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
interface FieldGetOptions extends GetOptions {
    /** Include fieldLookupStrings expansion */
    fieldLookupStrings?: 'all';
}
/**
 * Fields resource for managing fields
 */
declare class FieldsResource extends BaseResource<Field, FieldCreate, FieldUpdate> {
    protected readonly endpoint = "/Fields";
    constructor(httpClient: HttpClient);
    /**
     * Get all fields
     */
    getAll(options?: FieldListOptions, batchSize?: number): Promise<Field[]>;
    /**
     * List fields with pagination
     */
    list(options?: FieldListOptions): Promise<PaginatedResponse<Field>>;
    /**
     * Get a single field by ID
     */
    get(id: number, options?: FieldGetOptions): Promise<Field>;
    /**
     * Get field lookup strings (dropdown values) for a field
     * @param fieldId Field ID
     * @param options Query options
     */
    getFieldLookupStrings(fieldId: number, options?: ListOptions): Promise<FieldLookupString[]>;
    /**
     * Get grid columns for a grid field
     * @param fieldId Field ID
     * @param options Query options
     */
    getGridColumns(fieldId: number, options?: ListOptions): Promise<GridColumn[]>;
    /**
     * Create a grid column for a grid field
     * @param fieldId Field ID
     * @param data Grid column data
     */
    createGridColumn(fieldId: number, data: GridColumnCreate): Promise<GridColumn>;
    /**
     * Update a grid column
     * @param fieldId Field ID
     * @param columnId Column ID
     * @param data Update data
     */
    updateGridColumn(fieldId: number, columnId: number, data: GridColumnUpdate): Promise<GridColumn>;
    /**
     * Delete a grid column
     * @param fieldId Field ID
     * @param columnId Column ID
     */
    deleteGridColumn(fieldId: number, columnId: number): Promise<void>;
}

/**
 * Files resource
 */

interface FileListOptions extends ListOptions {
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
interface FileGetOptions extends GetOptions {
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
interface FileUploadOptions {
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
declare class FilesResource extends BaseResource<File, FileCreate, FileUpdate> {
    protected readonly endpoint = "/Files";
    constructor(httpClient: HttpClient);
    /**
     * Get all files with automatic pagination
     */
    getAll(options?: FileListOptions, batchSize?: number): Promise<File[]>;
    /**
     * List files with pagination
     */
    list(options?: FileListOptions): Promise<PaginatedResponse<File>>;
    /**
     * Get a single file by ID
     */
    get(id: number, options?: FileGetOptions): Promise<File>;
    /**
     * Get file with specific size info
     * @param id File ID
     * @param sizeIds Size IDs to include (or 'all')
     */
    getWithSizes(id: number, sizeIds: 'all' | number[]): Promise<File & {
        sizes: SizeInfo[];
    }>;
    /**
     * Generate an image URL for a specific size
     * @param id File ID
     * @param sizeId Size ID
     */
    getImageUrl(id: number, sizeId: number): Promise<string>;
    /**
     * Initiate file upload (for S3 direct upload)
     * @param options Upload options
     */
    initiateUpload(options: FileUploadOptions): Promise<FileCreateResponse>;
    /**
     * Get presigned URLs for additional parts
     * @param fileId File ID
     * @param partNumbers Part numbers to get URLs for
     */
    getPresignedUrls(fileId: number, partNumbers: number[]): Promise<FileCreateResponse>;
    /**
     * Complete S3 upload
     * @param fileId File ID
     * @param etags ETags from S3 upload responses
     */
    completeUpload(fileId: number, etags: Record<number, string> | string[]): Promise<File>;
    /**
     * Get fields for a file
     * @param fileId File ID
     */
    getFields(fileId: number): Promise<FieldValue[]>;
    /**
     * Update fields for a file
     * @param fileId File ID
     * @param fields Field values to update
     */
    updateFields(fileId: number, fields: FieldValue[]): Promise<File>;
    /**
     * Get keywords for a file
     * @param fileId File ID
     */
    getKeywords(fileId: number): Promise<IdReference[]>;
    /**
     * Add keywords to a file
     * @param fileId File ID
     * @param keywordIds Keyword IDs to add
     */
    addKeywords(fileId: number, keywordIds: number[]): Promise<void>;
    /**
     * Remove a keyword from a file
     * @param fileId File ID
     * @param keywordId Keyword ID to remove
     */
    removeKeyword(fileId: number, keywordId: number): Promise<void>;
    /**
     * Get albums containing a file
     * @param fileId File ID
     */
    getAlbums(fileId: number): Promise<IdReference[]>;
    /**
     * Get employees associated with a file
     * @param fileId File ID
     */
    getEmployees(fileId: number): Promise<IdReference[]>;
    /**
     * Associate employees with a file
     * @param fileId File ID
     * @param employeeIds Employee IDs to associate
     */
    addEmployees(fileId: number, employeeIds: number[]): Promise<void>;
    /**
     * Remove an employee association from a file
     * @param fileId File ID
     * @param employeeId Employee ID to remove
     */
    removeEmployee(fileId: number, employeeId: number): Promise<void>;
    /**
     * Rotate a file
     * @param fileId File ID
     * @param degrees Rotation degrees (0, 90, 180, 270)
     */
    rotate(fileId: number, degrees: 0 | 90 | 180 | 270): Promise<File>;
    /**
     * Update project display order for files
     * @param updates Array of file IDs with display orders
     */
    updateProjectDisplayOrder(updates: {
        id: number;
        project_display_order: number;
    }[]): Promise<File[]>;
}

interface GroupListOptions extends ListOptions {
    /** Filter by alive status */
    alive?: 0 | 1;
    /** Filter by hidden status */
    hidden?: 0 | 1;
    /** Filter by default_for_new_users status */
    default_for_new_users?: 0 | 1;
}
interface GroupGetOptions extends GetOptions {
    /** Include users expansion */
    users?: 'all';
}
/**
 * Groups resource for managing user groups
 */
declare class GroupsResource extends BaseResource<Group, GroupCreate, GroupUpdate> {
    protected readonly endpoint = "/Groups";
    constructor(httpClient: HttpClient);
    /**
     * Get all groups
     */
    getAll(options?: GroupListOptions, batchSize?: number): Promise<Group[]>;
    /**
     * List groups with pagination
     */
    list(options?: GroupListOptions): Promise<PaginatedResponse<Group>>;
    /**
     * Get a single group by ID
     */
    get(id: number, options?: GroupGetOptions): Promise<Group>;
    /**
     * Get users in a group
     * @param groupId Group ID
     */
    getUsers(groupId: number): Promise<IdReference[]>;
    /**
     * Add users to a group
     * @param groupId Group ID
     * @param userIds User IDs to add
     */
    addUsers(groupId: number, userIds: number[]): Promise<void>;
    /**
     * Remove a user from a group
     * @param groupId Group ID
     * @param userId User ID to remove
     */
    removeUser(groupId: number, userId: number): Promise<void>;
}

interface KeywordListOptions extends ListOptions {
    /** Filter by keyword category ID */
    keyword_category_id?: number;
    /** Filter by name */
    name?: string;
}
interface KeywordGetOptions extends GetOptions {
    /** Include files expansion */
    files?: 'all';
}
/**
 * Keywords resource for managing keywords
 */
declare class KeywordsResource extends MergeableResource<Keyword, KeywordCreate, KeywordUpdate> {
    protected readonly endpoint = "/Keywords";
    constructor(httpClient: HttpClient);
    /**
     * Get all keywords
     */
    getAll(options?: KeywordListOptions, batchSize?: number): Promise<Keyword[]>;
    /**
     * List keywords with pagination
     */
    list(options?: KeywordListOptions): Promise<PaginatedResponse<Keyword>>;
    /**
     * Get a single keyword by ID
     */
    get(id: number, options?: KeywordGetOptions): Promise<Keyword>;
    /**
     * Get files tagged with a keyword
     * @param keywordId Keyword ID
     */
    getFiles(keywordId: number): Promise<IdReference[]>;
}

interface KeywordCategoryListOptions extends ListOptions {
    /** Filter by category ID */
    category_id?: number;
    /** Filter by name */
    name?: string;
}
/**
 * KeywordCategories resource for managing keyword categories
 */
declare class KeywordCategoriesResource extends MergeableResource<KeywordCategory, KeywordCategoryCreate, KeywordCategoryUpdate> {
    protected readonly endpoint = "/KeywordCategories";
    constructor(httpClient: HttpClient);
    /**
     * Get all keyword categories
     */
    getAll(options?: KeywordCategoryListOptions, batchSize?: number): Promise<KeywordCategory[]>;
    /**
     * List keyword categories with pagination
     */
    list(options?: KeywordCategoryListOptions): Promise<PaginatedResponse<KeywordCategory>>;
}

interface PhotographerListOptions extends ListOptions {
    /** Filter by name */
    name?: string;
}
/**
 * Photographers resource for managing photographers
 */
declare class PhotographersResource extends MergeableResource<Photographer, PhotographerCreate, PhotographerUpdate> {
    protected readonly endpoint = "/Photographers";
    constructor(httpClient: HttpClient);
    /**
     * Get all photographers
     */
    getAll(options?: PhotographerListOptions, batchSize?: number): Promise<Photographer[]>;
    /**
     * List photographers with pagination
     */
    list(options?: PhotographerListOptions): Promise<PaginatedResponse<Photographer>>;
}

interface ProjectListOptions extends ListOptions {
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
interface ProjectGetOptions extends GetOptions {
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
declare class ProjectsResource extends BaseResource<Project, ProjectCreate, ProjectUpdate> {
    protected readonly endpoint = "/Projects";
    constructor(httpClient: HttpClient);
    /**
     * Get all projects
     */
    getAll(options?: ProjectListOptions, batchSize?: number): Promise<Project[]>;
    /**
     * List projects with pagination
     */
    list(options?: ProjectListOptions): Promise<PaginatedResponse<Project>>;
    /**
     * Get a single project by ID
     */
    get(id: number, options?: ProjectGetOptions): Promise<Project>;
    /**
     * Get fields for a project
     * @param projectId Project ID
     */
    getFields(projectId: number): Promise<FieldValue[]>;
    /**
     * Update fields for a project
     * @param projectId Project ID
     * @param fields Field values to update
     */
    updateFields(projectId: number, fields: FieldValue[]): Promise<Project>;
    /**
     * Get project keywords for a project
     * @param projectId Project ID
     */
    getProjectKeywords(projectId: number): Promise<IdReference[]>;
    /**
     * Add project keywords to a project
     * @param projectId Project ID
     * @param keywordIds Project keyword IDs to add
     */
    addProjectKeywords(projectId: number, keywordIds: number[]): Promise<void>;
    /**
     * Remove a project keyword from a project
     * @param projectId Project ID
     * @param keywordId Project keyword ID to remove
     */
    removeProjectKeyword(projectId: number, keywordId: number): Promise<void>;
    /**
     * Get albums associated with a project
     * @param projectId Project ID
     */
    getAlbums(projectId: number): Promise<IdReference[]>;
    /**
     * Get employees associated with a project
     * @param projectId Project ID
     * @param options Query options
     */
    getEmployees(projectId: number, options?: ListOptions): Promise<ProjectEmployee[]>;
    /**
     * Get employee roles for a project
     * @param projectId Project ID
     * @param employeeId Employee ID
     */
    getEmployeeRoles(projectId: number, employeeId: number): Promise<ProjectEmployee>;
    /**
     * Update employee roles for a project
     * @param projectId Project ID
     * @param employeeId Employee ID
     * @param roles Grid data for roles
     */
    updateEmployeeRoles(projectId: number, employeeId: number, roles: GridData): Promise<ProjectEmployee>;
    /**
     * Update project location
     * @param projectId Project ID
     * @param location Location coordinates
     */
    updateLocation(projectId: number, location: Location): Promise<Project>;
    /**
     * Get files in a project
     * @param projectId Project ID
     * @param options Query options
     */
    getFiles(projectId: number, options?: ListOptions): Promise<IdReference[]>;
}

interface ProjectKeywordListOptions extends ListOptions {
    /** Filter by project keyword category ID */
    project_keyword_category_id?: number;
    /** Filter by name */
    name?: string;
}
/**
 * ProjectKeywords resource for managing project keywords
 */
declare class ProjectKeywordsResource extends MergeableResource<ProjectKeyword, ProjectKeywordCreate, ProjectKeywordUpdate> {
    protected readonly endpoint = "/ProjectKeywords";
    constructor(httpClient: HttpClient);
    /**
     * Get all project keywords
     */
    getAll(options?: ProjectKeywordListOptions, batchSize?: number): Promise<ProjectKeyword[]>;
    /**
     * List project keywords with pagination
     */
    list(options?: ProjectKeywordListOptions): Promise<PaginatedResponse<ProjectKeyword>>;
}

interface ProjectKeywordCategoryListOptions extends ListOptions {
    /** Filter by name */
    name?: string;
}
/**
 * ProjectKeywordCategories resource for managing project keyword categories
 */
declare class ProjectKeywordCategoriesResource extends MergeableResource<ProjectKeywordCategory, ProjectKeywordCategoryCreate, ProjectKeywordCategoryUpdate> {
    protected readonly endpoint = "/ProjectKeywordCategories";
    constructor(httpClient: HttpClient);
    /**
     * Get all project keyword categories
     */
    getAll(options?: ProjectKeywordCategoryListOptions, batchSize?: number): Promise<ProjectKeywordCategory[]>;
    /**
     * List project keyword categories with pagination
     */
    list(options?: ProjectKeywordCategoryListOptions): Promise<PaginatedResponse<ProjectKeywordCategory>>;
}

/**
 * Searches resource
 */

interface SearchListOptions extends ListOptions {
    /** Filter by saved status */
    saved?: 0 | 1;
    /** Filter by user ID */
    user_id?: number;
    /** Filter by company saved search */
    company_saved_search?: 0 | 1;
    /** Filter by name */
    name?: string;
}
interface SearchGetOptions extends GetOptions {
    /** Include groups expansion */
    groups?: 'all';
    /** Include users expansion */
    users?: 'all';
}
/**
 * Searches resource for managing saved searches
 */
declare class SearchesResource extends BaseResource<Search, SearchCreate, SearchUpdate> {
    protected readonly endpoint = "/Searches";
    constructor(httpClient: HttpClient);
    /**
     * Get all searches
     */
    getAll(options?: SearchListOptions, batchSize?: number): Promise<Search[]>;
    /**
     * List searches with pagination
     */
    list(options?: SearchListOptions): Promise<PaginatedResponse<Search>>;
    /**
     * Get a single search by ID
     */
    get(id: number, options?: SearchGetOptions): Promise<Search>;
    /**
     * Get groups with access to a search
     * @param searchId Search ID
     */
    getGroups(searchId: number): Promise<IdReferenceWithModify[]>;
    /**
     * Get users with access to a search
     * @param searchId Search ID
     */
    getUsers(searchId: number): Promise<IdReferenceWithModify[]>;
    /**
     * Share search with groups
     * @param searchId Search ID
     * @param groups Array of group IDs with modify permissions
     */
    shareWithGroups(searchId: number, groups: {
        id: number;
        can_modify?: 0 | 1;
    }[]): Promise<void>;
    /**
     * Share search with users
     * @param searchId Search ID
     * @param users Array of user IDs with modify permissions
     */
    shareWithUsers(searchId: number, users: {
        id: number;
        can_modify?: 0 | 1;
    }[]): Promise<void>;
    /**
     * Execute a search and get results
     * @param searchId Search ID
     * @param options Query options
     */
    execute(searchId: number, options?: ListOptions): Promise<PaginatedResponse<File>>;
}

interface SizeListOptions extends ListOptions {
    /** Filter by alive status */
    alive?: 0 | 1;
    /** Filter by original status */
    original?: 0 | 1;
    /** Filter by file format */
    file_format?: string;
}
/**
 * Sizes resource for managing image sizes
 */
declare class SizesResource extends BaseResource<Size, SizeCreate, SizeUpdate> {
    protected readonly endpoint = "/Sizes";
    constructor(httpClient: HttpClient);
    /**
     * Get all sizes
     */
    getAll(options?: SizeListOptions, batchSize?: number): Promise<Size[]>;
    /**
     * List sizes with pagination
     */
    list(options?: SizeListOptions): Promise<PaginatedResponse<Size>>;
    /**
     * Get the original size
     */
    getOriginal(): Promise<Size | undefined>;
    /**
     * Get sizes that can be used for zip exports
     */
    getZipSizes(): Promise<Size[]>;
}

/**
 * TextRewrites resource
 */

/**
 * TextRewrites resource (read-only)
 */
declare class TextRewritesResource extends BaseResource<TextRewrite, never, never> {
    protected readonly endpoint = "/TextRewrites";
    constructor(httpClient: HttpClient);
    /**
     * Get all text rewrites
     */
    getAll(options?: ListOptions, batchSize?: number): Promise<TextRewrite[]>;
    create(): Promise<never>;
    createMany(): Promise<never>;
    update(): Promise<never>;
    updateMany(): Promise<never>;
    delete(): Promise<never>;
    deleteMany(): Promise<never>;
}

interface TopicListOptions extends ListOptions {
    /** Filter by name */
    name?: string;
    /** Filter by protected status */
    protected?: 0 | 1;
}
interface TopicGetOptions extends GetOptions {
    /** Include albums expansion */
    albums?: 'all';
}
/**
 * Topics resource for managing topics
 */
declare class TopicsResource extends MergeableResource<Topic, TopicCreate, TopicUpdate> {
    protected readonly endpoint = "/Topics";
    constructor(httpClient: HttpClient);
    /**
     * Get all topics
     */
    getAll(options?: TopicListOptions, batchSize?: number): Promise<Topic[]>;
    /**
     * List topics with pagination
     */
    list(options?: TopicListOptions): Promise<PaginatedResponse<Topic>>;
    /**
     * Get a single topic by ID
     */
    get(id: number, options?: TopicGetOptions): Promise<Topic>;
    /**
     * Get albums in a topic
     * @param topicId Topic ID
     */
    getAlbums(topicId: number): Promise<IdReference[]>;
}

interface UserListOptions extends ListOptions {
    /** Filter by alive status */
    alive?: 0 | 1;
    /** Filter by username */
    username?: string;
    /** Filter by email */
    email?: string;
    /** Filter by full name */
    full_name?: string;
    /** Filter by valid status */
    valid?: 0 | 1;
    /** Filter by hidden status */
    hidden?: 0 | 1;
}
interface UserGetOptions extends GetOptions {
    /** Include groups expansion */
    groups?: 'all';
}
/**
 * Users resource for managing users
 */
declare class UsersResource extends BaseResource<User, UserCreate, UserUpdate> {
    protected readonly endpoint = "/Users";
    constructor(httpClient: HttpClient);
    /**
     * Get all users
     */
    getAll(options?: UserListOptions, batchSize?: number): Promise<User[]>;
    /**
     * List users with pagination
     */
    list(options?: UserListOptions): Promise<PaginatedResponse<User>>;
    /**
     * Get a single user by ID
     */
    get(id: number, options?: UserGetOptions): Promise<User>;
    /**
     * Get groups a user belongs to
     * @param userId User ID
     */
    getGroups(userId: number): Promise<IdReference[]>;
    /**
     * Get user by username
     * @param username Username to search for
     */
    getByUsername(username: string): Promise<User | undefined>;
    /**
     * Get user by email
     * @param email Email to search for
     */
    getByEmail(email: string): Promise<User | undefined>;
}

/**
 * OpenAsset Client
 *
 * Main entry point for the OpenAsset SDK
 */

/**
 * Configuration options for OpenAssetClient
 */
interface OpenAssetClientConfig {
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
 * import { OpenAssetClient } from 'openassetjs';
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
declare class OpenAssetClient {
    private readonly httpClient;
    /** Albums resource */
    readonly albums: AlbumsResource;
    /** Aspect Ratios resource (read-only) */
    readonly aspectRatios: AspectRatiosResource;
    /** Categories resource */
    readonly categories: CategoriesResource;
    /** Copyright Holders resource */
    readonly copyrightHolders: CopyrightHoldersResource;
    /** Copyright Policies resource */
    readonly copyrightPolicies: CopyrightPoliciesResource;
    /** Data Integrations resource */
    readonly dataIntegrations: DataIntegrationsResource;
    /** Employees resource */
    readonly employees: EmployeesResource;
    /** Fields resource */
    readonly fields: FieldsResource;
    /** Files resource */
    readonly files: FilesResource;
    /** Groups resource */
    readonly groups: GroupsResource;
    /** Keywords resource */
    readonly keywords: KeywordsResource;
    /** Keyword Categories resource */
    readonly keywordCategories: KeywordCategoriesResource;
    /** Photographers resource */
    readonly photographers: PhotographersResource;
    /** Projects resource */
    readonly projects: ProjectsResource;
    /** Project Keywords resource */
    readonly projectKeywords: ProjectKeywordsResource;
    /** Project Keyword Categories resource */
    readonly projectKeywordCategories: ProjectKeywordCategoriesResource;
    /** Searches resource */
    readonly searches: SearchesResource;
    /** Sizes resource */
    readonly sizes: SizesResource;
    /** Text Rewrites resource (read-only) */
    readonly textRewrites: TextRewritesResource;
    /** Topics resource */
    readonly topics: TopicsResource;
    /** Users resource */
    readonly users: UsersResource;
    constructor(config: OpenAssetClientConfig);
    /**
     * Get the underlying HTTP client for advanced usage
     */
    getHttpClient(): HttpClient;
}
/**
 * Create a new OpenAsset client
 *
 * @example
 * ```typescript
 * import { createClient } from 'openassetjs';
 *
 * const client = createClient({
 *   domain: 'your-company',
 *   tokenId: 'your-token-id',
 *   tokenString: 'your-token-string',
 * });
 * ```
 */
declare function createClient(config: OpenAssetClientConfig): OpenAssetClient;

/**
 * Custom error classes for OpenAsset SDK
 */
/**
 * Base error class for OpenAsset API errors
 */
declare class OpenAssetError extends Error {
    readonly statusCode?: number;
    readonly response?: unknown;
    constructor(message: string, statusCode?: number, response?: unknown);
}
/**
 * Error thrown when authentication fails
 */
declare class AuthenticationError extends OpenAssetError {
    constructor(message?: string);
}
/**
 * Error thrown when access is forbidden
 */
declare class ForbiddenError extends OpenAssetError {
    constructor(message?: string);
}
/**
 * Error thrown when a resource is not found
 */
declare class NotFoundError extends OpenAssetError {
    constructor(message?: string);
}
/**
 * Error thrown when the HTTP method is not allowed
 */
declare class MethodNotAllowedError extends OpenAssetError {
    constructor(message?: string);
}
/**
 * Error thrown when there's a conflict (e.g., duplicate resource)
 */
declare class ConflictError extends OpenAssetError {
    constructor(message?: string);
}
/**
 * Error thrown when the request is valid but cannot be processed
 */
declare class UnprocessableEntityError extends OpenAssetError {
    constructor(message?: string);
}
/**
 * Error thrown for bad requests
 */
declare class BadRequestError extends OpenAssetError {
    constructor(message?: string);
}
/**
 * Error thrown for server errors
 */
declare class ServerError extends OpenAssetError {
    constructor(message?: string);
}

export { type AWSPresignedUrl, type Album, type AlbumCreate, type AlbumGetOptions, type AlbumListOptions, type AlbumUpdate, AlbumsResource, type AspectRatio, AspectRatiosResource, type AuthConfig, AuthenticationError, BadRequestError, BaseResource, type BatchResponseItem, type BooleanInt, CategoriesResource, type Category, type CategoryListOptions, type CategoryUpdate, type Colourspace, ConflictError, type CopyrightHolder, type CopyrightHolderCreate, type CopyrightHolderListOptions, type CopyrightHolderUpdate, CopyrightHoldersResource, CopyrightPoliciesResource, type CopyrightPolicy, type CopyrightPolicyCreate, type CopyrightPolicyListOptions, type CopyrightPolicyUpdate, type DataIntegration, type DataIntegrationCreate, type DataIntegrationGetOptions, type DataIntegrationListOptions, type DataIntegrationType, type DataIntegrationUpdate, DataIntegrationsResource, type DateTime, type Employee, type EmployeeCreate, type EmployeeFile, type EmployeeFileDisplayOrder, type EmployeeGetOptions, type EmployeeListOptions, type EmployeeProject, type EmployeeUpdate, EmployeesResource, type Field, type FieldCreate, type FieldDisplayType, type FieldGetOptions, type FieldListOptions, type FieldLookupString, type FieldType, type FieldUpdate, type FieldValue, FieldsResource, type File, type FileCreate, type FileCreateResponse, type FileFormat, type FileGetOptions, type FileListOptions, type FileUpdate, type FileUploadComplete, type FileUploadOptions, FilesResource, type FilterBy, type FilterObject, ForbiddenError, type GetOptions, type GridColumn, type GridColumnCreate, type GridColumnUpdate, type GridData, type GridRow, type Group, type GroupCreate, type GroupGetOptions, type GroupListOptions, type GroupUpdate, GroupsResource, HttpClient, type HttpClientConfig, type HttpMethod, type HttpResponse, type IdReference, type IdReferenceWithModify, type Keyword, KeywordCategoriesResource, type KeywordCategory, type KeywordCategoryCreate, type KeywordCategoryListOptions, type KeywordCategoryUpdate, type KeywordCreate, type KeywordGetOptions, type KeywordListOptions, type KeywordUpdate, KeywordsResource, type ListOptions, type Location, MergeableResource, MethodNotAllowedError, NotFoundError, type NounExpansion, OpenAssetClient, type OpenAssetClientConfig, OpenAssetError, type PaginatedResponse, type Photographer, type PhotographerCreate, type PhotographerListOptions, type PhotographerUpdate, PhotographersResource, type Project, type ProjectCreate, type ProjectEmployee, type ProjectGetOptions, type ProjectKeyword, ProjectKeywordCategoriesResource, type ProjectKeywordCategory, type ProjectKeywordCategoryCreate, type ProjectKeywordCategoryListOptions, type ProjectKeywordCategoryUpdate, type ProjectKeywordCreate, type ProjectKeywordListOptions, type ProjectKeywordUpdate, ProjectKeywordsResource, type ProjectListOptions, type ProjectUpdate, ProjectsResource, type QueryParams, type RequestOptions, type ResponseHeaders, type S3UploadComplete, type Search, type SearchCreate, type SearchGetOptions, type SearchItem, type SearchItemCode, type SearchListOptions, type SearchOperator, type SearchUpdate, SearchesResource, ServerError, type Size, type SizeCreate, type SizeInfo, type SizeListOptions, type SizeUpdate, SizesResource, type TextMatching, type TextRewrite, TextRewritesResource, type Topic, type TopicCreate, type TopicGetOptions, type TopicListOptions, type TopicUpdate, TopicsResource, UnprocessableEntityError, type User, type UserCreate, type UserGetOptions, type UserListOptions, type UserUpdate, UsersResource, type ValueOrderBy, createClient };
