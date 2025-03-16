import express from 'express';
import { periodsService } from '../lib/fileService';

const router = express.Router();

// GET /api/periods - Get all periods
router.get('/', async (req, res) => {
  try {
    const periods = await periodsService.getAllPeriods();
    res.json(periods);
  } catch (error) {
    console.error('Error fetching periods:', error);
    res.status(500).json({ error: 'Failed to fetch periods' });
  }
});

// GET /api/periods/:id - Get a specific period
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const period = await periodsService.getPeriodById(id);
    
    if (!period) {
      return res.status(404).json({ error: 'Period not found' });
    }
    
    res.json(period);
  } catch (error) {
    console.error('Error fetching period:', error);
    res.status(500).json({ error: 'Failed to fetch period' });
  }
});

export default router; 