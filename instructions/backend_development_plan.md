# Backend Development Plan for Online Art Gallery Website

## Overview

This plan details the step-by-step development process for the backend of the Online Art Gallery Website. This plan is designed for Developer 2, who is responsible for database, API endpoints, and content generation.

## Responsibilities

- Database design and implementation using Supabase
- API endpoint development with Node.js
- AI content generation pipeline
- Security, performance, and deployment

## Integration Points

1. **API Contract** - Providing endpoints for frontend consumption
2. **Data Schema** - Maintaining shared data structures
3. **Image Storage/Retrieval** - Managing artwork images in Supabase
4. **Newsletter Form** - Processing form submissions from frontend


## Progress Tracking

### Completed Tasks
- ✅ Artsy API Integration
  - Implemented authentication with Artsy API
  - Created client for making API requests
  - Developed service for processing and saving artwork data
  - Added rate limiting to respect API constraints
  - Implemented image downloading and storage
  - Created script for fetching predefined list of artworks
  - Added unit tests for all components
  - Added fallback mechanisms for missing data

### In Progress
- 🔄 Database Setup
- 🔄 Schema Implementation

### Next Steps
- Server Initialization
- Core API Development

## Development Phases

## Phase 1: Infrastructure Setup

### Step 1: Database Setup
- Create Supabase project
- Set up environment variables
- Configure authentication settings

### Step 2: Schema Implementation
- Create database tables for periods, artworks, and newsletter
- Add appropriate constraints and relationships
- Set up storage buckets for artwork images

### Step 3: Server Initialization
- Set up Node.js server with Express
- Configure middleware and error handling
- Create basic API structure

## Phase 2: Core API Development

### Step 4: Periods API
- Implement GET /api/periods endpoint
- Create GET /api/periods/:id endpoint
- Add filtering and sorting capabilities
- Write tests for period endpoints

### Step 5: Artworks API
- Implement GET /api/artworks endpoint
- Create GET /api/artworks/:id endpoint
- Add filtering by period functionality
- Write tests for artwork endpoints

### Step 6: Newsletter API
- Implement POST /api/newsletter endpoint
- Add email validation
- Set up Supabase database storage for emails
- Write tests for newsletter submission

## Phase 3: Data Management

### Step 8: File-Based Data Storage
- Implement file-based storage system
- Create data directory structure
- Set up file read/write utilities

### Step 9: Data Schema Implementation
- Create data structures for periods, artworks, etc.
- Implement relationships between entities
- Create TypeScript type definitions

### Step 10: Image Handling
- ~~Set up image storage in Supabase~~
- ~~Create image upload/retrieval utilities~~
- ~~Implement image URL generation~~

**Note:** The frontend now uses direct Unsplash image URLs instead of API-provided URLs. This change was made to simplify the implementation and avoid image loading issues. The backend no longer needs to handle image storage and retrieval.

## Phase 4: Security & Performance

### Step 11: API Security
- Implement input validation
- Set up CORS policies
- Add rate limiting

### Step 12: Performance Optimization
- Optimize database queries
- Implement caching strategies
- Add compression and performance middleware

## Phase 5: Deployment & Monitoring

### Step 13: Deployment Configuration
- Set up Vercel deployment
- Configure environment variables
- Create CI/CD pipeline

### Step 14: Monitoring Integration
- Set up error tracking
- Implement performance monitoring
- Create health check endpoints

### Step 15: Final Testing
- Conduct end-to-end testing
- Perform load testing
- Security audit

## Prompts for Code Generation LLM

Below are the prompts for the code-generation LLM to implement each step in a test-driven manner.

### Backend Prompt 1: Database Setup

```markdown
# Supabase Project Setup

Set up a Supabase project for our art gallery website:

1. Create a new Supabase project
2. Set up environment variables for development
3. Configure authentication settings (even though we won't use auth in MVP)
4. Set up proper security policies
5. Create a connection helper module for the application

Provide code for:
- Environment configuration (.env.example)
- Supabase client setup
- Database connection testing

Ensure the setup follows security best practices and is ready for development use.
```

### Backend Prompt 2: Schema Implementation

```markdown
# Database Schema Implementation

Implement the database schema for our art gallery website in Supabase:

1. Create the following tables with appropriate columns and constraints:
   - Periods table (id, name, card_image_url, header_image_url, introduction, timeline_data, defining_features, revolutionary_artists, did_you_know, created_at)
   - Artworks table (id, title, artist, year, country, period, image_url, relevance, trivia, created_at)
   - Newsletter table (id, email, created_at)

2. Set up foreign key relationships between tables

3. Create storage buckets for artwork images with appropriate access controls

4. Implement database migrations for version control

Provide code for:
- SQL migrations or Prisma schema
- TypeScript type definitions for database entities
- Storage bucket configuration

Ensure the schema follows best practices for data modeling and security.
```

### Backend Prompt 3: Server Initialization

```markdown
# Node.js API Server Setup

Set up a Node.js server with Express for our art gallery API:

1. Initialize a Node.js project with TypeScript
2. Set up Express with necessary middleware:
   - Body parser
   - CORS
   - Compression
   - Request logging
3. Create a basic API structure with route organization
4. Implement error handling middleware
5. Set up testing infrastructure with Jest

Provide code for:
- Server initialization
- Middleware configuration
- Basic route structure
- Error handling
- Sample test setup

Ensure the server is configured for security, performance, and maintainability.
```

### Backend Prompt 4: Periods API

```markdown
# Periods API Implementation

Implement the API endpoints for art periods:

1. Create the following endpoints:
   - GET /api/periods - List all periods with basic information
   - GET /api/periods/:id - Get detailed information for a specific period

2. Include the following features:
   - Filtering and sorting options
   - Data validation
   - Error handling for not found resources
   - Proper HTTP status codes

3. Implement unit tests for each endpoint:
   - Test successful responses
   - Test error scenarios
   - Test filtering and sorting

Provide code for:
- Route handlers
- Controller functions
- Data access layer
- Unit tests

Ensure the API follows REST best practices and is properly documented.
```

### Backend Prompt 5: Artworks API

```markdown
# Artworks API Implementation

Implement the API endpoints for artworks:

1. Create the following endpoints:
   - GET /api/artworks - List all artworks with optional filtering by period
   - GET /api/artworks/:id - Get detailed information for a specific artwork

2. Include the following features:
   - Filtering by period, artist, or year
   - Sorting options
   - Pagination for large result sets
   - Data validation
   - Error handling

3. Implement unit tests for each endpoint:
   - Test successful responses
   - Test error scenarios
   - Test filtering, sorting, and pagination

Provide code for:
- Route handlers
- Controller functions
- Data access layer
- Unit tests

Ensure the API follows REST best practices and is properly documented.
```

### Backend Prompt 6: Newsletter API

```markdown
# Newsletter Signup API

Implement the newsletter signup functionality:

1. Create a POST /api/newsletter endpoint that:
   - Accepts email address submissions
   - Validates email format
   - Checks for duplicate emails
   - Stores valid submissions in the database

2. Implement proper error handling:
   - Invalid email format
   - Email already exists
   - Server errors

3. Add rate limiting to prevent abuse

4. Write unit tests for:
   - Successful submission
   - Validation errors
   - Duplicate handling

Provide code for:
- Route handler
- Email validation
- Database interaction
- Error handling
- Unit tests

Ensure the implementation follows security best practices and provides appropriate user feedback.
```

### Backend Prompt 7: AI Integration

```markdown
# OpenAI/Gemini API Integration

Set up AI integration for content generation:

1. Create helper modules for:
   - OpenAI API client configuration
   - Gemini API client configuration
   - Prompt management
   - Response handling and parsing

2. Implement error handling and retry logic:
   - Handle rate limiting
   - Implement exponential backoff
   - Validate responses

3. Create utility functions for common AI operations:
   - Text generation
   - Structured data generation
   - Content refinement

4. Write tests for:
   - API client functionality
   - Response parsing
   - Error handling

Provide code that abstracts the complexity of working with AI APIs and handles errors gracefully.

Ensure the implementation is reusable across different parts of the application.
```

### Backend Prompt 8: Artwork Collection Pipeline

```markdown
# AI Artwork Collection Pipeline

Implement the first step of the content generation pipeline:

1. Create a module that generates artwork collections for a given art period:
   - Design prompts for OpenAI/Gemini to generate artwork information
   - Structure the prompt to request specific fields (title, artist, year, country, relevance, trivia)
   - Process and validate AI responses into structured JSON

2. Implement storage of generated data:
   - Save responses to the database
   - Handle updates to existing data

3. Write tests for:
   - Prompt generation
   - Response parsing
   - Data validation
   - Storage functionality

Provide code that can be run as a standalone script or called from the API.

Ensure the implementation produces high-quality, consistent data and handles edge cases appropriately.
```

### Backend Prompt 9: Exposition Generation Pipeline

```markdown
# AI Exposition Generation Pipeline

Implement the second step of the content generation pipeline:

1. Create a module that generates exposition content for art periods:
   - Design prompts that take the artwork collection as input
   - Structure the prompt to generate all required sections (introduction, timeline, defining features, etc.)
   - Process and validate AI responses into structured JSON

2. Implement storage of generated exposition:
   - Save to the periods table
   - Handle updates to existing content

3. Write tests for:
   - Prompt generation
   - Response parsing
   - Data validation
   - Storage functionality

Provide code that handles the complexity of generating rich, informative content.

Ensure the implementation produces high-quality, educational content that aligns with the project's goals.
```

### Backend Prompt 10: Initial Content Seeding

```markdown
# Content Seeding Script

Create scripts to populate the database with initial content:

1. Implement a seeding script that:
   - Generates content for all three art periods (Renaissance, Baroque, Rococo)
   - Creates sample artwork entries
   - Prepares placeholder image URLs

2. Add functionality to:
   - Clear existing data before seeding
   - Validate generated content
   - Log progress and results

3. Include sample images for testing:
   - Provide URLs to public domain art images
   - Include metadata for proper attribution

Provide a complete script that can be run to initialize the database with high-quality sample data.

Ensure the script is idempotent and can be run multiple times without creating duplicate data.
```

### Backend Prompt 11: API Security

```markdown
# API Security Implementation

Enhance the security of our API:

1. Implement input validation using:
   - Schema validation for request bodies
   - Parameter validation for URL parameters
   - Query parameter sanitization

2. Set up CORS policies:
   - Configure appropriate origins
   - Handle preflight requests
   - Set secure headers

3. Add rate limiting:
   - Implement per-IP rate limiting
   - Add endpoint-specific limits
   - Create response headers for limit information

4. Set up request logging:
   - Log request information for debugging
   - Exclude sensitive data from logs
   - Implement log rotation

Write tests to verify security measures are working correctly.

Ensure the implementation follows security best practices and protects against common attack vectors.
```

### Backend Prompt 12: Performance Optimization

```markdown
# API Performance Optimization

Optimize the performance of our API:

1. Implement database query optimization:
   - Use efficient indexing
   - Optimize JOIN operations
   - Implement query caching where appropriate

2. Add response caching:
   - Set up in-memory caching for frequent requests
   - Implement cache invalidation strategies
   - Add cache headers for client-side caching

3. Implement compression:
   - Configure response compression
   - Optimize for different content types
   - Add appropriate cache control headers

4. Add performance monitoring:
   - Track response times
   - Identify slow queries
   - Log performance metrics

Write tests to verify performance improvements.

Ensure optimizations maintain data consistency and don't compromise security.
```

### Backend Prompt 13: Deployment Configuration

```markdown
# Vercel Deployment Setup

Configure deployment for our application:

1. Set up Vercel project configuration:
   - Create vercel.json configuration file
   - Configure build and development settings
   - Set up environment variables

2. Implement environment-specific configurations:
   - Development environment
   - Staging environment
   - Production environment

3. Create a CI/CD pipeline:
   - Configure GitHub integration
   - Set up automated testing
   - Implement preview deployments

4. Add deployment scripts:
   - Database migration script
   - Post-deployment verification

Provide configuration files and scripts needed for a smooth deployment process.

Ensure the deployment configuration follows best practices for security and performance.
```

### Backend Prompt 14: Monitoring Integration

```markdown
# Error Tracking and Monitoring

Implement monitoring for our application:

1. Set up error tracking:
   - Configure error reporting
   - Implement structured error logging
   - Set up alerts for critical errors

2. Add performance monitoring:
   - Track API response times
   - Monitor database query performance
   - Measure third-party API latency

3. Create health check endpoints:
   - API health check
   - Database connection check
   - Storage access check

4. Implement status reporting:
   - Create status page
   - Set up uptime monitoring
   - Configure status notifications

Provide code that helps identify and diagnose issues in production.

Ensure the monitoring solution is comprehensive but doesn't impact application performance.
```

### Backend Prompt 15: Final Testing

```markdown
# End-to-End Testing and Security Audit

Implement final testing and security verification:

1. Create end-to-end tests:
   - Test all API endpoints
   - Verify data integrity
   - Test error scenarios

2. Implement load testing:
   - Simulate concurrent users
   - Test API performance under load
   - Identify bottlenecks

3. Conduct a security audit:
   - Review API security
   - Check for common vulnerabilities
   - Verify rate limiting effectiveness

4. Create documentation:
   - API documentation
   - Database schema documentation
   - Deployment guide

Provide comprehensive tests and documentation for the application.

Ensure all aspects of the application have been thoroughly tested and verified.
```

## Integration Testing Prompt

```markdown
# Frontend-Backend Integration Testing

Create tests to verify the integration between frontend and backend:

1. Implement integration tests for:
   - Home page data loading
   - Period page data loading
   - Newsletter form submission

2. Create a test environment that:
   - Uses a test database
   - Mocks external APIs
   - Simulates user interactions

3. Test the following scenarios:
   - Successful data loading and rendering
   - Error handling and display
   - Form submission and feedback

4. Verify authentication and authorization (if implemented)

Provide code that tests the complete user journey through the application.

Ensure tests are comprehensive and verify both functional and non-functional requirements.
```
