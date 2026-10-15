import { Head, Link } from "@inertiajs/react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import Reveal from "@/Components/Reveal";
import ProgramSection from "@/Components/ProgramSection";
import { KELOMPOK_PROGRAM } from "@/lib/kelompokProgram";

const DriftWall = lazy(() => import("@/Components/DriftWall"));

const MIN_MARQUEE = 3;

type BeritaItem = {
    judul: string;
    slug: string;
    ringkasan: string | null;
    gambar: string | null;
    terbit_pada: string;
};

type ProgramItem = {
    nama: string;
    kategori: string;
    deskripsi: string | null;
    gambar: string | null;
};

type GaleriItem = {
    gambar: string;
    keterangan: string | null;
};

function useLayar() {
    const [s, setS] = useState({ kolom: 5, lebar: 200, kurangiGerak: false });
    useEffect(() => {
        const hitung = () => {
            const w = window.innerWidth;
            setS({
                kolom: w < 640 ? 2 : w < 1024 ? 3 : 5,
                lebar: w < 640 ? 150 : 200,
                kurangiGerak: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                ).matches,
            });
        };
        hitung();
        window.addEventListener("resize", hitung);
        return () => window.removeEventListener("resize", hitung);
    }, []);
    return s;
}

function Judul({ children }: { children: string }) {
    return (
        <Reveal>
            <h2 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
                {children}
            </h2>
        </Reveal>
    );
}

export default function Home({
    berita,
    program,
    galeri,
}: {
    berita: BeritaItem[];
    program: ProgramItem[];
    galeri: GaleriItem[];
}) {
    const { kolom, lebar, kurangiGerak } = useLayar();

    const itemsGaleri = useMemo(
        () =>
            galeri.map((f) => ({
                image: `/storage/${f.gambar}`,
                title: f.keterangan ?? "Kegiatan madrasah",
                href: "/galeri",
            })),
        [galeri],
    );

    const pakaiDinding = itemsGaleri.length >= 6 && !kurangiGerak;

    const kelompokProgram = useMemo(
        () =>
            KELOMPOK_PROGRAM.map((k) => ({
                ...k,
                isi: program.filter((p) => p.kategori === k.kunci),
            })).filter((k) => k.isi.length > 0),
        [program],
    );

    return (
        <PublicLayout>
            <Head title="Website Resmi Madrasah Aliyah Yapika" />

            {/* HERO SECTION */}
            <section className="hero-bg">
                <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
                    <img
                        src="/images/LogoMA.webp"
                        alt="Logo MA Yapika"
                        className="melayang mx-auto max-h-72 w-auto object-contain md:max-h-96"
                        loading="eager"
                        decoding="async"
                    />
                    <div className="flex flex-col gap-5 text-center md:text-left">
                        <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                            MADRASAH ALIYAH YAPIKA
                        </h1>
                        <p className="text-lg font-semibold text-muted-foreground">
                            Tanjungsari, Petanahan, Kebumen, Jawa Tengah
                        </p>
                    </div>
                </div>
            </section>

            {/* SAMBUTAN KEPALA MADRASAH */}
            <section className="mt-28 md:mt-36">
                <Reveal>
                    <div className="kartu relative mx-4 my-16 rounded-xl border border-link bg-card px-5 pb-6 pt-8 shadow-lg sm:mx-8 sm:px-8 md:mx-12 md:px-8 lg:mx-24">
                        <div className="relative -mt-20 flex justify-center sm:-mt-24 md:-mt-28 md:justify-start">
                            <img
                                className="h-36 w-36 rounded-full border-4 border-link object-cover sm:h-44 sm:w-44 md:h-52 md:w-52"
                                src="/images/pakYai.webp"
                                alt="Kepala Madrasah"
                                loading="lazy"
                                decoding="async"
                            />
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute right-0 top-0 select-none text-7xl leading-none text-link/10 sm:text-8xl md:-right-2 md:text-[10rem]"
                            >
                                &rdquo;
                            </span>
                        </div>

                        <div className="mt-6 sm:mt-8">
                            <h2 className="my-4 text-center text-2xl font-semibold sm:text-3xl md:text-left">
                                Sambutan Kepala Madrasah
                            </h2>
                            <p className="text-justify text-base/relaxed tracking-tight text-ink">
                                Assalamu’alaikum Warahmatullahi Wabarakatuh.
                                Alhamdulillahi robbil 'alamin, wasshalatu
                                wasshalamu 'ala asyrofil anbiya'i wal mursalin,
                                wa 'ala alihi wa shohbihi ajma'in. Selamat
                                datang di website resmi MA YAPIKA. Puji syukur
                                kehadirat Allah SWT. Platform digital ini kami
                                hadirkan sebagai sarana silaturahmi,
                                transparansi, dan pelayanan informasi bagi
                                seluruh civitas akademika serta masyarakat. MA
                                YAPIKA berkomitmen mencetak generasi mutaqaddim
                                (maju) yang berlandaskan imtaq dan
                                iptek—menyeimbangkan kedalaman ilmu agama,
                                keluhuran akhlakul karimah, serta kesiapan
                                menghadapi tantangan zaman. Mari bersama
                                membimbing putra-putri kita menjadi generasi
                                rabbani yang berilmu, beramal, dan berakhlak
                                mulia. Wassalamu’alaikum Warahmatullahi
                                Wabarakatuh.
                            </p>
                        </div>

                        <div className="mt-5 text-center sm:text-right">
                            <span className="text-base font-semibold text-link sm:text-lg">
                                KH. Ali Muin Amnur, Lc., M.Pd.I.
                            </span>
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* SEKSI PROGRAM DAN JURUSAN (MEMANGGIL KOMPONEN MODULAR) */}
            <ProgramSection
                kelompokProgram={kelompokProgram}
                MIN_MARQUEE={MIN_MARQUEE}
            />

            {/* BERITA DAN PENGUMUMAN */}
            <section className="mx-auto max-w-6xl px-4 py-14">
                <div className="mb-6 flex items-center justify-between">
                    <Judul>Berita dan Pengumuman</Judul>
                    <Link href="/berita" className="text-link hover:underline">
                        Lihat semua
                    </Link>
                </div>

                {berita.length === 0 && (
                    <p className="text-muted-foreground">Belum ada berita.</p>
                )}

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {berita.map((b) => (
                        <Reveal key={b.slug} className="h-full">
                            <Link
                                href={`/berita/${b.slug}`}
                                className="kartu flex min-h-[22rem] flex-col gap-3 overflow-hidden p-4"
                            >
                                {b.gambar ? (
                                    <img
                                        src={`/storage/${b.gambar}`}
                                        alt={b.judul}
                                        className="h-40 w-full shrink-0 rounded object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                ) : (
                                    <div className="h-40 w-full shrink-0 rounded bg-alt" />
                                )}

                                <span className="shrink-0 text-xs text-muted-foreground">
                                    {b.terbit_pada}
                                </span>

                                <strong className="line-clamp-2 text-base font-semibold text-ink">
                                    {b.judul}
                                </strong>

                                {b.ringkasan && (
                                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                                        {b.ringkasan}
                                    </p>
                                )}
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* GALERI KEGIATAN */}
            <section className="bg-card pb-14 pt-10">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-10 md:pt-14">
                    <h2 className="text-2xl font-bold md:text-3xl">
                        Galeri Kegiatan
                    </h2>
                    <Link href="/galeri" className="py-2 text-link hover:underline">
                        Lihat semua
                    </Link>
                </div>

                {itemsGaleri.length === 0 && (
                    <p className="mx-auto max-w-6xl px-4 py-10 text-muted-foreground">
                        Belum ada foto.
                    </p>
                )}

                {pakaiDinding && (
                    <Suspense
                        fallback={<div className="relative mt-8 h-105 md:h-130" />}
                    >
                        <div className="relative mt-8 h-105 overflow-hidden md:h-130">
                            <DriftWall
                                items={itemsGaleri}
                                columns={kolom}
                                tileWidth={lebar}
                                tileHeight={Math.round(lebar * 0.66)}
                                gap={18}
                                tilt={16}
                                turn={-14}
                                perspective={1200}
                                depth={120}
                                speed={42}
                                direction="up"
                                variance={0.45}
                                parallax={0.6}
                                lift={64}
                                fade={0.6}
                                dim={0.55}
                                overlayColor="#0f172a"
                                radius={14}
                                roll={0}
                                pauseOnHover
                                grayscale={false}
                            />
                        </div>
                    </Suspense>
                )}

                {!pakaiDinding && itemsGaleri.length > 0 && (
                    <div className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-3 px-4 lg:grid-cols-4">
                        {itemsGaleri.slice(0, 8).map((f, i) => (
                            <Link
                                key={i}
                                href="/galeri"
                                className="overflow-hidden rounded-lg shadow-sm transition hover:opacity-90"
                            >
                                <img
                                    src={f.image}
                                    alt={f.title}
                                    className="h-40 w-full object-cover"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}