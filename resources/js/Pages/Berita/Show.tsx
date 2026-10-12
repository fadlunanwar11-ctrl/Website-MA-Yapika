import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

type Props = {
  berita: { judul: string; isi: string; gambar: string | null; terbit_pada: string };
};

export default function Show({ berita }: Props) {
  return (
    <PublicLayout>
      <Head title={berita.judul} />
      <article className="mx-auto max-w-3xl px-4 py-14">
        <Link href="/berita" className="text-sm text-link">&larr; Semua berita</Link>
        <h1 className="mt-4 text-3xl font-bold leading-tight">{berita.judul}</h1>
        <p className="mt-2 text-sm text-muted">{berita.terbit_pada}</p>
        {berita.gambar && (
          <img src={`/storage/${berita.gambar}`} alt={berita.judul} className="mt-6 w-full rounded-lg" />
        )}
        <div className="mt-6 whitespace-pre-line leading-relaxed text-ink">{berita.isi}</div>
      </article>
    </PublicLayout>
  );
}
