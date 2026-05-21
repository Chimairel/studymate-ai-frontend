"use client";

import React, { Suspense } from 'react';
import AuthPage from '../../views/AuthPage';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex-center min-h-screen">
        <div className="spinner"></div>
      </div>
    }>
      <AuthPage />
    </Suspense>
  );
}
