import express from 'express';
import { subscribe } from '../controllers/newsletterController';

const router = express.Router();

router.post('/', subscribe);

export default router; 