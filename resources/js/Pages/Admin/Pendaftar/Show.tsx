import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { STATUS } from '@/lib/statusPendaftar';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type P = {
  id: number;
  nomor: string | null;
  nama_lengkap: string;
  nisn: string;
  jenis_kelamin: string;
  tanggal_lahir: string;
  asal_sekolah: string;
  alamat: string;
  nama_wali: string;
  no_hp_wali: string;
  email: string | null;
  program: string | null;
  status: string;
  dibuat: string;
};

export default function Show({ pendaftar: p }: { pendaftar: P }) {
  const { data, setData, put, processing, recentlySuccessful } = useForm({ status: p.status });

  const simpan = (e: FormEvent) => {
    e.preventDefault();
    put(`/admin/pendaftar/${p.id}`, { preserveScroll: true });
  };

  const hapus = () => {
    if (confirm(`Hapus data pendaftar "${p.nama_lengkap}"? Tindakan ini tidak bisa dibatalkan.`)) {
      router.delete(`/admin/pendaftar/${p.id}`);
    }
  };

  const wa = p.no_hp_wali.replace(/^\+/, '').replace(/^0/, '62');

  const baris: [string, string][] = [
    ['Nomor pendaftaran', p.nomor ?? '-'],
    ['Tanggal daftar', p.dibuat],
    ['Nama lengkap', p.nama_lengkap],
    ['NISN', p.nisn],
    ['Jenis kelamin', p.jenis_kelamin],
    ['Tanggal lahir', p.tanggal_lahir],
    ['Asal sekolah', p.asal_sekolah],
    ['Alamat', p.alamat],
    ['Nama orang tua / wali', p.nama_wali],
    ['Nomor HP wali', p.no_hp_wali],
    ['Email', p.email ?? '-'],
    ['Pilihan program', p.program ?? '-'],
  ];

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Detail Pendaftar</h2>}>
      <Head title={p.nama_lengkap} />
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <Link href="/admin/pendaftar" className="text-sm text-brand">&larr; Semua pendaftar</Link>

        <dl className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {baris.map(([k, v]) => (
            <div key={k} className="grid gap-1 p-4 sm:grid-cols-3">
              <dt className="text-sm text-slate-500">{k}</dt>
              <dd className="whitespace-pre-line sm:col-span-2">{v}</dd>
            </div>
          ))}
        </dl>

        <a
          href={`https://wa.me/${wa}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md border-2 border-brand px-4 py-2 text-sm font-bold text-brand"
        >
          Hubungi wali via WhatsApp
        </a>

        <form onSubmit={simpan} className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-white p-4">
          <div>
            <label htmlFor="status" className="font-medium">Status</label>
            <select
              id="status"
              className="mt-1 block rounded-md border border-slate-300 px-3 py-2"
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
            >
              {Object.entries(STATUS).map(([key, s]) => (
                <option key={key} value={key}>{s.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={processing} className="rounded-md bg-brand px-5 py-2.5 font-bold text-white disabled:opacity-50">
            Simpan status
          </button>
          {recentlySuccessful && <span className="text-sm text-green-700">Tersimpan.</span>}
        </form>

        <button onClick={hapus} className="text-sm text-accent">Hapus data pendaftar</button>
      </div>
    </AuthenticatedLayout>
  );
}