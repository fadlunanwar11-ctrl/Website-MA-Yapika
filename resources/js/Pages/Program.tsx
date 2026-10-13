import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import SplitText from "@/Components/SplitText";
import TextType from "@/Components/TextType";
import PageHero from "@/Components/PageHero";

type Item = {
    nama: string;
    kategori: string;
    deskripsi: string | null;
    poin: string | null;
    gambar: string | null;
};

const KELOMPOK = [
    {
        kunci: "unggulan",
        judul: "Kelas Unggulan",
        ket: "Program kelas dan keunggulan akademik madrasah.",
        besar: true,
    },
    {
        kunci: "ekstrakurikuler",
        judul: "Ekstrakurikuler",
        ket: "Kegiatan pengembangan minat dan bakat siswa di luar jam pelajaran.",
        besar: false,
    },
    {
        kunci: "organisasi",
        judul: "Organisasi",
        ket: "Wadah siswa belajar berorganisasi dan kepemimpinan.",
        besar: false,
    },
];

function Kartu({ p, besar }: { p: Item; besar: boolean }) {
    const poin = (p.poin ?? "")
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);
    const tinggi = besar ? "h-40" : "h-28";

    return (
        <div className="kartu flex h-full flex-col gap-3 p-5">
            {p.gambar ? (
                <img
                    src={`/storage/${p.gambar}`}
                    alt={p.nama}
                    loading="lazy"
                    className={`${tinggi} w-full rounded object-cover`}
                />
            ) : (
                <div className={`${tinggi} rounded bg-alt`} />
            )}
            <h3 className="text-xl font-bold">{p.nama}</h3>
            {p.deskripsi && <p className="text-sm ">{p.deskripsi}</p>}
            {poin.length > 0 && (
                <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
                    {poin.map((x, j) => (
                        <li key={j}>{x}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default function Program({ program }: { program: Item[] }) {
    return (
        <PublicLayout>
            <Head title="Program dan Jurusan" />
            
            <section className="bg-brand text-white">
                <PageHero
                    gambar="/images/gedungMA.webp"
                    judul="PROGRAM DAN JURUSAN"
                    sub="Kelas Unggulan, Ekstra Kurikuler, dan Organisasi Madrasah Aliyah Yapika."
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

            {program.length === 0 && (
                <section className="mx-auto max-w-6xl px-4 py-14">
                    <p className="text-muted">Belum diisi.</p>
                </section>
            )}

            {KELOMPOK.map((k, i) => {
                const isi = program.filter((p) => p.kategori === k.kunci);
                if (isi.length === 0) return null;

                return (
                    <section
                        key={k.kunci}
                        id={k.kunci}
                        className={`scroll-mt-20 ${i % 2 === 1 ? "bg-card" : ""}`}
                    >
                        <div className="mx-auto max-w-6xl px-4 py-14">
                            <h2 className="text-2xl font-bold md:text-3xl">
                                {k.judul}
                            </h2>
                            <p className="mb-6 mt-1 ">{k.ket}</p>
                            <div
                                className={`grid gap-5 sm:grid-cols-2 ${
                                    k.besar
                                        ? "lg:grid-cols-3"
                                        : "lg:grid-cols-4"
                                }`}
                            >
                                {isi.map((p, j) => (
                                    <Kartu key={j} p={p} besar={k.besar} />
                                ))}
                            </div>
                        </div>
                    </section>
                );
            })}

            <section className="bg-brand text-white">
                <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-12 text-center">
                    <p className="text-2xl font-bold">
                        Siap bergabung dengan MA Yapika?
                    </p>
                    <Link
                        href="/ppdb"
                        className="rounded-md bg-white px-6 py-3 font-bold text-brand"
                    >
                        Daftar PPDB
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
