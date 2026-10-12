import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type Profil = {
  visi: string;
  misi: string;
  sejarah: string;
  kurikulum: string;
  kurikulum_pdf: string | null;
};

const input = 'mt-1 w-full rounded-md border border-slate-300 px-3 py-2';

export default function Edit({ profil }: { profil: Profil }) {
  const [kunci, setKunci] = useState(0);
  const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm<{
    _method: string;
    visi: string;
    misi: string;
    sejarah: string;
    kurikulum: string;
    kurikulum_pdf: File | null;
    hapus_pdf: boolean;
  }>({
    _method: 'put',
    visi: profil.visi,
    misi: profil.misi,
    sejarah: profil.sejarah,
    kurikulum: profil.kurikulum,
    kurikulum_pdf: null,
    hapus_pdf: false,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    post('/admin/profil', {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        reset('kurikulum_pdf', 'hapus_pdf');
        setKunci((k) => k + 1);
      },
    });
  };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Edit Profil Madrasah</h2>}>
      <Head title="Edit Profil Madrasah" />
      <form onSubmit={submit} className="mx-auto max-w-3xl space-y-5 px-4 py-8">
        <div>
          <label htmlFor="visi" className="font-medium">Visi</label>
          <textarea id="visi" rows={3} className={input} value={data.visi} onChange={(e) => setData('visi', e.target.value)} />
          {errors.visi && <p className="mt-1 text-sm text-red-700">{errors.visi}</p>}
        </div>

        <div>
          <label htmlFor="misi" className="font-medium">Misi</label>
          <p className="text-sm text-slate-500">Tulis satu poin per baris.</p>
          <textarea id="misi" rows={6} className={input} value={data.misi} onChange={(e) => setData('misi', e.target.value)} />
          {errors.misi && <p className="mt-1 text-sm text-red-700">{errors.misi}</p>}
        </div>

        <div>
          <label htmlFor="sejarah" className="font-medium">Sejarah</label>
          <p className="text-sm text-slate-500">Boleh panjang. Pisahkan paragraf dengan baris kosong.</p>
          <textarea id="sejarah" rows={10} className={input} value={data.sejarah} onChange={(e) => setData('sejarah', e.target.value)} />
          {errors.sejarah && <p className="mt-1 text-sm text-red-700">{errors.sejarah}</p>}
        </div>

        <div>
          <label htmlFor="kurikulum" className="font-medium">Kurikulum</label>
          <p className="text-sm text-slate-500">
            Satu poin per baris. Baris yang diawali tanda # menjadi judul kelompok, misalnya
            <code> # Program tambahan</code>.
          </p>
          <textarea id="kurikulum" rows={10} className={input} value={data.kurikulum} onChange={(e) => setData('kurikulum', e.target.value)} />
          {errors.kurikulum && <p className="mt-1 text-sm text-red-700">{errors.kurikulum}</p>}
        </div>

        <div>
          <label htmlFor="kurikulum_pdf" className="font-medium">Dokumen kurikulum (PDF, opsional, maks. 5 MB)</label>
          {profil.kurikulum_pdf && (
            <p className="mt-1 text-sm">
              File saat ini:{' '}
              <a href={`/storage/${profil.kurikulum_pdf}`} target="_blank" rel="noopener noreferrer" className="text-brand underline">
                lihat PDF
              </a>
            </p>
          )}
          <input
            key={kunci}
            id="kurikulum_pdf"
            type="file"
            accept="application/pdf"
            className="mt-2 block"
            onChange={(e) => setData('kurikulum_pdf', e.target.files?.[0] ?? null)}
          />
          {profil.kurikulum_pdf && (
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={data.hapus_pdf} onChange={(e) => setData('hapus_pdf', e.target.checked)} />
              Hapus PDF yang ada
            </label>
          )}
          {errors.kurikulum_pdf && <p className="mt-1 text-sm text-red-700">{errors.kurikulum_pdf}</p>}
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={processing} className="rounded-md bg-brand px-5 py-2.5 font-bold text-white disabled:opacity-50">
            {processing ? 'Menyimpan...' : 'Simpan'}
          </button>
          {recentlySuccessful && <span className="text-sm text-green-700">Tersimpan.</span>}
        </div>
      </form>
    </AuthenticatedLayout>
  );
}