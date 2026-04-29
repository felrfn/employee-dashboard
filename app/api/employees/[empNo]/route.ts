import { NextResponse } from 'next/server';
import { getEmployeeDetail } from '../../../../lib/queries';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { empNo: string } }
) {
  const empNo = Number(params.empNo);
  if (!Number.isInteger(empNo) || empNo <= 0) {
    return NextResponse.json({ error: 'Invalid empNo' }, { status: 400 });
  }

  const detail = await getEmployeeDetail(empNo);
  if (!detail) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  return NextResponse.json(detail);
}
