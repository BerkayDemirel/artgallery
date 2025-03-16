import { Request, Response } from 'express';
import { getAllPeriods, getPeriodBySlug } from '../lib/fileStorage';
import { ApiResponse, Period } from '../types';

/**
 * Get all art periods
 */
export async function listPeriods(
  req: Request,
  res: Response<ApiResponse<Period[]>>
): Promise<void> {
  try {
    const periods = await getAllPeriods();
    res.json({
      success: true,
      data: periods.sort((a, b) => a.name.localeCompare(b.name)),
    });
  } catch (error) {
    console.error('Error fetching periods:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch art periods',
    });
  }
}

/**
 * Get a specific art period by slug
 */
export async function getPeriod(
  req: Request<{ slug: string }>,
  res: Response<ApiResponse<Period>>
): Promise<void> {
  try {
    const { slug } = req.params;
    const period = await getPeriodBySlug(slug);

    if (!period) {
      res.status(404).json({
        success: false,
        error: `Art period '${slug}' not found`,
      });
      return;
    }

    res.json({
      success: true,
      data: period,
    });
  } catch (error) {
    console.error('Error fetching period:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch art period',
    });
  }
} 