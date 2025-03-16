import express from 'express';
import { listArtworks, getArtwork } from '../controllers/artworkController';

const router = express.Router();

router.get('/', listArtworks);
router.get('/:slug', getArtwork);

export default router; 