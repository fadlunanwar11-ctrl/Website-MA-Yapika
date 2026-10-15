import { Link } from "@inertiajs/react";
import Reveal from "@/Components/Reveal";
import MarqueeCards from "@/Components/MarqueeCards";

// Tipe data fleksibel untuk menerima props dari Home.tsx
type ProgramSectionProps = {
    kelompokProgram: Array<{
        kunci: string;
        judul: string;
        ket?: string;
        isi: Array<{
            nama: string;
            deskripsi?: string | null;
            gambar?: string | null;
        }>;
    }>;
    MIN_MARQUEE?: number;
};

function Judul({ children }: { children: string }) {
    return (
        <Reveal>
            <h2 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
                {children}
            </h2>
        </Reveal>
    );
}

export default function ProgramSection({
    kelompokProgram,
    MIN_MARQUEE = 3,
}: ProgramSectionProps) {
    return (
        <section
            className="relative overflow-hidden bg-card py-16 md:py-24
            before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-20 before:w-16 before:bg-gradient-to-r before:from-card before:to-transparent md:before:w-28
            after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-20 after:w-16 after:bg-gradient-to-l after:from-card after:to-transparent md:after:w-28"
        >
            {/* Ambient Background Glow untuk Efek Visual Modern */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-link/5 blur-3xl"
            />

            {/* Header Seksi */}
            <div className="mx-auto flex max-w-6xl items-end justify-between px-4 sm:px-6">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-link">
                        Pilihan Studi
                    </span>
                    <Judul>Program & Jurusan</Judul>
                </div>
                <Link
                    href="/program"
                    className="group flex items-center gap-1.5 text-sm font-semibold text-link transition-colors hover:text-brand-dark"
                >
                    Lihat semua
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                            clipRule="evenodd"
                        />
                    </svg>
                </Link>
            </div>

            {/* Jika Data Program Kosong */}
            {kelompokProgram.length === 0 && (
                <div className="mx-auto mt-10 max-w-6xl rounded-2xl border border-dashed border-line p-8 text-center text-muted">
                    <p className="text-sm">
                        Belum ada data program yang ditampilkan.
                    </p>
                </div>
            )}

            {/* Daftar Kelompok Program */}
            <div className="mt-10 space-y-14">
                {kelompokProgram.map((k, i) => (
                    <div key={k.kunci} className="relative">
                        {/* Judul Kelompok / Kategori */}
                        <div className="mx-auto mb-5 flex max-w-6xl items-baseline justify-between gap-4 px-4 sm:px-6">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight text-link sm:text-2xl">
                                    {k.judul}
                                </h3>
                                {k.ket && (
                                    <p className="mt-1 text-sm text-muted">
                                        {k.ket}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Tampilan Marquee jika isi >= MIN_MARQUEE, selain itu Grid Kartu */}
                        {k.isi.length >= MIN_MARQUEE ? (
                            <MarqueeCards
                                items={k.isi.map((item) => ({
                                    ...item,
                                    // Memastikan path gambar lengkap dengan prefix /storage/
                                    gambar: item.gambar
                                        ? `/storage/${item.gambar}`
                                        : null,
                                    image: item.gambar
                                        ? `/storage/${item.gambar}`
                                        : null,
                                    deskripsi: item.deskripsi ?? null,
                                }))}
                                reverse={i % 2 === 1}
                            />
                        ) : (
                            <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
                                {k.isi.map((p, j) => (
                                    <Link
                                        key={j}
                                        href={`/program#${k.kunci}`}
                                        className="kartu group relative flex h-full flex-col justify-between overflow-hidden p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <div>
                                            {/* Container Gambar dengan Efek Hover Zoom */}
                                            <div className="relative h-36 w-full overflow-hidden rounded-lg bg-alt">
                                                {p.gambar ? (
                                                    <img
                                                        src={`/storage/${p.gambar}`}
                                                        alt={p.nama}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-alt text-muted">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-8 w-8 opacity-40"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.832 18.477 19.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info Judul & Deskripsi */}
                                            <div className="mt-4 space-y-1.5">
                                                <strong className="block text-base font-bold text-ink transition-colors group-hover:text-link">
                                                    {p.nama}
                                                </strong>
                                                {p.deskripsi && (
                                                    <p className="line-clamp-2 text-xs/relaxed text-muted">
                                                        {p.deskripsi}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Footer Kartu dengan Indikator Akses */}
                                        <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3 text-xs font-semibold text-link">
                                            <span>Pelajari Selengkapnya</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
