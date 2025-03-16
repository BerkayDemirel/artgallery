'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset status
    setStatus('loading');
    setErrorMessage('');
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage('You need to enter a valid email');
      return;
    }
    
    // Instead of sending to backend, just show success message
    setStatus('success');
    setSubscribedEmail(email);
    setEmail('');
    
    // Uncomment this section when backend is properly configured
    /*
    try {
      const response = await fetch('http://localhost:3001/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }
      
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to subscribe');
    }
    */
  };

  return (
    <div className="relative">
      {subscribedEmail && (
        <div className="text-center mb-2">
          <p className="text-green-700 text-sm">Thank you for subscribing!</p>
        </div>
      )}
      
      <div className="bg-[#FFF8E7] p-4 rounded-lg shadow-sm">
        {status === 'success' && !subscribedEmail ? (
          <div className="text-center p-2">
            <p className="text-green-700 text-sm">Thank you for subscribing!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-center">
            <div className="flex-grow w-full">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="Join our newsletter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#E07A5F] focus:border-transparent text-gray-500 text-sm"
                disabled={status === 'loading'}
                required
              />
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-[#E07A5F] text-white rounded-md hover:bg-opacity-90 transition-all text-sm whitespace-nowrap"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
            
            {status === 'error' && (
              <div className="text-red-600 text-xs absolute mt-1">
                {errorMessage}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
