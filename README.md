# Art Gallery Website

This project is an online art gallery website that showcases different art periods, their characteristics, and notable artworks.

## Project Structure

The project is divided into two main parts:

- **Frontend**: Next.js application with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Node.js API with Express, TypeScript, and local file-based data storage

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running the Development Servers

#### Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:3000

#### Backend

```bash
cd backend
npm run dev
```

The backend API will be available at http://localhost:3001

## Features

- Curated art period experiences
- Artwork galleries
- Newsletter subscription
- Responsive design

## Data Structure

The backend uses a file-based approach with markdown files:

- `backend/data/periods/` - Contains markdown files for each art period
- `backend/data/artworks/` - Contains markdown files for each artwork
- `backend/public/images/` - Contains images for periods and artworks

## Technologies Used

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Node.js
- Express
- TypeScript
- Markdown with frontmatter (gray-matter)

## License

This project is licensed under the MIT License. 