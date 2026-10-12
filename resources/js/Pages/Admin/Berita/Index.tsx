import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

type Item = { id: number; judul: string; status: string; terbit_pada: string | null };
type PageLink = { url: string | null; label: string; active: boolean };
type Props = { berita: { data: Item[]; links: PageLink[] } };

export default function Index({ berita }: Props) {
  const hapus = (id: number, judul: string) => {
    if (confirm(`Hapus berita "${judul}"?`)) {
      router.delete(`/admin/berita/${id}`);
    }
  };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Kelola Berita</h2>}>
      <Head title="Kelola Berita" />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link href="/admin/berita/create" className="inline-block rounded-md bg-brand px-4 py-2.5 text-sm font-bold text-white">
          + Tambah Berita
        </Link>

        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3">Judul</th>
                <th className="p-3">Status</th>
                <th className="p-3">Terbit</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {berita.data.map((b) => (
                <tr key={b.id} className="border-t border-slate-200">
                  <td className="p-3">{b.judul}</td>
                  <td className="p-3">{b.status === 'terbit' ? 'Terbit' : 'Draft'}</td>
                  <td className="p-3">{b.terbit_pada ?? '-'}</td>
                  <td className="flex gap-4 p-3">
                    <Link href={`/admin/berita/${b.id}/edit`} className="text-brand">Edit</Link>
                    <button onClick={() => hapus(b.id, b.judul)} className="text-red-700 cursor-pointer ">Hapus</button>
                  </td>
                </tr>
              ))}
              {berita.data.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-500">Belum ada berita.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {berita.links.length > 3 && (
          <nav className="mt-6 flex flex-wrap gap-2">
            {berita.links.map((l, i) =>
              l.url ? (
                <Link
                  key={i}
                  href={l.url}
                  className={`rounded border px-3 py-2 text-sm ${l.active ? 'bg-brand text-white' : 'bg-white'}`}
                  dangerouslySetInnerHTML={{ __html: l.label }}
                />
              ) : (
                <span key={i} className="rounded border px-3 py-2 text-sm text-slate-400" dangerouslySetInnerHTML={{ __html: l.label }} />
              ),
            )}
          </nav>
        )}
      </div>
    </AuthenticatedLayout>
  );
}