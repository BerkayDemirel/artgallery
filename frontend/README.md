# Art Gallery Frontend

This is the frontend for the Art Gallery website, a curated experience to explore different art periods throughout history.

## Technologies Used

- **Next.js**: React framework with App Router
- **TypeScript**: For type safety
- **Tailwind CSS**: For styling
- **shadcn/ui**: Component library
- **Jest & React Testing Library**: For testing

## Features

- Responsive design for all devices
- Dynamic period pages with detailed information
- Interactive artwork gallery with modal view
- Keyboard navigation and accessibility features
- SEO optimization
- Analytics integration

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Running Tests

```bash
npm test
# or
yarn test
```

## Project Structure

- `src/app`: Next.js App Router pages
- `src/components`: Reusable UI components
- `src/components/period`: Period-specific components
- `src/components/ui`: shadcn/ui components
- `src/lib`: Utility functions and API client
- `src/styles`: Global styles
- `src/types`: TypeScript type definitions

## Accessibility

This project follows WCAG guidelines for accessibility:

- Proper semantic HTML
- ARIA attributes
- Keyboard navigation
- Skip to content link
- Color contrast compliance

## Performance Optimization

- Dynamic imports for code splitting
- Image optimization
- Suspense for loading states
- Responsive design for all devices

## Deployment

The site can be deployed to Vercel or any other hosting platform that supports Next.js.

## License

This project is licensed under the MIT License.
