# Artsy API Integration for Art Gallery Project

## Overview

We have successfully integrated the Artsy API into our art gallery project. This integration allows us to fetch artwork metadata and images from Artsy and store them in our local filesystem for use in the application.

The integration uses the Artsy API to fetch artwork metadata and images. The data is stored in markdown files with JSON frontmatter in the `/data/artworks` directory, and images are saved in the `/public/static/images/artworks` directory.

## Setup

1. Create a `.env.local` file in the `backend` directory with the following variables:
   ```
   ARTSY_API_CLIENT_ID=your_client_id
   ARTSY_API_CLIENT_SECRET=your_client_secret
   ```

2. Install the required dependencies:
   ```
   npm install traverson traverson-hal axios fs-extra dotenv
   ```

## Usage

To fetch artwork data from Artsy, run the following command:

```
npm run fetch-artsy
```

This will fetch data for a predefined list of artworks and save them to the `/data/artworks` directory.

## Implementation Details

### Key Components

1. **ArtsyClient** (`src/lib/artsy/client.ts`)
   - Handles authentication with the Artsy API
   - Provides methods for searching artworks, getting artwork details, and retrieving artist information
   - Implements image URL retrieval logic

2. **ArtsyService** (`src/lib/artsy/service.ts`)
   - Processes API responses and enhances the data
   - Downloads and saves artwork images
   - Generates slugs for artworks
   - Enriches metadata with hardcoded data for well-known artworks
   - Saves artwork data as markdown files with JSON frontmatter

3. **RateLimiter** (`src/lib/artsy/rate-limiter.ts`)
   - Ensures we respect Artsy's rate limits (5 requests per second)
   - Queues requests and processes them at the appropriate rate

4. **Fetching Script** (`src/scripts/fetchArtsyArtworks.ts`)
   - Provides a command-line script for fetching a predefined list of artworks
   - Uses the rate limiter to avoid exceeding API limits
   - Handles errors gracefully

## Data Structure

Each artwork is saved as a markdown file with JSON frontmatter. The data includes:

- `slug`: A URL-friendly identifier for the artwork
- `title`: The title of the artwork
- `artist`: The name of the artist
- `year`: The year the artwork was created
- `country`: The country of origin
- `period`: The art period (e.g., renaissance, baroque, etc.)
- `imageUrl`: The URL to the artwork image
- `relevance`: Information about the artwork's significance
- `trivia`: Interesting facts about the artwork
- `medium`: The medium used (e.g., oil on canvas)
- `materials`: The materials used
- `dimensions`: The dimensions of the artwork
- `description`: A description of the artwork
- `artistBio`: A biography of the artist
- `source`: The source of the data (always "Artsy")
- `sourceUrl`: The URL to the artwork on Artsy
- `createdAt`: The timestamp when the data was fetched

### Images

Artwork images are downloaded and stored in the `/public/static/images/artworks` directory. If an image cannot be downloaded, a placeholder image is used instead.

## Testing

The integration includes unit tests for the following components:

- `ArtsyClient`: Tests for authentication and API requests
  - Path: `src/lib/artsy/__tests__/client.test.ts`
- `ArtsyService`: Tests for processing artwork data
  - Path: `src/lib/artsy/__tests__/service.test.ts`
- `RateLimiter`: Tests for rate limiting functionality
  - Path: `src/lib/artsy/__tests__/rate-limiter.test.ts`

To run the tests, use the following command:

```
npx jest src/lib/artsy/__tests__
```

## Troubleshooting

- If you encounter authentication errors, check that your API credentials are correctly set in the `.env.local` file.
- If you encounter rate limit errors, the script will automatically retry with exponential backoff.
- If an artwork cannot be found, the script will log a message and continue with the next artwork.
- If an image cannot be downloaded, a placeholder image will be used instead.

## What's Next

To continue developing the project, here are the next steps:

1. **Database Integration**
   - Set up Supabase for storing artwork data
   - Create tables for periods, artworks, and newsletter
   - Migrate the local filesystem storage to Supabase

2. **API Development**
   - Create API endpoints for retrieving artwork data
   - Implement filtering and sorting capabilities
   - Add pagination for large result sets

3. **Content Enhancement**
   - Expand the hardcoded metadata for more artworks
   - Add support for fetching related artworks
   - Implement more robust error handling and retry logic

4. **Performance Optimization**
   - Add caching to avoid redundant API calls
   - Optimize image downloading and processing
   - Implement more efficient data storage and retrieval

## Getting Started

To continue working on this project:

1. Make sure you have the necessary API credentials in `.env.local`
2. Run `npm install` to install dependencies
3. Run `npm run fetch-artsy` to fetch artwork data
4. Check the `/data/artworks` directory for the generated files
5. Run `npx jest src/lib/artsy/__tests__` to run the tests
