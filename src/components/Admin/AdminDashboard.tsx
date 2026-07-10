import React, { useState, Suspense } from 'react';
import OriginalAdminDashboard from '../AdminDashboard';

// In future steps, we will completely replace this with our own layout.
// For now, to ensure stability, we wrap the original and inject our lazy components.
export default function AdminDashboardWrapper(props: any) {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">جاري التحميل...</div>}>
      <OriginalAdminDashboard {...props} />
    </Suspense>
  );
}
