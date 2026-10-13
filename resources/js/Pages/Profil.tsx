import { Head } from "@inertiajs/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import SplitText from "@/Components/SplitText";
import TextLipat from "@/Components/TextLipat";
import TextType from "@/Components/TextType";
import PageHero from "@/Components/PageHero";

type Guru = { nama: string; jabatan: string | null; foto: string | null };
type Props = {
    visi: string;
    misi: string;
    sejarah: string;
    kurikulum: string;
    kurikulum_pdf: string | null;
    guru: Guru[];
};

const kosong = <p className="text-muted ">Belum diisi.</p>;

const bagian =  [
    { id: "sejarah", label: "Sejarah" },
    { id: "visi-misi", label: "Visi dan Misi" },
    { id: "kurikulum", label: "Kurikulum" },
    { id: "tenaga-pendidik", label: "Tenaga Pendidik" },
];
const IDS = bagian.map((b) => b.id);

function useBagianAktif(ids: string[]) {
    const [aktif, setAktif] = useState(ids[0]);
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) setAktif(e.target.id);
                });
            },
            { rootMargin: "-30% 0px -60% 0px" },
        );
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) io.observe(el);
        });
        return () => io.disconnect();
    }, [ids]);
    return aktif;
}

function JudulHero({ children }: { children: string }) {
    const kurangiGerak =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (kurangiGerak) return <>{children}</>;
    return (
        <SplitText
            text={children}
            className="font-bold leading-tight"
            delay={50}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="left"
            onLetterAnimationComplete={() => {}}
        />
    );
}




function KurikulumDaftar({ teks }: { teks: string }) {
    const baris = teks
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean);

    const kelompok: { judul: string | null; poin: string[] }[] = [];
    baris.forEach((b) => {
        if (b.startsWith("#")) {
            kelompok.push({ judul: b.replace(/^#+\s*/, ""), poin: [] });
        } else {
            if (kelompok.length === 0) kelompok.push({ judul: null, poin: [] });
            kelompok[kelompok.length - 1].poin.push(b);
        }
    });

    return (
        <div className="grid gap-5 md:grid-cols-2">
            {kelompok.map((k, i) => (
                <div key={i} className="kartu p-6">
                    {k.judul && (
                        <h3 className="mb-3 text-lg font-bold text-link">
                            {k.judul}
                        </h3>
                    )}
                    <ul className="list-disc space-y-2 pl-5 text-ink">
                        {k.poin.map((p, j) => (
                            <li key={j}>{p}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default function Profil({
    visi,
    misi,
    sejarah,
    kurikulum,
    kurikulum_pdf,
    guru,
}: Props) {
    const aktif = useBagianAktif(IDS);
    const daftarMisi = misi
        .split("\n")
        .map((m) => m.trim())
        .filter(Boolean);

    return (
        <PublicLayout>
            <Head title="Profil Madrasah" />

            <section>
                <PageHero
                                    gambar="/images/gedungMA.webp"
                                    judul="PROFILE MADRASAH ALIYAH"
                                    sub="Mengenal tentang Madrasah Aliyah Yapika."
                                />

                
            </section>

            <nav
                aria-label="Bagian halaman"
                className="sticky top-16 z-30 border-b border-line bg-card/90 backdrop-blur"
            >
                <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2">
                    {bagian.map((b) => (
                        <a
                            key={b.id}
                            href={`#${b.id}`}
                            aria-current={aktif === b.id ? "true" : undefined}
                            className={`flex-none rounded-full px-4 py-2 text-sm ${
                                aktif === b.id
                                    ? "bg-link/15 font-bold text-link"
                                    : "hover:bg-alt"
                            }`}
                        >
                            {b.label}
                        </a>
                    ))}
                </div>
            </nav>

            <section id="sejarah" className="scroll-mt-32 bg-card">
                <div className="mx-auto max-w-3xl px-4 py-14">
                    <h2 className="mb-4 text-2xl font-bold md:text-3xl">
                        Sejarah Singkat
                    </h2>
                    <div className="text-justify indent-8">
                        <TextLipat className="whitespace-pre-line leading-relaxed text-ink">
                            {sejarah}
                        </TextLipat>
                    </div>
                </div>
            </section>

            <section id="visi-misi" className="scroll-mt-32 bg-alt">
                <div className="mx-auto max-w-6xl px-4 py-14">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="kartu p-6">
                            <h2 className="mb-3 text-xl font-bold text-link">
                                Visi
                            </h2>
                            {visi ? (
                                <p className="whitespace-pre-line text-ink">
                                    {visi}
                                </p>
                            ) : (
                                kosong
                            )}
                        </div>
                        <div className="kartu p-6">
                            <h2 className="mb-3 text-xl font-bold text-link">
                                Misi
                            </h2>
                            {daftarMisi.length ? (
                                
                                    <ol className="list-decimal space-y-2 pl-5 text-ink">
                                        {daftarMisi.map((m, i) => (
                                            <li key={i}>{m}</li>
                                        ))}
                                    </ol>
                                
                            ) : (
                                kosong
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section id="kurikulum" className="scroll-mt-32 bg-card">
                <div className="mx-auto max-w-6xl px-4 py-14">
                    <h2 className="mb-6 text-2xl font-bold md:text-3xl">
                        Kurikulum
                    </h2>
                    <TextLipat tinggi={320}>

                    {kurikulum ? <KurikulumDaftar teks={kurikulum} /> : kosong}
                    {kurikulum_pdf && (
                        <a
                            href={`/storage/${kurikulum_pdf}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-block rounded-md border-2 border-link px-5 py-2.5 font-bold text-link"
                        >
                            Unduh dokumen kurikulum (PDF)
                        </a>
                    )}
                    </TextLipat>
                </div>
            </section>

            <section id="tenaga-pendidik" className="scroll-mt-32 cursor-pointer">
                <div className="mx-auto max-w-6xl px-4 py-14">
                    <h2 className="mb-6 text-2xl font-bold md:text-3xl">
                        Guru dan Tenaga Pendidik
                    </h2>
                    {guru.length === 0 && kosong}
                    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
                        {guru.map((g, i) => (
                            <div
                                key={i}
                                className="kartu flex flex-col gap-2 p-4"
                            >
                                {g.foto ? (
                                    <img
                                        src={`/storage/${g.foto}`}
                                        alt={g.nama}
                                        loading="lazy"
                                        className="h-40 w-full rounded object-cover"
                                    />
                                ) : (
                                    <div className="h-40 rounded bg-alt" />
                                )}
                                <strong>{g.nama}</strong>
                                {g.jabatan && (
                                    <span className="text-sm ">
                                        {g.jabatan}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
