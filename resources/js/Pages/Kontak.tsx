import { Head, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import PageHero from "@/Components/PageHero";

type Kontak = {
    alamat?: string | null;
    telepon?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    jam_layanan?: string | null;
    peta_embed?: string | null;
};

export default function KontakPage() {
    const { kontak } = usePage().props as unknown as { kontak: Kontak };
    const wa = kontak?.whatsapp?.replace(/\D/g, "").replace(/^0/, "62");

    const info: [string, string | null | undefined, string?][] = [
        ["Alamat", kontak?.alamat],
        [
            "Telepon",
            kontak?.telepon,
            kontak?.telepon
                ? `tel:${kontak.telepon.replace(/[^\d+]/g, "")}`
                : undefined,
        ],
        [
            "Email",
            kontak?.email,
            kontak?.email ? `mailto:${kontak.email}` : undefined,
        ],
        ["Jam layanan", kontak?.jam_layanan],
    ];

    return (
        <PublicLayout>
            <Head title="Kontak">
                <meta
                    name="description"
                    content="Alamat, telepon, email, dan lokasi MA Yapika."
                />
            </Head>

            <section className="bg-brand text-white">
                <PageHero
                    gambar="/images/gedungMA.png"
                    judul="KONTAK"
                    sub="Hubungi Madrasah Aliyah Yapika."
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

            <section className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {info.map(([label, nilai, href]) => (
                        <div key={label} className="kartu p-5">
                            <h2 className="text-sm font-bold text-link">
                                {label}
                            </h2>
                            {nilai ? (
                                href ? (
                                    <a
                                        href={href}
                                        className="mt-1 block wrap-break-words"
                                    >
                                        {nilai}
                                    </a>
                                ) : (
                                    <p className="mt-1 whitespace-pre-line wrap-break-words">
                                        {nilai}
                                    </p>
                                )
                            ) : (
                                <p className="mt-1 text-muted">Belum diisi.</p>
                            )}
                        </div>
                    ))}
                </div>

                {wa && (
                    <a
                        href={`https://wa.me/${wa}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-block rounded-md bg-brand px-6 py-3 font-bold text-white"
                    >
                        Chat via WhatsApp
                    </a>
                )}
            </section>

            {kontak?.peta_embed && (
                <section className="mx-auto max-w-6xl px-4 pb-16">
                    <h2 className="mb-4 text-2xl font-bold">Lokasi</h2>
                    <iframe
                        src={kontak.peta_embed}
                        title="Peta lokasi MA Yapika"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="h-80 w-full rounded-lg border-0"
                    />
                </section>
            )}
        </PublicLayout>
    );
}
