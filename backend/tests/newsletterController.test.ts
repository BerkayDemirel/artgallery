import { Request, Response } from 'express';
import fs from 'fs/promises';
import { subscribe } from '../src/controllers/newsletterController';

jest.mock('fs/promises');

describe('Newsletter Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockJson = jest.fn();
  const mockStatus = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    mockRequest = {
      body: {},
    };
    mockResponse = {
      json: mockJson,
      status: mockStatus.mockReturnThis(),
    };
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify({ subscriptions: [] }));
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
  });

  it('should successfully subscribe a new email', async () => {
    mockRequest.body = { email: 'test@example.com' };

    await subscribe(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith({
      success: true,
      data: {
        message: 'Successfully subscribed to newsletter',
      },
    });
  });

  it('should reject invalid email format', async () => {
    mockRequest.body = { email: 'invalid-email' };

    await subscribe(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      error: 'Invalid email format',
    });
  });

  it('should reject duplicate email subscription', async () => {
    const existingEmail = 'test@example.com';
    (fs.readFile as jest.Mock).mockResolvedValue(
      JSON.stringify({
        subscriptions: [
          { email: existingEmail, createdAt: new Date().toISOString() },
        ],
      })
    );

    mockRequest.body = { email: existingEmail };

    await subscribe(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      error: 'Email is already subscribed',
    });
  });

  it('should handle missing email in request', async () => {
    mockRequest.body = {};

    await subscribe(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      error: 'Email is required',
    });
  });

  it('should handle file system errors', async () => {
    mockRequest.body = { email: 'test@example.com' };
    (fs.writeFile as jest.Mock).mockRejectedValue(new Error('File system error'));

    await subscribe(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      error: 'Failed to subscribe to newsletter',
    });
  });
}); 