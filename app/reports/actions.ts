'use server';

import { redirect } from 'next/navigation';

export async function applyLastNameSearch(formData: FormData) {
  const lastNamePrefix = String(formData.get('lastNamePrefix') ?? '').trim();
  const pageSize = String(formData.get('pageSize') ?? '20');

  const params = new URLSearchParams();
  if (lastNamePrefix) params.set('lastNamePrefix', lastNamePrefix);
  params.set('ePage', '1');
  params.set('ePageSize', pageSize);
  redirect(`/reports?${params.toString()}`);
}
