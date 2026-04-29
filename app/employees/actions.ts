'use server';

import { redirect } from 'next/navigation';

export async function applyEmployeeSearch(formData: FormData) {
  const q = String(formData.get('q') ?? '').trim();
  const pageSize = String(formData.get('pageSize') ?? '20');
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (pageSize) params.set('pageSize', pageSize);
  params.set('page', '1');
  redirect(`/employees?${params.toString()}`);
}
