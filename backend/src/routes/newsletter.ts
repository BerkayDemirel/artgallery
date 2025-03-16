import express from 'express';
import { newsletterService } from '../lib/fileService';
import { z } from 'zod';

const router = express.Router();

// Email validation schema
const emailSchema = z.object({
  email: z.string().email('Invalid email format'),
});

// POST /api/newsletter - Subscribe to newsletter
router.post('/', async (req, res) => {
  try {
    // Validate email
    const { email } = emailSchema.parse(req.body);
    
    // Add subscription
    const result = await newsletterService.addSubscription(email);
    
    if (!result.success) {
      return res.status(409).json({ error: result.error });
    }
    
    res.status(201).json({ message: 'Subscription successful', data: result.data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ error: 'Failed to subscribe to newsletter' });
  }
});

export default router; 