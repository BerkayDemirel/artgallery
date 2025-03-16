import { Request, Response } from 'express';
import { getAllArtworks, getArtworkBySlug, getArtworksByPeriod } from '../lib/fileStorage';
import { ApiResponse, Artwork, PaginatedResponse } from '../types';

/**
 * Get all artworks with optional filtering and pagination
 */
export async function listArtworks(
  req: Request,
  res: Response<ApiResponse<PaginatedResponse<Artwork>>>
): Promise<void> {
  try {
    const { period, page = '1', pageSize = '10' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const pageSizeNum = parseInt(pageSize as string, 10);

    let artworks = period
      ? await getArtworksByPeriod(period as string)
      : await getAllArtworks();

    // Sort artworks by year
    artworks = artworks.sort((a, b) => a.year - b.year);

    // Calculate pagination
    const total = artworks.length;
    const totalPages = Math.ceil(total / pageSizeNum);
    const start = (pageNum - 1) * pageSizeNum;
    const end = start + pageSizeNum;
    const paginatedArtworks = artworks.slice(start, end);

    res.json({
      success: true,
      data: {
        data: paginatedArtworks,
        total,
        page: pageNum,
        pageSize: pageSizeNum,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch artworks',
    });
  }
}

/**
 * Get a specific artwork by slug
 */
export async function getArtwork(
  req: Request<{ slug: string }>,
  res: Response<ApiResponse<Artwork>>
): Promise<void> {
  try {
    const { slug } = req.params;
    const artwork = await getArtworkBySlug(slug);

    if (!artwork) {
      res.status(404).json({
        success: false,
        error: `Artwork '${slug}' not found`,
      });
      return;
    }

    res.json({
      success: true,
      data: artwork,
    });
  } catch (error) {
    console.error('Error fetching artwork:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch artwork',
    });
  }
} 