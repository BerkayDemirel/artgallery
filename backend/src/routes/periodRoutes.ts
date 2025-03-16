import express from 'express';
import { listPeriods, getPeriod } from '../controllers/periodController';

const router = express.Router();

router.get('/', listPeriods);
router.get('/:slug', getPeriod);

export default router; 