import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import path from 'path';

// Import routes
import periodsRoutes from './routes/periods';
import artworksRoutes from './routes/artworks';
import newsletterRoutes from './routes/newsletter';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

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
app.use('/api/periods', periodsRoutes);
app.use('/api/artworks', artworksRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 