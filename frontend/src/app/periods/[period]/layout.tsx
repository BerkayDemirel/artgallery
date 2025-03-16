import React from 'react';

export default function PeriodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {children}
    </div>
  );
}
