# OpenAsset SDK

A modern, fully-typed TypeScript SDK for the [OpenAsset REST API](https://developers.openasset.com/).

## Features

- **Full TypeScript Support** - Complete type definitions for all API resources
- **Modern API** - Async/await based with Promise support
- **Tree-shakeable** - Only import what you need
- **Automatic Pagination** - Built-in support for fetching all results
- **Error Handling** - Typed error classes for different error scenarios
- **Comprehensive** - Support for all OpenAsset API endpoints

## Installation

### From GitHub

```bash
# npm
npm install git+https://github.com/BG-Innovation/realtime_api_demo.git#openassetjs

# pnpm
pnpm add git+https://github.com/BG-Innovation/realtime_api_demo.git#openassetjs

# bun
bun add git+https://github.com/BG-Innovation/realtime_api_demo.git#openassetjs

# yarn
yarn add git+https://github.com/BG-Innovation/realtime_api_demo.git#openassetjs
```

You can also install from a specific directory:

```bash
npm install github:BG-Innovation/realtime_api_demo#main:openassetjs
```

## Quick Start

```typescript
import { OpenAssetClient } from 'openassetjs';

// Create a client instance
const client = new OpenAssetClient({
  domain: 'your-company', // or full URL: 'https://your-company.openasset.com'
  tokenId: 'your-token-id',
  tokenString: 'your-token-string',
});

// Get all projects
const projects = await client.projects.getAll();

// Get a specific file with size information
const file = await client.files.get(123, { sizes: 'all' });

// Create a new album
const album = await client.albums.create({ name: 'My Album' });
```

## Authentication

OpenAsset uses token-based authentication. To create a token:

1. Navigate to your OpenAsset security settings: `{your-domain}.openasset.com/Page/AuthenticationTokens`
2. Create a new token
3. Note both the **Token ID** and **Token String**

```typescript
const client = new OpenAssetClient({
  domain: 'your-company',
  tokenId: 'your-token-id',      // Required
  tokenString: 'your-token-string', // Required
  timeout: 30000,                 // Optional: request timeout in ms
});
```

## API Reference

### Available Resources

| Resource | Description |
|----------|-------------|
| `albums` | Manage albums and their contents |
| `aspectRatios` | Get aspect ratio information (read-only) |
| `categories` | Manage file categories |
| `copyrightHolders` | Manage copyright holders |
| `copyrightPolicies` | Manage copyright policies |
| `dataIntegrations` | Manage data integrations |
| `employees` | Manage employees |
| `fields` | Manage custom fields |
| `files` | Manage files and images |
| `groups` | Manage user groups |
| `keywords` | Manage keywords |
| `keywordCategories` | Manage keyword categories |
| `photographers` | Manage photographers |
| `projects` | Manage projects |
| `projectKeywords` | Manage project keywords |
| `projectKeywordCategories` | Manage project keyword categories |
| `searches` | Manage saved searches |
| `sizes` | Manage image sizes |
| `textRewrites` | Get text rewrite rules (read-only) |
| `topics` | Manage topics |
| `users` | Manage users |

### Common Operations

#### Listing Resources

```typescript
// List with pagination (default limit: 10)
const { data, fullResultsCount } = await client.projects.list({
  limit: 50,
  offset: 0,
});

// Get ALL resources with automatic pagination
const allProjects = await client.projects.getAll();

// With filtering
const activeProjects = await client.projects.getAll({
  alive: 1,
  orderBy: 'name',
});
```

#### Getting a Single Resource

```typescript
// Get by ID
const project = await client.projects.get(123);

// With expanded data
const projectWithFields = await client.projects.get(123, {
  fields: 'all',
  projectKeywords: 'all',
});
```

#### Creating Resources

```typescript
// Create a single resource
const newProject = await client.projects.create({
  name: 'New Project',
  code: 'NP001',
});

// Create multiple resources
const newKeywords = await client.keywords.createMany([
  { name: 'Architecture', keyword_category_id: 1 },
  { name: 'Interior', keyword_category_id: 1 },
]);
```

#### Updating Resources

```typescript
// Update a single resource
const updated = await client.projects.update(123, {
  name: 'Updated Project Name',
});

// Update multiple resources
const results = await client.projects.updateMany([
  { id: 123, name: 'Project A' },
  { id: 124, name: 'Project B' },
]);
```

#### Deleting Resources

```typescript
// Delete a single resource
await client.albums.delete(123);

// Delete multiple resources
await client.albums.deleteMany([123, 124, 125]);
```

#### Merging Resources

Some resources support merging:

```typescript
// Merge keywords 101, 102 into keyword 100
await client.keywords.merge(100, [101, 102]);
```

### Working with Files

```typescript
// Get all files in a project
const files = await client.files.getAll({
  project_id: 123,
  category_id: 1,
});

// Get file with image URLs
const fileWithSizes = await client.files.getWithSizes(456, 'all');
const imageUrl = `https:${fileWithSizes.sizes[0].http_root}${fileWithSizes.sizes[0].http_relative_path}`;

// Or use the helper method
const url = await client.files.getImageUrl(456, 2); // sizeId: 2 = small

// Update file metadata
await client.files.update(456, {
  caption: 'New caption',
  rank: 8,
});

// Add keywords to a file
await client.files.addKeywords(456, [10, 11, 12]);

// Rotate an image
await client.files.rotate(456, 90);
```

### Working with Projects

```typescript
// Get project with all expansions
const project = await client.projects.get(123, {
  fields: 'all',
  projectKeywords: 'all',
  albums: 'all',
  withLocation: 1,
});

// Update project fields
await client.projects.updateFields(123, [
  { id: 1, values: ['New value'] },
]);

// Update project location
await client.projects.updateLocation(123, {
  latitude: 40.7128,
  longitude: -74.0060,
});

// Get employee roles on a project
const roles = await client.projects.getEmployeeRoles(123, 456);
```

### Working with Searches

```typescript
// Create a saved search
const search = await client.searches.create({
  name: 'Exterior Photos',
  search_items: [
    {
      code: 'keyword.1',
      exclude: 0,
      ids: ['8'], // Keyword ID for "Exterior"
    },
  ],
});

// Execute a search
const results = await client.searches.execute(search.id, {
  limit: 100,
});

// Share search with groups
await client.searches.shareWithGroups(search.id, [
  { id: 5, can_modify: 0 },
]);
```

### Filtering

The SDK supports all OpenAsset filtering options:

```typescript
// Basic filtering
const files = await client.files.getAll({
  category_id: 1,
  access_level: 2,
  textMatching: 'exact',
});

// Numeric operators
const highRankedFiles = await client.files.getAll({
  rank: '>7',
});

// Date filtering
const recentFiles = await client.files.getAll({
  uploaded: '>20240101000000',
});

// Advanced filtering with filterBy
const filtered = await client.files.list({
  filterBy: [
    { filename: '*exterior*' },
    { filename: '*interior*' },
  ],
});
```

### Pagination

```typescript
// Manual pagination
let offset = 0;
const limit = 100;
let allFiles: File[] = [];

while (true) {
  const { data, fullResultsCount } = await client.files.list({ limit, offset });
  allFiles.push(...data);
  
  if (offset + data.length >= fullResultsCount) break;
  offset += limit;
}

// Or use automatic pagination
const allFiles = await client.files.getAll({}, 100); // batchSize: 100
```

### Remote Fields

Get related data in a single request:

```typescript
const files = await client.files.list({
  remoteFields: ['photographer', 'copyright_holder', 'project_code'],
});
```

### Error Handling

```typescript
import { 
  OpenAssetError,
  AuthenticationError,
  NotFoundError,
  ForbiddenError,
} from 'openassetjs';

try {
  const project = await client.projects.get(999999);
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('Project not found');
  } else if (error instanceof AuthenticationError) {
    console.log('Invalid credentials');
  } else if (error instanceof ForbiddenError) {
    console.log('Access denied');
  } else if (error instanceof OpenAssetError) {
    console.log(`API Error: ${error.message} (${error.statusCode})`);
  }
}
```

## TypeScript Types

All types are exported and can be imported:

```typescript
import type {
  Project,
  File,
  Album,
  Keyword,
  Employee,
  // ... and many more
} from 'openassetjs';
```

## Best Practices

1. **Batch Operations**: When updating multiple resources, use batch methods:
   ```typescript
   // Good - single API call
   await client.projects.updateMany([...]);
   
   // Avoid - multiple API calls
   for (const project of projects) {
     await client.projects.update(project.id, {...});
   }
   ```

2. **Pagination**: For large datasets, use `getAll()` with a reasonable batch size:
   ```typescript
   // Files endpoint - use smaller batches
   const files = await client.files.getAll({}, 100);
   ```

3. **Request Only What You Need**: Use `displayFields` to limit response size:
   ```typescript
   const projects = await client.projects.list({
     displayFields: ['id', 'name', 'code'],
   });
   ```

4. **Handle Rate Limiting**: Add delays between large batch operations:
   ```typescript
   for (const batch of chunks(items, 100)) {
     await client.files.updateMany(batch);
     await new Promise(r => setTimeout(r, 1000));
   }
   ```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
