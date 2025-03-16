import express from 'express';
import { periodsService, getArtworksByPeriod } from '../lib/fileService';

const router = express.Router();

// GET /api/periods - Get all periods
router.get('/', async (req, res) => {
  try {
    const periods = await periodsService.getAll();
    res.json(periods);
  } catch (error) {
    console.error('Error fetching periods:', error);
    res.status(500).json({ error: 'Failed to fetch periods' });
  }
});

// GET /api/periods/:slug - Get a specific period
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const period = await periodsService.getBySlug(slug);
    
    if (!period) {
      return res.status(404).json({ error: 'Period not found' });
    }
    
    // Get artworks for this period
    const artworks = await getArtworksByPeriod(slug);
    
    res.json({
      ...period,
      artworks
    });
  } catch (error) {
    console.error('Error fetching period:', error);
    res.status(500).json({ error: 'Failed to fetch period' });
  }
});

export default router; 