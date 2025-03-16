/**
 * A simple rate limiter to ensure we don't exceed API rate limits
 */
export class RateLimiter {
  private queue: Array<() => void> = [];
  private running = 0;
  private timer: NodeJS.Timeout | null = null;

  /**
   * Create a new rate limiter
   * @param maxConcurrent Maximum number of concurrent requests
   * @param interval Interval in milliseconds between request batches
   */
  constructor(
    private readonly maxConcurrent: number,
    private readonly interval: number
  ) {}

  /**
   * Acquire a slot for making a request
   * @returns A promise that resolves when a request can be made
   */
  public acquire(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.queue.push(resolve);
      this.process();
    });
  }

  /**
   * Process the queue of pending requests
   */
  private process(): void {
    if (this.timer !== null) {
      return;
    }

    this.timer = setInterval(() => {
      const available = this.maxConcurrent - this.running;

      if (available <= 0 || this.queue.length === 0) {
        return;
      }

      // Process up to 'available' requests
      const toProcess = Math.min(available, this.queue.length);

      for (let i = 0; i < toProcess; i++) {
        const resolve = this.queue.shift();
        if (resolve) {
          this.running++;
          resolve();

          // Decrease running count after a small delay
          setTimeout(() => {
            this.running--;
          }, this.interval);
        }
      }

      // Clear the timer if the queue is empty
      if (this.queue.length === 0 && this.running === 0) {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }
    }, this.interval);
  }
}
