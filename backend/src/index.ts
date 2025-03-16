import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import path from 'path';

// Import routes
import periodRoutes from './routes/periodRoutes';
import artworkRoutes from './routes/artworkRoutes';
import newsletterRoutes from './routes/newsletterRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use('/static', express.static(path.join(__dirname, '../public')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Art Gallery API' });
});

// API routes
app.use('/api/periods', periodRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 