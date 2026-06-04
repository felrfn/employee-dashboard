import Link from 'next/link';
import { performance } from 'node:perf_hooks';
import { applyLastNameSearch } from './actions';
import { listManagerHistory, searchEmployeesByLastNamePrefix } from '../../lib/queries';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams?: {
    mPage?: string;
    mPageSize?: string;
    lastNamePrefix?: string;
    ePage?: string;
    ePageSize?: string;
  };
};

export default async function ReportsPage({ searchParams }: Props) {
  const mPage = Number(searchParams?.mPage ?? '1');
  const mPageSize = Number(searchParams?.mPageSize ?? '20');
  const lastNamePrefix = searchParams?.lastNamePrefix ?? '';
  const ePage = Number(searchParams?.ePage ?? '1');
  const ePageSize = Number(searchParams?.ePageSize ?? '20');

  const t0 = performance.now();
  const managers = await listManagerHistory({ page: mPage, pageSize: mPageSize });
  const managersMs = performance.now() - t0;

  let employeesMs = 0;
  const t1 = performance.now();
  const employees = await searchEmployeesByLastNamePrefix({
    lastNamePrefix,
    page: ePage,
    pageSize: ePageSize
  });
  employeesMs = performance.now() - t1;

  const mkManagersHref = (page: number) => {
    const params = new URLSearchParams();
    params.set('mPage', String(page));
    params.set('mPageSize', String(managers.pageSize));
    if (lastNamePrefix) params.set('lastNamePrefix', lastNamePrefix);
    params.set('ePage', String(employees.page));
    params.set('ePageSize', String(employees.pageSize));
    return `/reports?${params.toString()}`;
  };

  const mkEmployeesHref = (page: number) => {
    const params = new URLSearchParams();
    params.set('mPage', String(managers.page));
    params.set('mPageSize', String(managers.pageSize));
    if (lastNamePrefix) params.set('lastNamePrefix', lastNamePrefix);
    params.set('ePage', String(page));
    params.set('ePageSize', String(employees.pageSize));
    return `/reports?${params.toString()}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reports</h1>
          <p className="text-sm text-gray-700">
            Managers View &amp; Indexed Last Name Search (dengan waktu eksekusi query)
          </p>
        </div>
        <Link className="rounded border bg-white px-3 py-2 text-sm" href="/">
          Home
        </Link>
      </div>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">A) Manager History (VIEW)</h2>
            <p className="text-sm text-gray-700">
              Source: <span className="font-mono">v_department_managers</span> • Query time:{' '}
              {managersMs.toFixed(2)} ms
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-3 py-2">Dept</th>
                <th className="px-3 py-2">Dept Name</th>
                <th className="px-3 py-2">Manager</th>
                <th className="px-3 py-2">Period</th>
              </tr>
            </thead>
            <tbody>
              {managers.items.map((m) => (
                <tr key={`${m.dept_no}-${m.emp_no}-${m.from_date}`} className="border-t">
                  <td className="px-3 py-2">{m.dept_no}</td>
                  <td className="px-3 py-2">{m.dept_name}</td>
                  <td className="px-3 py-2">
                    {m.emp_no} — {m.first_name} {m.last_name}
                  </td>
                  <td className="px-3 py-2">
                    {m.from_date} → {m.to_date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>
            Page {managers.page} / {managers.totalPages} • Total {managers.total.toLocaleString('id-ID')}
          </div>
          <div className="flex gap-2">
            <Link
              className={`rounded border px-3 py-2 ${managers.page === 1 ? 'pointer-events-none opacity-50' : ''}`}
              href={mkManagersHref(Math.max(1, managers.page - 1))}
            >
              Prev
            </Link>
            <Link
              className={`rounded border px-3 py-2 ${managers.page === managers.totalPages ? 'pointer-events-none opacity-50' : ''}`}
              href={mkManagersHref(Math.min(managers.totalPages, managers.page + 1))}
            >
              Next
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">B) Search by Last Name (INDEX)</h2>
            <p className="text-sm text-gray-700">
              Query time: {employeesMs.toFixed(2)} ms <span className="font-mono">Smi</span>)
            </p>
          </div>
          <form action={applyLastNameSearch} className="flex items-center gap-2">
            <input
              name="lastNamePrefix"
              defaultValue={lastNamePrefix}
              placeholder="Last name prefix..."
              className="w-56 rounded border border-gray-300 bg-white px-3 py-2 text-sm"
            />
            <select
              name="pageSize"
              defaultValue={String(employees.pageSize)}
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
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Hire Date</th>
              </tr>
            </thead>
            <tbody>
              {employees.items.length === 0 ? (
                <tr className="border-t">
                  <td className="px-3 py-2 text-gray-600" colSpan={3}>
                    {lastNamePrefix ? 'No results.' : 'Type a last name prefix to search.'}
                  </td>
                </tr>
              ) : (
                employees.items.map((e) => (
                  <tr key={e.emp_no} className="border-t">
                    <td className="px-3 py-2">{e.emp_no}</td>
                    <td className="px-3 py-2">
                      {e.first_name} {e.last_name}
                    </td>
                    <td className="px-3 py-2">{e.hire_date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>
            Page {employees.page} / {employees.totalPages} • Total {employees.total.toLocaleString('id-ID')}
          </div>
          <div className="flex gap-2">
            <Link
              className={`rounded border px-3 py-2 ${employees.page === 1 ? 'pointer-events-none opacity-50' : ''}`}
              href={mkEmployeesHref(Math.max(1, employees.page - 1))}
            >
              Prev
            </Link>
            <Link
              className={`rounded border px-3 py-2 ${employees.page === employees.totalPages ? 'pointer-events-none opacity-50' : ''}`}
              href={mkEmployeesHref(Math.min(employees.totalPages, employees.page + 1))}
            >
              Next
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
