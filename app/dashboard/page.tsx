import { getDashboardStats } from '../../lib/queries';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded border bg-white p-4">
          <div className="text-sm text-gray-600">Total Employees</div>
          <div className="mt-1 text-2xl font-semibold">{stats.totalEmployees.toLocaleString('id-ID')}</div>
        </div>
        <div className="rounded border bg-white p-4">
          <div className="text-sm text-gray-600">Total Departments</div>
          <div className="mt-1 text-2xl font-semibold">{stats.totalDepartments.toLocaleString('id-ID')}</div>
        </div>
        <div className="rounded border bg-white p-4">
          <div className="text-sm text-gray-600">Current Average Salary</div>
          <div className="mt-1 text-2xl font-semibold">
            {stats.avgCurrentSalary === null
              ? '-'
              : stats.avgCurrentSalary.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
          </div>
        </div>
      </div>
    </div>
  );
}