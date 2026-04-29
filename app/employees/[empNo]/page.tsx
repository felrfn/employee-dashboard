import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEmployeeDetail } from '../../../lib/queries';

export const dynamic = 'force-dynamic';

type Props = {
  params: { empNo: string };
};

export default async function EmployeeDetailPage({ params }: Props) {
  const empNo = Number(params.empNo);
  if (!Number.isInteger(empNo) || empNo <= 0) notFound();

  const detail = await getEmployeeDetail(empNo);
  if (!detail) notFound();

  const e = detail.employee;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {e.first_name} {e.last_name}
          </h1>
          <div className="mt-1 text-sm text-gray-700">
            Emp No: {e.emp_no} • Gender: {e.gender} • Hire Date: {e.hire_date}
          </div>
          <div className="mt-1 text-sm text-gray-700">
            Dept: {e.current_department?.dept_name ?? '-'} • Title: {e.current_title ?? '-'} • Salary:{' '}
            {e.current_salary === null
              ? '-'
              : e.current_salary.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
          </div>
        </div>
        <Link className="rounded border bg-white px-3 py-2 text-sm" href="/employees">
          Back
        </Link>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Salary History</h2>
        <div className="overflow-hidden rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-3 py-2">Salary</th>
                <th className="px-3 py-2">From</th>
                <th className="px-3 py-2">To</th>
              </tr>
            </thead>
            <tbody>
              {detail.salaryHistory.map((s, idx) => (
                <tr key={`${s.from_date}-${idx}`} className="border-t">
                  <td className="px-3 py-2">
                    {s.salary.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                  </td>
                  <td className="px-3 py-2">{s.from_date}</td>
                  <td className="px-3 py-2">{s.to_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Title History</h2>
        <div className="overflow-hidden rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">From</th>
                <th className="px-3 py-2">To</th>
              </tr>
            </thead>
            <tbody>
              {detail.titleHistory.map((t, idx) => (
                <tr key={`${t.from_date}-${idx}`} className="border-t">
                  <td className="px-3 py-2">{t.title}</td>
                  <td className="px-3 py-2">{t.from_date}</td>
                  <td className="px-3 py-2">{t.to_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}