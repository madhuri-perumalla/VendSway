# Testing Guide

This document provides comprehensive information about the testing setup for the VendSway backend.

## Test Setup

### Dependencies

The following testing dependencies are included in `package.json`:

- `jest` - Testing framework
- `ts-jest` - TypeScript preprocessor for Jest
- `supertest` - HTTP assertion library for testing Express endpoints
- `@types/jest` - TypeScript type definitions for Jest
- `@types/supertest` - TypeScript type definitions for Supertest

### Configuration

Jest is configured in `jest.config.js`:

- **Preset**: `ts-jest` for TypeScript support
- **Test Environment**: Node.js
- **Test Patterns**: `**/__tests__/**/*.ts` and `**/?(*.)+(spec|test).ts`
- **Coverage**: Excludes config files and index.ts
- **Setup File**: `src/tests/setup.ts`

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Integration Tests Only

```bash
npm run test:integration
```

## Test Structure

Tests are organized in the `src/tests/` directory:

```
src/tests/
├── setup.ts                    # Test setup and teardown
├── auth.test.ts                # Authentication tests
├── regionalIntelligence.test.ts # Regional Intelligence API tests
├── demand.test.ts              # Demand API tests
├── gap.test.ts                 # Gap API tests
├── seller.test.ts              # Seller API tests
├── storefront.test.ts          # Storefront API tests
├── analytics.test.ts           # Analytics API tests
└── integration.test.ts         # Integration tests
```

## Test Coverage

### Authentication Tests (`auth.test.ts`)

**Unit Tests**:
- Role selection validation
- Session validation
- Session retrieval
- Logout functionality

**API Tests**:
- POST `/api/auth/select-role` - Role selection
- GET `/api/auth/current-role` - Get current role
- POST `/api/auth/logout` - Logout
- GET `/api/auth/validate` - Session validation

**Validation**:
- Invalid role rejection
- Missing parameters
- Invalid session handling
- Session expiration

### Regional Intelligence Tests (`regionalIntelligence.test.ts`)

**API Tests**:
- GET `/api/intelligence/regions` - List all regions
- GET `/api/intelligence/regions/:id` - Get region details
- GET `/api/intelligence/regions/:id/textiles` - Get regional textiles
- GET `/api/intelligence/regions/:id/festivals` - Get regional festivals
- GET `/api/intelligence/regions/:id/gi-products` - Get GI products
- GET `/api/intelligence/regions/:id/trends` - Get regional trends
- GET `/api/intelligence/search` - Search regions
- GET `/api/intelligence/regions/:id/summary` - Regional summary

**Validation**:
- Invalid region ID handling (404)
- Search query requirement
- Response structure validation

### Demand API Tests (`demand.test.ts`)

**API Tests**:
- POST `/api/demand/calculate` - Calculate demand score
- POST `/api/demand/signals` - Create demand signal
- POST `/api/demand/batch` - Batch demand calculation
- GET `/api/demand/analysis/:regionId` - Get demand analysis
- GET `/api/demand/high-demand/:regionId` - Get high demand signals

**Authorization**:
- Authentication requirement (401)
- Admin-only access (403)
- Role-based access control

**Validation**:
- Required parameters (regionId, category)
- Invalid data handling

### Gap API Tests (`gap.test.ts`)

**API Tests**:
- POST `/api/gaps/calculate` - Calculate gap
- POST `/api/gaps/detect` - Detect gaps
- POST `/api/gaps/batch` - Batch gap detection
- GET `/api/gaps/missing-categories/:regionId` - Get missing categories
- GET `/api/gaps/shortage-summary/:regionId` - Get shortage summary
- GET `/api/gaps/analysis/:regionId` - Get gap analysis

**Authorization**:
- Authentication requirement (401)
- Admin-only access (403)

**Validation**:
- Required parameters
- Invalid data handling

### Seller API Tests (`seller.test.ts`)

**API Tests**:
- POST `/api/sellers/match` - Find matching sellers
- GET `/api/sellers/region/:regionId` - Get sellers by region
- GET `/api/sellers/category/:category` - Get sellers by category
- GET `/api/sellers/search` - Search sellers
- GET `/api/sellers/top-rated` - Get top rated sellers
- GET `/api/sellers/statistics` - Get seller statistics (admin)
- POST `/api/sellers/batch-match` - Batch seller matching (admin)

**Authorization**:
- Public endpoints (no auth required)
- Admin-only endpoints (statistics, batch operations)
- Role-based access control

**Validation**:
- Search query requirement
- Response structure validation

### Storefront API Tests (`storefront.test.ts`)

**API Tests**:
- GET `/api/storefront/home/:regionId` - Region homepage
- GET `/api/storefront/collections/:regionId` - Festival collections
- GET `/api/storefront/products/:regionId` - Regional products
- GET `/api/storefront/sellers/:regionId` - Local sellers
- GET `/api/storefront/high-demand/:regionId` - High demand products
- GET `/api/storefront/recommendations/:regionId` - Personalized recommendations
- GET `/api/storefront/trending/:regionId` - Trending categories
- GET `/api/storefront/search/:regionId` - Search storefront

**Validation**:
- Category filtering
- Limit parameter handling
- Search query requirement
- Empty result handling
- Invalid region ID handling

**Edge Cases**:
- Invalid region IDs
- Empty search results
- Missing parameters

### Analytics API Tests (`analytics.test.ts`)

**API Tests**:
- GET `/api/analytics/demand` - Demand analytics
- GET `/api/analytics/gaps` - Gap analytics
- GET `/api/analytics/sellers` - Seller analytics
- GET `/api/analytics/dashboard` - Dashboard overview
- POST `/api/analytics/regional-comparison` - Regional comparison

**Authorization**:
- All endpoints require admin authentication (401)
- Non-admin users rejected (403)

**Filtering**:
- Region filtering
- Category filtering
- Priority filtering
- Status filtering
- Date range filtering

**Validation**:
- Required parameters (regionIds array)
- Array type validation
- Invalid date format handling
- Empty data handling

### Integration Tests (`integration.test.ts`)

**Workflow Tests**:
1. **Regional Intelligence to Demand to Gaps**:
   - Get regions → Get region details → Calculate demand → Detect gaps

2. **Seller Discovery to Onboarding**:
   - Find matching sellers → Get seller statistics

3. **Storefront Customer Journey**:
   - Get homepage → Get collections → Get products → Get sellers → Get recommendations

4. **Analytics Dashboard**:
   - Demand analytics → Gap analytics → Seller analytics → Dashboard overview

**Cross-Module Integration**:
- Search across modules (regional intelligence, storefront, sellers)
- Consistent authentication enforcement
- Consistent error handling

**Response Format Consistency**:
- Success response structure validation
- Error response structure validation

**Error Handling Integration**:
- Invalid UUID handling across endpoints
- Missing required parameters
- Consistent error responses

## Test Categories

### Unit Tests
- Test individual functions and methods
- Test business logic in isolation
- Test utility functions

### API Tests
- Test HTTP endpoints
- Test request/response handling
- Test authentication and authorization
- Test validation

### Integration Tests
- Test complete workflows
- Test cross-module interactions
- Test end-to-end scenarios
- Test data flow between modules

## Test Best Practices

### Writing Tests

1. **Arrange-Act-Assert Pattern**:
   ```typescript
   it('should return 200 for valid request', async () => {
     // Arrange
     const testData = { regionId: 'test', category: 'test' };
     
     // Act
     const response = await request(app)
       .post('/api/endpoint')
       .send(testData);
     
     // Assert
     expect(response.status).toBe(200);
   });
   ```

2. **Test Happy Path First**: Start with the expected successful behavior

3. **Test Edge Cases**: Test invalid inputs, missing parameters, etc.

4. **Test Authentication**: Verify protected endpoints require authentication

5. **Test Authorization**: Verify role-based access control

### Test Data

- Use realistic test data
- Avoid hardcoding IDs when possible
- Use descriptive test data names
- Clean up test data after tests

### Test Organization

- Group related tests in describe blocks
- Use descriptive test names
- Keep tests focused and independent
- Avoid test dependencies

## Known Issues

The lint errors shown in the IDE are expected and will be resolved after running `npm install` to install the test dependencies:

- `Cannot find module 'supertest'` - Will be resolved after `npm install`
- `Cannot find name 'describe', 'it', 'expect'` - Will be resolved after `npm install @types/jest`
- Type errors in test files - Will be resolved after installing dependencies

## Running Tests Before Deployment

Before deploying to production:

1. Run all tests: `npm test`
2. Run tests with coverage: `npm run test:coverage`
3. Ensure all tests pass
4. Review coverage report
5. Fix any failing tests

## Continuous Integration

To set up CI/CD:

1. Configure test scripts in CI pipeline
2. Run tests on every push/PR
3. Fail build if tests fail
4. Generate coverage reports
5. Enforce coverage thresholds

## Troubleshooting

### Tests Not Running

- Ensure dependencies are installed: `npm install`
- Check Jest configuration in `jest.config.js`
- Verify test file patterns match configuration

### Tests Timing Out

- Increase test timeout in `jest.config.js`
- Check for infinite loops in tests
- Verify database connections are closed

### Database Connection Issues

- Ensure test database is configured
- Check database connection in `setup.ts`
- Verify Prisma client is properly initialized

### Coverage Issues

- Ensure coverage configuration is correct
- Check that source files are included
- Verify test files are properly structured
