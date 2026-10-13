import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import PageHero from "@/Components/PageHero";
type Item = {
    judul: string;
    slug: string;
    ringkasan: string | null;
    gambar: string | null;
    terbit_pada: string;
};
type PageLink = { url: string | null; label: string; active: boolean };
type Props = { berita: { data: Item[]; links: PageLink[] } };

export default function Index({ berita }: Props) {
    return (
        <PublicLayout>
            <Head title="Berita" />
            <section className="bg-brand text-white">
                <PageHero
                    gambar="/images/gedungMA.webp"
                    judul="BERITA MADRASAH"
                    sub="Berita Baru di Madrasah Aliyah Yapika."
                />
                {/* <div className="mx-auto max-w-6xl px-4 py-14">
                                <h1 className="text-3xl font-bold md:text-4xl">
                                    Galeri Kegiatan
                                </h1>
                                <p className="mt-2 text-sky-100">
                                    Dokumentasi kegiatan siswa dan madrasah.
                                </p>
                            </div> */}
            </section>
            <section className="mx-auto max-w-6xl px-4 py-14">
                <h1 className="mb-6 text-3xl font-bold">
                    Berita dan Pengumuman
                </h1>

                {berita.data.length === 0 && (
                    <p className="text-muted">Belum ada berita.</p>
                )}

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {berita.data.map((b) => (
                        <Link
                            key={b.slug}
                            href={`/berita/${b.slug}`}
                            className="flex flex-col gap-2 kartu p-4 hover:shadow"
                        >
                            {b.gambar ? (
                                <img
                                    src={`/storage/${b.gambar}`}
                                    alt={b.judul}
                                    className="h-36 w-full rounded object-cover"
                                />
                            ) : (
                                <div className="h-36 rounded bg-alt" />
                            )}
                            <span className="text-xs ">
                                {b.terbit_pada}
                            </span>
                            <strong>{b.judul}</strong>
                            {b.ringkasan && (
                                <p className="text-sm ">
                                    {b.ringkasan}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>

                {berita.links.length > 3 && (
                    <nav className="mt-8 flex flex-wrap gap-2">
                        {berita.links.map((l, i) =>
                            l.url ? (
                                <Link
                                    key={i}
                                    href={l.url}
                                    className={`rounded border px-3 py-2 text-sm ${l.active ? "bg-brand text-white" : "bg-card"}`}
                                    dangerouslySetInnerHTML={{
                                        __html: l.label,
                                    }}
                                />
                            ) : (
                                <span
                                    key={i}
                                    className="rounded border px-3 py-2 text-sm text-muted"
                                    dangerouslySetInnerHTML={{
                                        __html: l.label,
                                    }}
                                />
                            ),
                        )}
                    </nav>
                )}
            </section>
        </PublicLayout>
    );
}
