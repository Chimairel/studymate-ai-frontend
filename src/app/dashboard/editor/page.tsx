"use client";

import React, { Suspense } from 'react';
import EditorPage from '../../../views/dashboard/EditorPage';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex-center min-h-screen">
        <div className="spinner"></div>
      </div>
    }>
      <EditorPage />
    </Suspense>
  );
}
