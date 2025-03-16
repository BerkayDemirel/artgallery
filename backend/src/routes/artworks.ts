import express from 'express';
import { artworksService } from '../lib/fileService';

const router = express.Router();

// GET /api/artworks - Get all artworks with optional filtering
router.get('/', async (req, res) => {
  try {
    const { period } = req.query;
    const periodId = period as string | undefined;
    
    const artworks = await artworksService.getArtworks(periodId);
    res.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).json({ error: 'Failed to fetch artworks' });
  }
});

// GET /api/artworks/:id - Get a specific artwork
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const artwork = await artworksService.getArtworkById(id);
    
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }
    
    res.json(artwork);
  } catch (error) {
    console.error('Error fetching artwork:', error);
    res.status(500).json({ error: 'Failed to fetch artwork' });
  }
});

export default router; 