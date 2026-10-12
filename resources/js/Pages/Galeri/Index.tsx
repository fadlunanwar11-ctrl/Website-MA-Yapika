import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import PageHero from "@/Components/PageHero";

type Album = {
    judul: string;
    slug: string;
    tahun: string;
    tanggal: string;
    kategori: string | null;
    sampul: string | null;
    foto_count: number;
};

export default function Index({ album }: { album: Album[] }) {
    const perTahun = album.reduce<Record<string, Album[]>>((acc, a) => {
        (acc[a.tahun] ??= []).push(a);
        return acc;
    }, {});
    const tahun = Object.keys(perTahun).sort((a, b) => Number(b) - Number(a));

    return (
        <PublicLayout>
            <Head title="Galeri">
                <meta
                    name="description"
                    content="Dokumentasi kegiatan siswa dan madrasah MA Yapika."
                />
            </Head>

            <section className="bg-brand text-white">
                <PageHero
                    gambar="/images/gedungMA.png"
                    judul="GALERI MADRASAH"
                    sub="Galeri kegatan Madrasah Aliyah Yapika."
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

            <div className="mx-auto max-w-6xl px-4 py-14">
                {album.length === 0 && (
                    <p className="text-muted">Belum ada album.</p>
                )}

                {tahun.map((th) => (
                    <section
                        key={th}
                        className="mb-12"
                        aria-labelledby={`tahun-${th}`}
                    >
                        <h2
                            id={`tahun-${th}`}
                            className="mb-5 border-b border-line pb-2 text-2xl font-bold"
                        >
                            {th}
                        </h2>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {perTahun[th].map((a) => (
                                <Link
                                    key={a.slug}
                                    href={`/galeri/${a.slug}`}
                                    className="kartu flex h-full flex-col overflow-hidden"
                                >
                                    {a.sampul ? (
                                        <img
                                            src={`/storage/${a.sampul}`}
                                            alt=""
                                            loading="lazy"
                                            className="h-44 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-44 bg-alt" />
                                    )}
                                    <div className="flex flex-1 flex-col gap-1 p-4">
                                        {a.kategori && (
                                            <span className="w-fit rounded-full bg-alt px-2 py-0.5 text-xs font-bold text-link">
                                                {a.kategori}
                                            </span>
                                        )}
                                        <strong className="text-lg">
                                            {a.judul}
                                        </strong>
                                        <span className="text-sm ">
                                            {a.tanggal} &middot; {a.foto_count}{" "}
                                            foto
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </PublicLayout>
    );
}
