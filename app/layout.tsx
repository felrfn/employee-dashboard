import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Employee Dashboard',
  description: 'Tugas Pemrograman Basis Data - Employee Dashboard'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-semibold">
              Pemrograman Basis Data
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/employees" className="hover:underline">
                Employees
              </Link>
              <Link href="/reports" className="hover:underline">
                Reports
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
