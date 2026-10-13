import { Head, Link } from "@inertiajs/react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import Reveal from "@/Components/Reveal";
import { KELOMPOK_PROGRAM } from "@/lib/kelompokProgram";
import MarqueeCards from "@/Components/MarqueeCards";

const DriftWall = lazy(() => import("@/Components/DriftWall"));

const MIN_MARQUEE = 3; // kelompok dengan program lebih sedikit tampil sebagai kartu diam
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
            <h2 className="text-2xl font-bold md:text-3xl">{children}</h2>
        </Reveal>
    );
}

export default function Home({
    berita,
    program,
    galeri,
    unggulan,
}: {
    berita: BeritaItem[];
    program: ProgramItem[];
    unggulan: string[];
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
    const kelompokProgram = KELOMPOK_PROGRAM.map((k) => ({
        ...k,
        isi: program.filter((p) => p.kategori === k.kunci),
    })).filter((k) => k.isi.length > 0);
    return (
        <PublicLayout>
            <Head title="Website resmi Madrasah Aliyah Yapika" />

            <section className="hero-bg ">
                <div className="mx-auto grid max-w-6xl items-center-safe  gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
                    <img
                        src="/images/logoMA.webp"
                        alt="logo MA Yapika"
                        className="melayang md:max-h-96 "
                    />
                    <div className="flex flex-col gap-5  ">
                        <h1 className="text-center text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ">
                            MADRASAH ALIYAH YAPIKA
                        </h1>

                        <p className="text-lg font-bold text-center">
                            Tanjungsari, Petanahan, Kebumen, Jawa Tengah
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {/* <Link
                                href="/ppdb"
                                className="rounded-md border-link border-2 bg-accent px-6 py-3 font-bold"
                            >
                                Daftar PPDB
                            </Link> */}
                            {/* <Link
                                href="/profil"
                                className="rounded-md border-2 border-link px-6 py-3 font-bold text-link hover:bg-link hover:text-white hover:border-2 hover:border-white"
                            >
                                Profil Madrasah
                            </Link> */}
                        </div>
                    </div>
                </div>
            </section>

            {/* <section className="mx-auto -mt-6 max-w-6xl px-4">
                <div className="grid gap-3 sm:grid-cols-3">
                    {[
                        [
                            "Daftar PPDB",
                            "Isi formulir pendaftaran online",
                            "/ppdb",
                        ],
                        [
                            "Cek Status",
                            "Pantau proses pendaftaran",
                            "/ppdb/cek",
                        ],
                        [
                            "Hubungi Kami",
                            "Alamat, telepon, dan peta",
                            "/kontak",
                        ],
                    ].map(([judul, ket, href]) => (
                        <Link
                            key={href}
                            href={href}
                            className="kartu block p-4"
                        >
                            <strong className="text-link">{judul}</strong>
                            <p className="text-sm ">{ket}</p>
                        </Link>
                    ))}
                </div>
            </section> */}
            <section className="mt-36 ">
                <Reveal>
                    <div className="relative mx-4 my-16 rounded-xl border border-link bg-card px-5 pb-6 pt-8 shadow-lg sm:mx-8 sm:px-8 md:mx-12 md:px-8 lg:mx-24">
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

                            <p className="text-justify text-sm leading-7 sm:text-base">
                                Assalamu’alaikum Warahmatullahi Wabarakatuh
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
                                Wabarakatuh
                            </p>
                        </div>

                        <div className="mt-5 text-center sm:text-right">
                            <a
                                href="#"
                                className="text-base font-medium text-indigo-500 sm:text-lg"
                            >
                                KH. Ali Muin Amnur, Lc., M.Pd.I.
                            </a>
                        </div>
                    </div>
                </Reveal>
            </section>
            {/* <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
                <Judul>Sambutan Kepala Madrasah</Judul>

                <Reveal>
                    <figure className="relative mt-8 grid items-center  gap-8 overflow-hidden rounded-2xl border border-line bg-card p-6 md:grid-cols-[16rem_1fr] md:gap-12 md:p-10">
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute right-6 top-0 select-none text-[10rem] leading-none text-link/10"
                        >
                            &rdquo;
                        </span>

                        <img
                            src="/images/pakYai.jpeg"
                            alt="Kepala madrasah"
                            className="mx-auto aspect-square w-48 rounded-full border-4 border-link object-cover shadow-xl md:w-64"
                        />

                        <div className="relative space-y-4">
                            <blockquote className="text-lg leading-relaxed md:text-xl">
                                “Dengan semangat kejujuran, disiplin, dan
                                prestasi, kami berkomitmen menyiapkan generasi
                                yang berakhlak mulia, unggul dalam ilmu, dan
                                siap menghadapi tantangan masa depan.”
                            </blockquote>
                            <figcaption>
                                <strong className="block">
                                    Kepala MA Yapika
                                </strong>
                                <span className="text-sm ">
                                    Menyambut masa depan peserta didik dengan
                                    semangat belajar yang tinggi
                                </span>
                            </figcaption>
                            <Link
                                href="/profil"
                                className="inline-block font-bold text-link hover:underline"
                            >
                                Selengkapnya: visi, misi, sejarah
                            </Link>
                        </div>
                    </figure>
                </Reveal>
            </section> */}

            <section
                className="bg-card py-14 relative overflow-hidden 
                before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-24 before:bg-linear-to-r before:from-background before:to-transparent
                after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-24 after:bg-linear-to-l after:from-background after:to-transparent"
            >
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
                    <Judul>Program dan Jurusan</Judul>
                    <Link href="/program" className="text-link hover:underline">
                        Lihat semua
                    </Link>
                </div>

                {kelompokProgram.length === 0 && (
                    <p className="mx-auto mt-6 max-w-6xl px-4">Belum diisi.</p>
                )}

                <div className="mt-8 space-y-10">
                    {kelompokProgram.map((k, i) => (
                        <div key={k.kunci}>
                            <div className="mx-auto mb-4 flex max-w-6xl items-baseline justify-between gap-4 px-4">
                                <div>
                                    <h3 className="text-xl font-bold text-link">
                                        {k.judul}
                                    </h3>
                                    <p className="text-sm ">{k.ket}</p>
                                </div>
                            </div>

                            {k.isi.length >= MIN_MARQUEE ? (
                                <MarqueeCards
                                    items={k.isi}
                                    reverse={i % 2 === 1}
                                />
                            ) : (
                                <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {k.isi.map((p, j) => (
                                        <Link
                                            key={j}
                                            href={`/program#${k.kunci}`}
                                            className="kartu flex h-full flex-col gap-2 p-3"
                                        >
                                            {p.gambar ? (
                                                <img
                                                    src={`/storage/${p.gambar}`}
                                                    alt={p.nama}
                                                    loading="lazy"
                                                    className="h-24 w-full rounded object-cover"
                                                />
                                            ) : (
                                                <div className="h-24 rounded bg-alt" />
                                            )}
                                            <strong>{p.nama}</strong>
                                            {p.deskripsi && (
                                                <span className="line-clamp-2 text-sm ">
                                                    {p.deskripsi}
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-14">
                <div className="mb-6 flex items-center justify-between">
                    <Judul>Berita dan Pengumuman</Judul>
                    <Link href="/berita" className="text-link hover:underline">
                        Lihat semua
                    </Link>
                </div>
                {berita.length === 0 && <p className="">Belum ada berita.</p>}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {berita.map((b) => (
                        <Reveal key={b.slug} className="h-full">
                            <Link
                                href={`/berita/${b.slug}`}
                                className="kartu flex h-90 flex-col gap-3 overflow-hidden p-4"
                            >
                                {b.gambar ? (
                                    <img
                                        src={`/storage/${b.gambar}`}
                                        alt={b.judul}
                                        className="h-36 w-full shrink-0 rounded object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                ) : (
                                    <div className="h-36 w-full shrink-0 rounded bg-alt" />
                                )}

                                <span className="shrink-0 text-xs">
                                    {b.terbit_pada}
                                </span>

                                <strong className="line-clamp-2 min-h-12 text-base font-semibold">
                                    {b.judul}
                                </strong>

                                {b.ringkasan && (
                                    <p className="line-clamp-3 text-sm leading-5">
                                        {b.ringkasan}
                                    </p>
                                )}
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="bg-card">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-14 md:pt-20">
                    <h2 className="text-2xl font-bold  md:text-3xl">
                        Galeri Kegiatan
                    </h2>
                    <Link
                        href="/galeri"
                        className="py-2  text-link hover:underline"
                    >
                        Lihat semua
                    </Link>
                </div>

                {itemsGaleri.length === 0 && (
                    <p className="mx-auto max-w-6xl px-4 py-10 text-slate-300">
                        Belum ada foto.
                    </p>
                )}

                {pakaiDinding && (
                    <Suspense
                        fallback={
                            <div className="relative mt-8 h-105 md:h-130" />
                        }
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
                                className="overflow-hidden rounded-lg"
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

                <div className="" />
            </section>

            <section className="bg-brand text-white">
                <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-12 text-center">
                    <p className="text-2xl font-bold">
                        Penerimaan Peserta Didik Baru 2026/2027
                    </p>
                    <Link
                        href="/ppdb"
                        className="rounded-md  px-6 py-3 font-bold border-2  bg-white text-indigo-600 hover:bg-indigo-600 transition   hover:text-white cursor-pointer"
                    >
                        Daftar Sekarang
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
