// src/utils/errors.ts
var OpenAssetError = class _OpenAssetError extends Error {
  constructor(message, statusCode, response) {
    super(message);
    this.name = "OpenAssetError";
    this.statusCode = statusCode;
    this.response = response;
    Object.setPrototypeOf(this, _OpenAssetError.prototype);
  }
};
var AuthenticationError = class _AuthenticationError extends OpenAssetError {
  constructor(message = "Authentication failed") {
    super(message, 401);
    this.name = "AuthenticationError";
    Object.setPrototypeOf(this, _AuthenticationError.prototype);
  }
};
var ForbiddenError = class _ForbiddenError extends OpenAssetError {
  constructor(message = "Access denied") {
    super(message, 403);
    this.name = "ForbiddenError";
    Object.setPrototypeOf(this, _ForbiddenError.prototype);
  }
};
var NotFoundError = class _NotFoundError extends OpenAssetError {
  constructor(message = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, _NotFoundError.prototype);
  }
};
var MethodNotAllowedError = class _MethodNotAllowedError extends OpenAssetError {
  constructor(message = "Method not allowed") {
    super(message, 405);
    this.name = "MethodNotAllowedError";
    Object.setPrototypeOf(this, _MethodNotAllowedError.prototype);
  }
};
var ConflictError = class _ConflictError extends OpenAssetError {
  constructor(message = "Resource conflict") {
    super(message, 409);
    this.name = "ConflictError";
    Object.setPrototypeOf(this, _ConflictError.prototype);
  }
};
var UnprocessableEntityError = class _UnprocessableEntityError extends OpenAssetError {
  constructor(message = "Unprocessable entity") {
    super(message, 422);
    this.name = "UnprocessableEntityError";
    Object.setPrototypeOf(this, _UnprocessableEntityError.prototype);
  }
};
var BadRequestError = class _BadRequestError extends OpenAssetError {
  constructor(message = "Bad request") {
    super(message, 400);
    this.name = "BadRequestError";
    Object.setPrototypeOf(this, _BadRequestError.prototype);
  }
};
var ServerError = class _ServerError extends OpenAssetError {
  constructor(message = "Internal server error") {
    super(message, 500);
    this.name = "ServerError";
    Object.setPrototypeOf(this, _ServerError.prototype);
  }
};
function createErrorFromStatus(statusCode, message, response) {
  switch (statusCode) {
    case 400:
      return new BadRequestError(message);
    case 401:
      return new AuthenticationError(message);
    case 403:
      return new ForbiddenError(message);
    case 404:
      return new NotFoundError(message);
    case 405:
      return new MethodNotAllowedError(message);
    case 409:
      return new ConflictError(message);
    case 422:
      return new UnprocessableEntityError(message);
    case 500:
      return new ServerError(message);
    default:
      return new OpenAssetError(message, statusCode, response);
  }
}

// src/utils/http-client.ts
function buildQueryString(params) {
  const searchParams = new URLSearchParams();
  const processValue = (key, value) => {
    if (value === void 0 || value === null) {
      return;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return;
      if (value.every((v) => typeof v === "string" || typeof v === "number")) {
        searchParams.append(key, value.join(","));
      } else {
        value.forEach((item, index) => {
          if (typeof item === "object" && item !== null) {
            Object.entries(item).forEach(([subKey, subValue]) => {
              searchParams.append(`${key}[${index}][${subKey}]`, String(subValue));
            });
          } else {
            searchParams.append(`${key}[]`, String(item));
          }
        });
      }
    } else if (typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (subKey === "-or" || subKey === "-and") {
          processValue(`${key}[${subKey}]`, subValue);
        } else {
          processValue(`${key}[${subKey}]`, subValue);
        }
      });
    } else {
      searchParams.append(key, String(value));
    }
  };
  Object.entries(params).forEach(([key, value]) => {
    processValue(key, value);
  });
  return searchParams.toString();
}
var HttpClient = class {
  constructor(config) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.auth = config.auth;
    this.timeout = config.timeout ?? 3e4;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...config.headers
    };
  }
  /**
   * Get the authorization header value
   */
  getAuthHeader() {
    return `OATU ${this.auth.tokenId}:${this.auth.tokenString}`;
  }
  /**
   * Build the full URL with query parameters
   */
  buildUrl(endpoint, options) {
    const url = `${this.baseUrl}/REST/1${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const params = {};
    if (options?.params) {
      Object.assign(params, options.params);
    }
    if (options?.expand) {
      Object.entries(options.expand).forEach(([key, value]) => {
        params[key] = value;
      });
    }
    if (options?.remoteFields) {
      params.remoteFields = Array.isArray(options.remoteFields) ? options.remoteFields.join(",") : options.remoteFields;
    }
    if (options?.partNumbers) {
      params.partNumbers = Array.isArray(options.partNumbers) ? options.partNumbers.join(",") : options.partNumbers;
    }
    const queryString = buildQueryString(params);
    return queryString ? `${url}?${queryString}` : url;
  }
  /**
   * Parse response headers
   */
  parseResponseHeaders(headers) {
    const responseHeaders = {};
    const headerMap = {
      "x-sessionkey": "X-SessionKey",
      "x-full-results-count": "X-Full-Results-Count",
      "x-display-results-count": "X-Display-Results-Count",
      "x-offset": "X-Offset",
      "x-timing": "X-Timing",
      "x-username": "X-Username",
      "x-user-id": "X-User-Id",
      "x-openasset-version": "X-OpenAsset-Version",
      "x-ignored-fields": "X-Ignored-Fields"
    };
    headers.forEach((value, key) => {
      const normalizedKey = key.toLowerCase();
      if (headerMap[normalizedKey]) {
        responseHeaders[headerMap[normalizedKey]] = value;
      }
    });
    return responseHeaders;
  }
  /**
   * Make an HTTP request
   */
  async request(method, endpoint, options) {
    const url = this.buildUrl(endpoint, options);
    const headers = {
      ...this.defaultHeaders,
      Authorization: this.getAuthHeader(),
      ...options?.headers
    };
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options?.timeout ?? this.timeout);
    try {
      const fetchOptions = {
        method,
        headers,
        signal: controller.signal
      };
      if (options?.body && method !== "GET" && method !== "HEAD") {
        fetchOptions.body = JSON.stringify(options.body);
      }
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      const responseHeaders = this.parseResponseHeaders(response.headers);
      if (method === "HEAD") {
        return {
          data: {},
          headers: responseHeaders,
          status: response.status
        };
      }
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }
      if (!response.ok) {
        const errorMessage = typeof data === "object" && data !== null && "message" in data ? String(data.message) : `Request failed with status ${response.status}`;
        throw createErrorFromStatus(response.status, errorMessage, data);
      }
      return {
        data,
        headers: responseHeaders,
        status: response.status
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof OpenAssetError) {
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new OpenAssetError("Request timeout", void 0, void 0);
        }
        throw new OpenAssetError(error.message, void 0, void 0);
      }
      throw new OpenAssetError("Unknown error occurred", void 0, void 0);
    }
  }
  /**
   * Make a GET request
   */
  async get(endpoint, options) {
    return this.request("GET", endpoint, options);
  }
  /**
   * Make a POST request
   */
  async post(endpoint, body, options) {
    return this.request("POST", endpoint, { ...options, body });
  }
  /**
   * Make a PUT request
   */
  async put(endpoint, body, options) {
    return this.request("PUT", endpoint, { ...options, body });
  }
  /**
   * Make a DELETE request
   */
  async delete(endpoint, options) {
    return this.request("DELETE", endpoint, options);
  }
  /**
   * Make a MERGE request
   */
  async merge(endpoint, body, options) {
    return this.request("MERGE", endpoint, { ...options, body });
  }
  /**
   * Make a HEAD request
   */
  async head(endpoint, options) {
    return this.request("HEAD", endpoint, options);
  }
  /**
   * Get all items with automatic pagination
   */
  async getAll(endpoint, options, batchSize = 100) {
    const results = [];
    let offset = 0;
    let hasMore = true;
    while (hasMore) {
      const response = await this.get(endpoint, {
        ...options,
        params: {
          ...options?.params,
          limit: batchSize,
          offset
        }
      });
      if (Array.isArray(response.data)) {
        results.push(...response.data);
        const fullCount = parseInt(response.headers["X-Full-Results-Count"] || "0", 10);
        offset += batchSize;
        hasMore = offset < fullCount && response.data.length === batchSize;
      } else {
        hasMore = false;
      }
    }
    return results;
  }
  /**
   * Get paginated results
   */
  async getPaginated(endpoint, options) {
    const response = await this.get(endpoint, options);
    return {
      data: Array.isArray(response.data) ? response.data : [response.data],
      fullResultsCount: parseInt(response.headers["X-Full-Results-Count"] || "0", 10),
      displayResultsCount: parseInt(response.headers["X-Display-Results-Count"] || "0", 10),
      offset: parseInt(response.headers["X-Offset"] || "0", 10)
    };
  }
};

// src/resources/base.ts
var BaseResource = class {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }
  /**
   * Convert ListOptions to RequestOptions
   */
  toRequestOptions(options) {
    if (!options) return {};
    const { expand, remoteFields, ...params } = options;
    return {
      params,
      expand,
      remoteFields
    };
  }
  /**
   * Get all resources with automatic pagination
   * @param options Query options
   * @param batchSize Number of items per batch (default: 100)
   */
  async getAll(options, batchSize = 100) {
    return this.httpClient.getAll(this.endpoint, this.toRequestOptions(options), batchSize);
  }
  /**
   * Get resources with pagination
   * @param options Query options
   */
  async list(options) {
    return this.httpClient.getPaginated(this.endpoint, this.toRequestOptions(options));
  }
  /**
   * Get a single resource by ID
   * @param id Resource ID
   * @param options Query options
   */
  async get(id, options) {
    const response = await this.httpClient.get(
      `${this.endpoint}/${id}`,
      this.toRequestOptions(options)
    );
    return Array.isArray(response.data) ? response.data[0] : response.data;
  }
  /**
   * Create a new resource
   * @param data Resource data
   */
  async create(data) {
    const response = await this.httpClient.post(this.endpoint, data);
    return response.data;
  }
  /**
   * Create multiple resources
   * @param data Array of resource data
   */
  async createMany(data) {
    const response = await this.httpClient.post(this.endpoint, data);
    return response.data;
  }
  /**
   * Update a resource by ID
   * @param id Resource ID
   * @param data Update data
   */
  async update(id, data) {
    const response = await this.httpClient.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }
  /**
   * Update multiple resources
   * @param data Array of resources with IDs
   */
  async updateMany(data) {
    const response = await this.httpClient.put(this.endpoint, data);
    return response.data;
  }
  /**
   * Delete a resource by ID
   * @param id Resource ID
   */
  async delete(id) {
    await this.httpClient.delete(`${this.endpoint}/${id}`);
  }
  /**
   * Delete multiple resources by IDs
   * @param ids Array of resource IDs
   */
  async deleteMany(ids) {
    await this.httpClient.delete(this.endpoint, {
      params: { id: ids.join(",") }
    });
  }
  /**
   * Get resource headers only (HEAD request)
   * @param id Optional resource ID
   */
  async head(id) {
    const endpoint = id ? `${this.endpoint}/${id}` : this.endpoint;
    const response = await this.httpClient.head(endpoint);
    return {
      fullResultsCount: parseInt(response.headers["X-Full-Results-Count"] || "0", 10)
    };
  }
};
var MergeableResource = class extends BaseResource {
  /**
   * Merge multiple resources into one
   * @param targetId ID of the resource to merge into
   * @param sourceIds IDs of resources to merge from
   */
  async merge(targetId, sourceIds) {
    const body = sourceIds.map((id) => ({ id }));
    const response = await this.httpClient.merge(`${this.endpoint}/${targetId}`, body);
    return response.data;
  }
};

// src/resources/albums.ts
var AlbumsResource = class extends MergeableResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/Albums";
  }
  /**
   * Get all albums with optional filtering
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List albums with pagination
   */
  async list(options) {
    const requestOptions = {};
    if (options) {
      const { remoteFields, ...params } = options;
      requestOptions.params = params;
      if (remoteFields) {
        requestOptions.remoteFields = remoteFields;
      }
    }
    return this.httpClient.getPaginated(this.endpoint, requestOptions);
  }
  /**
   * Get a single album by ID
   */
  async get(id, options) {
    return super.get(id, options);
  }
  /**
   * Add files to an album
   * @param albumId Album ID
   * @param fileIds File IDs to add
   */
  async addFiles(albumId, fileIds) {
    return this.update(albumId, { files: fileIds });
  }
  /**
   * Get files in an album
   * @param albumId Album ID
   * @param options Query options
   */
  async getFiles(albumId, options) {
    const response = await this.httpClient.get(
      `${this.endpoint}/${albumId}/Files`,
      this.toRequestOptions(options)
    );
    return response.data;
  }
  /**
   * Remove a file from an album
   * @param albumId Album ID
   * @param fileId File ID to remove
   */
  async removeFile(albumId, fileId) {
    await this.httpClient.delete(`${this.endpoint}/${albumId}/Files/${fileId}`);
  }
  /**
   * Remove multiple files from an album
   * @param albumId Album ID
   * @param fileIds File IDs to remove
   */
  async removeFiles(albumId, fileIds) {
    await this.httpClient.delete(`${this.endpoint}/${albumId}/Files`, {
      params: { id: fileIds.join(",") }
    });
  }
};

// src/resources/aspect-ratios.ts
var AspectRatiosResource = class extends BaseResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/AspectRatios";
  }
  /**
   * Get all aspect ratios
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  // Override write methods to throw errors (read-only resource)
  async create() {
    throw new Error("AspectRatios is a read-only resource");
  }
  async createMany() {
    throw new Error("AspectRatios is a read-only resource");
  }
  async update() {
    throw new Error("AspectRatios is a read-only resource");
  }
  async updateMany() {
    throw new Error("AspectRatios is a read-only resource");
  }
  async delete() {
    throw new Error("AspectRatios is a read-only resource");
  }
  async deleteMany() {
    throw new Error("AspectRatios is a read-only resource");
  }
};

// src/resources/categories.ts
var CategoriesResource = class extends BaseResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/Categories";
  }
  /**
   * Get all categories
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List categories with pagination
   */
  async list(options) {
    return super.list(options);
  }
  // Override create/delete methods (not supported)
  async create() {
    throw new Error("Categories cannot be created via API");
  }
  async createMany() {
    throw new Error("Categories cannot be created via API");
  }
  async delete() {
    throw new Error("Categories cannot be deleted via API");
  }
  async deleteMany() {
    throw new Error("Categories cannot be deleted via API");
  }
};

// src/resources/copyright-holders.ts
var CopyrightHoldersResource = class extends MergeableResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/CopyrightHolders";
  }
  /**
   * Get all copyright holders
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List copyright holders with pagination
   */
  async list(options) {
    return super.list(options);
  }
  // CopyrightHolders cannot be deleted via API
  async delete() {
    throw new Error("CopyrightHolders cannot be deleted via API");
  }
  async deleteMany() {
    throw new Error("CopyrightHolders cannot be deleted via API");
  }
};

// src/resources/copyright-policies.ts
var CopyrightPoliciesResource = class extends MergeableResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/CopyrightPolicies";
  }
  /**
   * Get all copyright policies
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List copyright policies with pagination
   */
  async list(options) {
    return super.list(options);
  }
};

// src/resources/data-integrations.ts
var DataIntegrationsResource = class extends BaseResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/DataIntegrations";
  }
  /**
   * Get all data integrations
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List data integrations with pagination
   */
  async list(options) {
    return super.list(options);
  }
  /**
   * Get a single data integration by ID
   */
  async get(id, options) {
    return super.get(id, options);
  }
};

// src/resources/employees.ts
var EmployeesResource = class extends BaseResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/Employees";
  }
  /**
   * Get all employees
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List employees with pagination
   */
  async list(options) {
    return super.list(options);
  }
  /**
   * Get a single employee by ID
   */
  async get(id, options) {
    return super.get(id, options);
  }
  /**
   * Get files associated with an employee
   * @param employeeId Employee ID
   * @param options Query options
   */
  async getFiles(employeeId, options) {
    const response = await this.httpClient.get(
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
  async updateFileDisplayOrder(employeeId, files) {
    const response = await this.httpClient.put(
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
  async getProjects(employeeId, options) {
    const response = await this.httpClient.get(
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
  async getProjectRoles(employeeId, projectId) {
    const response = await this.httpClient.get(
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
  async updateProjectRoles(employeeId, projectId, roles) {
    const response = await this.httpClient.post(
      `${this.endpoint}/${employeeId}/Projects/${projectId}`,
      { id: projectId, roles }
    );
    return response.data;
  }
  /**
   * Associate files with an employee
   * @param employeeId Employee ID
   * @param fileIds File IDs to associate
   */
  async addFiles(employeeId, fileIds) {
    const files = fileIds.map((id) => ({ id }));
    await this.httpClient.post(`${this.endpoint}/${employeeId}/Files`, files);
  }
  /**
   * Remove a file association from an employee
   * @param employeeId Employee ID
   * @param fileId File ID to remove
   */
  async removeFile(employeeId, fileId) {
    await this.httpClient.delete(`${this.endpoint}/${employeeId}/Files/${fileId}`);
  }
};

// src/resources/fields.ts
var FieldsResource = class extends BaseResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/Fields";
  }
  /**
   * Get all fields
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List fields with pagination
   */
  async list(options) {
    return super.list(options);
  }
  /**
   * Get a single field by ID
   */
  async get(id, options) {
    return super.get(id, options);
  }
  /**
   * Get field lookup strings (dropdown values) for a field
   * @param fieldId Field ID
   * @param options Query options
   */
  async getFieldLookupStrings(fieldId, options) {
    const response = await this.httpClient.get(
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
  async getGridColumns(fieldId, options) {
    const response = await this.httpClient.get(
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
  async createGridColumn(fieldId, data) {
    const response = await this.httpClient.post(
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
  async updateGridColumn(fieldId, columnId, data) {
    const response = await this.httpClient.put(
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
  async deleteGridColumn(fieldId, columnId) {
    await this.httpClient.delete(`${this.endpoint}/${fieldId}/GridColumns/${columnId}`);
  }
};

// src/resources/files.ts
var FilesResource = class extends BaseResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/Files";
  }
  /**
   * Get all files with automatic pagination
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize ?? 100);
  }
  /**
   * List files with pagination
   */
  async list(options) {
    const requestOptions = {};
    if (options) {
      const { remoteFields, ...params } = options;
      requestOptions.params = params;
      if (remoteFields) {
        requestOptions.remoteFields = remoteFields;
      }
    }
    return this.httpClient.getPaginated(this.endpoint, requestOptions);
  }
  /**
   * Get a single file by ID
   */
  async get(id, options) {
    return super.get(id, options);
  }
  /**
   * Get file with specific size info
   * @param id File ID
   * @param sizeIds Size IDs to include (or 'all')
   */
  async getWithSizes(id, sizeIds) {
    const sizes = sizeIds === "all" ? "all" : sizeIds.join(",");
    return super.get(id, { expand: { sizes } });
  }
  /**
   * Generate an image URL for a specific size
   * @param id File ID
   * @param sizeId Size ID
   */
  async getImageUrl(id, sizeId) {
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
  async initiateUpload(options) {
    const requestOptions = {};
    if (options.partNumbers) {
      requestOptions.partNumbers = options.partNumbers;
    }
    const body = {
      category_id: options.category_id,
      original_filename: options.original_filename,
      project_id: options.project_id,
      original_filesize: options.original_filesize,
      part_size: options.part_size
    };
    const response = await this.httpClient.post(
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
  async getPresignedUrls(fileId, partNumbers) {
    const response = await this.httpClient.get(
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
  async completeUpload(fileId, etags) {
    const body = {
      id: fileId,
      s3_upload_complete: 1,
      etags
    };
    const response = await this.httpClient.put(`${this.endpoint}/${fileId}`, body);
    return response.data;
  }
  /**
   * Get fields for a file
   * @param fileId File ID
   */
  async getFields(fileId) {
    const file = await this.get(fileId, { expand: { fields: "all" } });
    return file.fields ?? [];
  }
  /**
   * Update fields for a file
   * @param fileId File ID
   * @param fields Field values to update
   */
  async updateFields(fileId, fields) {
    const response = await this.httpClient.put(`${this.endpoint}/${fileId}`, { fields });
    return response.data;
  }
  /**
   * Get keywords for a file
   * @param fileId File ID
   */
  async getKeywords(fileId) {
    const file = await this.get(fileId, { expand: { keywords: "all" } });
    return file.keywords ?? [];
  }
  /**
   * Add keywords to a file
   * @param fileId File ID
   * @param keywordIds Keyword IDs to add
   */
  async addKeywords(fileId, keywordIds) {
    const keywords = keywordIds.map((id) => ({ id }));
    await this.httpClient.post(`${this.endpoint}/${fileId}/Keywords`, keywords);
  }
  /**
   * Remove a keyword from a file
   * @param fileId File ID
   * @param keywordId Keyword ID to remove
   */
  async removeKeyword(fileId, keywordId) {
    await this.httpClient.delete(`${this.endpoint}/${fileId}/Keywords/${keywordId}`);
  }
  /**
   * Get albums containing a file
   * @param fileId File ID
   */
  async getAlbums(fileId) {
    const file = await this.get(fileId, { expand: { albums: "all" } });
    return file.albums ?? [];
  }
  /**
   * Get employees associated with a file
   * @param fileId File ID
   */
  async getEmployees(fileId) {
    const file = await this.get(fileId, { expand: { employees: "all" } });
    return file.employees ?? [];
  }
  /**
   * Associate employees with a file
   * @param fileId File ID
   * @param employeeIds Employee IDs to associate
   */
  async addEmployees(fileId, employeeIds) {
    const employees = employeeIds.map((id) => ({ id }));
    await this.httpClient.post(`${this.endpoint}/${fileId}/Employees`, employees);
  }
  /**
   * Remove an employee association from a file
   * @param fileId File ID
   * @param employeeId Employee ID to remove
   */
  async removeEmployee(fileId, employeeId) {
    await this.httpClient.delete(`${this.endpoint}/${fileId}/Employees/${employeeId}`);
  }
  /**
   * Rotate a file
   * @param fileId File ID
   * @param degrees Rotation degrees (0, 90, 180, 270)
   */
  async rotate(fileId, degrees) {
    return this.update(fileId, { rotate_degrees: degrees });
  }
  /**
   * Update project display order for files
   * @param updates Array of file IDs with display orders
   */
  async updateProjectDisplayOrder(updates) {
    const response = await this.httpClient.put(this.endpoint, updates);
    return response.data;
  }
};

// src/resources/groups.ts
var GroupsResource = class extends BaseResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/Groups";
  }
  /**
   * Get all groups
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List groups with pagination
   */
  async list(options) {
    return super.list(options);
  }
  /**
   * Get a single group by ID
   */
  async get(id, options) {
    return super.get(id, options);
  }
  /**
   * Get users in a group
   * @param groupId Group ID
   */
  async getUsers(groupId) {
    const group = await this.get(groupId, { users: "all" });
    return group.users ?? [];
  }
  /**
   * Add users to a group
   * @param groupId Group ID
   * @param userIds User IDs to add
   */
  async addUsers(groupId, userIds) {
    const users = userIds.map((id) => ({ id }));
    await this.httpClient.post(`${this.endpoint}/${groupId}/Users`, users);
  }
  /**
   * Remove a user from a group
   * @param groupId Group ID
   * @param userId User ID to remove
   */
  async removeUser(groupId, userId) {
    await this.httpClient.delete(`${this.endpoint}/${groupId}/Users/${userId}`);
  }
};

// src/resources/keywords.ts
var KeywordsResource = class extends MergeableResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/Keywords";
  }
  /**
   * Get all keywords
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List keywords with pagination
   */
  async list(options) {
    return super.list(options);
  }
  /**
   * Get a single keyword by ID
   */
  async get(id, options) {
    return super.get(id, options);
  }
  /**
   * Get files tagged with a keyword
   * @param keywordId Keyword ID
   */
  async getFiles(keywordId) {
    const keyword = await this.get(keywordId, { files: "all" });
    return keyword.files ?? [];
  }
};

// src/resources/keyword-categories.ts
var KeywordCategoriesResource = class extends MergeableResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/KeywordCategories";
  }
  /**
   * Get all keyword categories
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List keyword categories with pagination
   */
  async list(options) {
    return super.list(options);
  }
};

// src/resources/photographers.ts
var PhotographersResource = class extends MergeableResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/Photographers";
  }
  /**
   * Get all photographers
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List photographers with pagination
   */
  async list(options) {
    return super.list(options);
  }
};

// src/resources/projects.ts
var ProjectsResource = class extends BaseResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/Projects";
  }
  /**
   * Get all projects
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List projects with pagination
   */
  async list(options) {
    return super.list(options);
  }
  /**
   * Get a single project by ID
   */
  async get(id, options) {
    return super.get(id, options);
  }
  /**
   * Get fields for a project
   * @param projectId Project ID
   */
  async getFields(projectId) {
    const project = await this.get(projectId, { fields: "all" });
    return project.fields ?? [];
  }
  /**
   * Update fields for a project
   * @param projectId Project ID
   * @param fields Field values to update
   */
  async updateFields(projectId, fields) {
    const response = await this.httpClient.put(`${this.endpoint}/${projectId}`, { fields });
    return response.data;
  }
  /**
   * Get project keywords for a project
   * @param projectId Project ID
   */
  async getProjectKeywords(projectId) {
    const project = await this.get(projectId, { projectKeywords: "all" });
    return project.projectKeywords ?? [];
  }
  /**
   * Add project keywords to a project
   * @param projectId Project ID
   * @param keywordIds Project keyword IDs to add
   */
  async addProjectKeywords(projectId, keywordIds) {
    const keywords = keywordIds.map((id) => ({ id }));
    await this.httpClient.post(`${this.endpoint}/${projectId}/ProjectKeywords`, keywords);
  }
  /**
   * Remove a project keyword from a project
   * @param projectId Project ID
   * @param keywordId Project keyword ID to remove
   */
  async removeProjectKeyword(projectId, keywordId) {
    await this.httpClient.delete(`${this.endpoint}/${projectId}/ProjectKeywords/${keywordId}`);
  }
  /**
   * Get albums associated with a project
   * @param projectId Project ID
   */
  async getAlbums(projectId) {
    const project = await this.get(projectId, { albums: "all" });
    return project.albums ?? [];
  }
  /**
   * Get employees associated with a project
   * @param projectId Project ID
   * @param options Query options
   */
  async getEmployees(projectId, options) {
    const response = await this.httpClient.get(
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
  async getEmployeeRoles(projectId, employeeId) {
    const response = await this.httpClient.get(
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
  async updateEmployeeRoles(projectId, employeeId, roles) {
    const response = await this.httpClient.post(
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
  async updateLocation(projectId, location) {
    return this.update(projectId, { location });
  }
  /**
   * Get files in a project
   * @param projectId Project ID
   * @param options Query options
   */
  async getFiles(projectId, options) {
    const response = await this.httpClient.get(
      `${this.endpoint}/${projectId}/Files`,
      this.toRequestOptions(options)
    );
    return response.data;
  }
};

// src/resources/project-keywords.ts
var ProjectKeywordsResource = class extends MergeableResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/ProjectKeywords";
  }
  /**
   * Get all project keywords
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List project keywords with pagination
   */
  async list(options) {
    return super.list(options);
  }
};

// src/resources/project-keyword-categories.ts
var ProjectKeywordCategoriesResource = class extends MergeableResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/ProjectKeywordCategories";
  }
  /**
   * Get all project keyword categories
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List project keyword categories with pagination
   */
  async list(options) {
    return super.list(options);
  }
};

// src/resources/searches.ts
var SearchesResource = class extends BaseResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/Searches";
  }
  /**
   * Get all searches
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List searches with pagination
   */
  async list(options) {
    return super.list(options);
  }
  /**
   * Get a single search by ID
   */
  async get(id, options) {
    return super.get(id, options);
  }
  /**
   * Get groups with access to a search
   * @param searchId Search ID
   */
  async getGroups(searchId) {
    const search = await this.get(searchId, { groups: "all" });
    return search.groups ?? [];
  }
  /**
   * Get users with access to a search
   * @param searchId Search ID
   */
  async getUsers(searchId) {
    const search = await this.get(searchId, { users: "all" });
    return search.users ?? [];
  }
  /**
   * Share search with groups
   * @param searchId Search ID
   * @param groups Array of group IDs with modify permissions
   */
  async shareWithGroups(searchId, groups) {
    await this.httpClient.post(`${this.endpoint}/${searchId}/Groups`, groups);
  }
  /**
   * Share search with users
   * @param searchId Search ID
   * @param users Array of user IDs with modify permissions
   */
  async shareWithUsers(searchId, users) {
    await this.httpClient.post(`${this.endpoint}/${searchId}/Users`, users);
  }
  /**
   * Execute a search and get results
   * @param searchId Search ID
   * @param options Query options
   */
  async execute(searchId, options) {
    return this.httpClient.getPaginated(
      `${this.endpoint}/${searchId}/Files`,
      this.toRequestOptions(options)
    );
  }
};

// src/resources/sizes.ts
var SizesResource = class extends BaseResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/Sizes";
  }
  /**
   * Get all sizes
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List sizes with pagination
   */
  async list(options) {
    return super.list(options);
  }
  /**
   * Get the original size
   */
  async getOriginal() {
    const sizes = await this.getAll({ original: 1 });
    return sizes[0];
  }
  /**
   * Get sizes that can be used for zip exports
   */
  async getZipSizes() {
    const sizes = await this.getAll();
    return sizes.filter((s) => s.use_for_zip === 1);
  }
};

// src/resources/text-rewrites.ts
var TextRewritesResource = class extends BaseResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/TextRewrites";
  }
  /**
   * Get all text rewrites
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  // Override write methods to throw errors (read-only resource)
  async create() {
    throw new Error("TextRewrites is a read-only resource");
  }
  async createMany() {
    throw new Error("TextRewrites is a read-only resource");
  }
  async update() {
    throw new Error("TextRewrites is a read-only resource");
  }
  async updateMany() {
    throw new Error("TextRewrites is a read-only resource");
  }
  async delete() {
    throw new Error("TextRewrites is a read-only resource");
  }
  async deleteMany() {
    throw new Error("TextRewrites is a read-only resource");
  }
};

// src/resources/topics.ts
var TopicsResource = class extends MergeableResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/Topics";
  }
  /**
   * Get all topics
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List topics with pagination
   */
  async list(options) {
    return super.list(options);
  }
  /**
   * Get a single topic by ID
   */
  async get(id, options) {
    return super.get(id, options);
  }
  /**
   * Get albums in a topic
   * @param topicId Topic ID
   */
  async getAlbums(topicId) {
    const topic = await this.get(topicId, { albums: "all" });
    return topic.albums ?? [];
  }
};

// src/resources/users.ts
var UsersResource = class extends BaseResource {
  constructor(httpClient) {
    super(httpClient);
    this.endpoint = "/Users";
  }
  /**
   * Get all users
   */
  async getAll(options, batchSize) {
    return super.getAll(options, batchSize);
  }
  /**
   * List users with pagination
   */
  async list(options) {
    return super.list(options);
  }
  /**
   * Get a single user by ID
   */
  async get(id, options) {
    return super.get(id, options);
  }
  /**
   * Get groups a user belongs to
   * @param userId User ID
   */
  async getGroups(userId) {
    const user = await this.get(userId, { groups: "all" });
    return user.groups ?? [];
  }
  /**
   * Get user by username
   * @param username Username to search for
   */
  async getByUsername(username) {
    const users = await this.getAll({ username, textMatching: "exact" });
    return users[0];
  }
  /**
   * Get user by email
   * @param email Email to search for
   */
  async getByEmail(email) {
    const users = await this.getAll({ email, textMatching: "exact" });
    return users[0];
  }
};

// src/client.ts
var OpenAssetClient = class {
  constructor(config) {
    let baseUrl;
    if (config.domain.startsWith("http://") || config.domain.startsWith("https://")) {
      baseUrl = config.domain;
    } else {
      baseUrl = `https://${config.domain}.openasset.com`;
    }
    const auth = {
      tokenId: config.tokenId,
      tokenString: config.tokenString
    };
    const httpClientConfig = {
      baseUrl,
      auth,
      timeout: config.timeout,
      headers: config.headers
    };
    this.httpClient = new HttpClient(httpClientConfig);
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
  getHttpClient() {
    return this.httpClient;
  }
};
function createClient(config) {
  return new OpenAssetClient(config);
}

export { AlbumsResource, AspectRatiosResource, AuthenticationError, BadRequestError, BaseResource, CategoriesResource, ConflictError, CopyrightHoldersResource, CopyrightPoliciesResource, DataIntegrationsResource, EmployeesResource, FieldsResource, FilesResource, ForbiddenError, GroupsResource, HttpClient, KeywordCategoriesResource, KeywordsResource, MergeableResource, MethodNotAllowedError, NotFoundError, OpenAssetClient, OpenAssetError, PhotographersResource, ProjectKeywordCategoriesResource, ProjectKeywordsResource, ProjectsResource, SearchesResource, ServerError, SizesResource, TextRewritesResource, TopicsResource, UnprocessableEntityError, UsersResource, createClient };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map