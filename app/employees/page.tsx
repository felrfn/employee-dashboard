import Link from 'next/link';
import { listEmployees } from '../../lib/queries';
import { applyEmployeeSearch } from './actions';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams?: {
    q?: string;
    page?: string;
    pageSize?: string;
  };
};

export default async function EmployeesPage({ searchParams }: Props) {
  const q = searchParams?.q ?? '';
  const page = Number(searchParams?.page ?? '1');
  const pageSize = Number(searchParams?.pageSize ?? '20');

  const result = await listEmployees({ q, page, pageSize });
  const prevPage = Math.max(1, result.page - 1);
  const nextPage = Math.min(result.totalPages, result.page + 1);

  const mkHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    params.set('page', String(p));
    params.set('pageSize', String(result.pageSize));
    return `/employees?${params.toString()}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
          <p className="text-sm text-gray-700">Total: {result.total.toLocaleString('id-ID')}</p>
        </div>
        <form action={applyEmployeeSearch} className="flex items-center gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name..."
            className="w-56 rounded border border-gray-300 bg-white px-3 py-2 text-sm"
          />
          <select
            name="pageSize"
            defaultValue={String(result.pageSize)}
            className="rounded border border-gray-300 bg-white px-2 py-2 text-sm"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <button className="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white" type="submit">
            Search
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-3 py-2">Emp No</th>
              <th className="px-3 py-2">Nama</th>
              <th className="px-3 py-2">Departemen</th>
              <th className="px-3 py-2">Jabatan</th>
              <th className="px-3 py-2">Gaji Saat Ini</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((e) => (
              <tr key={e.emp_no} className="border-t">
                <td className="px-3 py-2">
                  <Link className="text-blue-700 hover:underline" href={`/employees/${e.emp_no}`}>
                    {e.emp_no}
                  </Link>
                </td>
                <td className="px-3 py-2">
                  {e.first_name} {e.last_name}
                </td>
                <td className="px-3 py-2">{e.dept_name ?? '-'}</td>
                <td className="px-3 py-2">{e.current_title ?? '-'}</td>
                <td className="px-3 py-2">
                  {e.current_salary === null
                    ? '-'
                    : e.current_salary.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          Page {result.page} dari {result.totalPages}
        </div>
        <div className="flex gap-2">
          <Link
            className={`rounded border px-3 py-2 ${result.page === 1 ? 'pointer-events-none opacity-50' : ''}`}
            href={mkHref(prevPage)}
          >
            Prev
          </Link>
          <Link
            className={`rounded border px-3 py-2 ${result.page === result.totalPages ? 'pointer-events-none opacity-50' : ''}`}
            href={mkHref(nextPage)}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
