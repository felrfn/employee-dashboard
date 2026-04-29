import { NextResponse } from 'next/server';
import { listEmployees } from '../../../lib/queries';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') ?? '';
  const page = Number(url.searchParams.get('page') ?? '1');
  const pageSize = Number(url.searchParams.get('pageSize') ?? '20');

  const result = await listEmployees({ q, page, pageSize });
  return NextResponse.json(result);
}
