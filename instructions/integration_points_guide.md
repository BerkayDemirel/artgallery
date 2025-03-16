# Integration Points Guide

This document outlines the key integration points between the frontend and backend development tracks for the Online Art Gallery Website. Clear understanding of these integration points will allow both developers to work independently while ensuring seamless collaboration.

## 1. API Contract

The API contract defines how the frontend and backend will communicate.

### Key Specifications:

- **Endpoint Structure**: RESTful API with consistent naming conventions
- **Data Formats**: JSON for all request/response payloads
- **Status Codes**: Standard HTTP status codes for different scenarios
- **Error Handling**: Consistent error response format

### Integration Process:

1. **Early Definition**: Define API specifications before implementation
2. **Documentation**: Create and maintain OpenAPI/Swagger documentation
3. **Mock Endpoints**: Frontend can use mock data while backend is being developed
4. **Versioning**: Include API version in URLs (e.g., `/api/v1/periods`)

## 2. Data Schema

The data schema ensures consistent data structures between frontend and backend.

### Shared TypeScript Types:

```typescript
// Define in a shared types directory accessible to both frontend and backend

// Period types
interface Period {
  id: string;
  name: string;
  cardImageUrl: string;
  headerImageUrl: string;
  introduction: string;
  timelineData: TimelineItem[];
  definingFeatures: DefiningFeature[];
  revolutionaryArtists: Artist[];
  didYouKnow: string[];
  createdAt: string;
}

interface TimelineItem {
  year: number;
  event: string;
}

interface DefiningFeature {
  title: string;
  description: string;
  imageUrl: string;
}

interface Artist {
  name: string;
  bio: string;
  imageUrl: string;
  notableWorks: string[];
}

// Artwork types
interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  country: string;
  periodId: string;
  imageUrl: string;
  relevance: string;
  trivia: string[];
  createdAt: string;
}

// Newsletter type
interface NewsletterSubscription {
  email: string;
}
```

### Integration Process:

1. **Source of Truth**: Backend maintains the source of truth for data schemas
2. **Shared Types**: Both developers work from the same type definitions
3. **Type Validation**: Use tools like Zod or TypeScript for runtime validation

## 3. Image Storage/Retrieval

### Current Implementation
- Frontend now uses direct Unsplash image URLs for each art period
- Different images are used for each period (Renaissance, Baroque, Rococo, etc.)
- Images are displayed using Next.js Image component with proper optimization
- All image components have been updated to use period-specific conditional logic

### Original Plan
- ~~Images were to be stored in Supabase storage~~
- ~~Backend would provide image URLs through the API~~
- ~~Frontend would consume these URLs and display images~~

### Current Status
- ✅ COMPLETED: Frontend now uses direct Unsplash URLs instead of API-provided URLs
- ✅ COMPLETED: Period-specific images implemented for all components
- ✅ COMPLETED: Image loading issues resolved by using direct URLs

### Next Steps
- Consider implementing a proper image management system in the future
- Potentially migrate to a CDN for better performance
- Add image optimization server for better control over image delivery

## 4. Newsletter Form

The newsletter form requires frontend to backend submission.

### Submission Flow:

1. **Form Data**: Frontend collects and validates email
2. **API Endpoint**: POST request to `/api/newsletter`
3. **Validation**: Backend validates email format and uniqueness
4. **Response**: Backend returns success/error with appropriate message
5. **UI Feedback**: Frontend displays success/error state based on response

### Integration Process:

1. **Form Design**: Frontend designs form UI and validation
2. **Endpoint Implementation**: Backend implements validation and storage
3. **Error Handling**: Define error codes and messages for different scenarios
4. **Testing**: Test submission flow with various inputs

## 5. Deployment Pipeline

Coordinating deployment ensures the application works as a cohesive unit.

### Deployment Strategy:

1. **Environment Parity**: Development, staging, and production environments
2. **Continuous Integration**: Automated testing for both frontend and backend
3. **Deployment Order**: Backend deployed before or simultaneously with frontend
4. **Environment Variables**: Coordinated environment variables between services

### Integration Process:

1. **Shared Repository**: Both developers work in the same repository
2. **Branch Strategy**: Define branch management and merge processes
3. **Pull Request Reviews**: Cross-review PRs between frontend and backend
4. **Deployment Coordination**: Schedule deployments to minimize integration issues

## Communication Protocol

To ensure smooth integration, follow these communication guidelines:

1. **Daily Updates**: Brief status updates on current progress
2. **API Changes**: Immediate notification of any API contract changes
3. **Documentation**: Keep shared documentation updated
4. **Integration Testing**: Schedule regular integration test sessions
5. **Issue Tracking**: Use shared issue tracking for integration problems

By adhering to these integration points and communication protocols, both developers can work independently while maintaining a cohesive product vision.
