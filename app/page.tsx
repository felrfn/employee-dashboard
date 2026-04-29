import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
      <p className="text-sm text-gray-700">
        {/* Nama: Rafael Ardiansyah <br />
        NIM: 21120123120007 <br />
        Kelas: Pemrograman Basis Data */}
        Kelompok: 2 <br />
        Anggota: <br />
        - Rafael Ardiansyah (21120123120007) <br />
        - Puteri Citra Dewi	(21120124130056) <br />
      </p>
      <div className="flex gap-3">
        <Link
          className="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white"
          href="/dashboard"
        >
          Open Dashboard
        </Link>
        <Link
          className="rounded border border-gray-300 bg-white px-3 py-2 text-sm font-medium"
          href="/employees"
        >
          Employees
        </Link>
      </div>
    </div>
  );
}
