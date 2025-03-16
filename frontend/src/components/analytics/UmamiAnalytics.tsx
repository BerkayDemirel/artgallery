'use client';

import Script from 'next/script';

export default function UmamiAnalytics() {
  // For development, we'll disable the analytics script
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Get Umami configuration from environment variables
  const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const UMAMI_SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;

  // Don't render anything if we're in development or missing configuration
  if (isDevelopment || !UMAMI_WEBSITE_ID || !UMAMI_SCRIPT_URL) {
    return null;
  }

  return (
    <Script
      id="umami-analytics"
      src={UMAMI_SCRIPT_URL}
      strategy="afterInteractive"
      data-website-id={UMAMI_WEBSITE_ID}
    />
  );
}
