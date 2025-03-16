'use client';

import Script from 'next/script';

export default function UmamiAnalytics() {
  // For development, we'll disable the analytics script
  // In production, replace these values with your actual Umami configuration
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    return null; // Don't load analytics in development
  }

  // These values would be used in production
  const UMAMI_WEBSITE_ID = 'your-umami-website-id';
  const UMAMI_SCRIPT_URL = 'https://analytics.yourdomain.com/umami.js';

  return (
    <Script
      id="umami-analytics"
      src={UMAMI_SCRIPT_URL}
      strategy="afterInteractive"
      data-website-id={UMAMI_WEBSITE_ID}
    />
  );
}
