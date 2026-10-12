import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import PublicLayout from "@/Layouts/PublicLayout";

type Foto = { gambar: string; keterangan: string | null };
type Props = {
    album: {
        judul: string;
        tanggal: string;
        kategori: string | null;
        deskripsi: string | null;
    };
    foto: Foto[];
};

export default function Show({ album, foto }: Props) {
    const [i, setI] = useState<number | null>(null);
    const jumlah = foto.length;

    const geser = (d: number) =>
        setI((n) => (n === null ? n : (n + d + jumlah) % jumlah));

    useEffect(() => {
        if (i === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setI(null);
            if (e.key === "ArrowRight")
                setI((n) => (n === null ? n : (n + 1) % jumlah));
            if (e.key === "ArrowLeft")
                setI((n) => (n === null ? n : (n - 1 + jumlah) % jumlah));
        };
        window.addEventListener("keydown", onKey);
        const lama = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = lama;
        };
    }, [i === null, jumlah]);

    const aktif = i !== null ? foto[i] : null;

    return (
        <PublicLayout>
            <Head title={album.judul}>
                <meta
                    name="description"
                    content={
                        album.deskripsi ??
                        `Dokumentasi ${album.judul}, ${album.tanggal}.`
                    }
                />
            </Head>

            <section className="bg-brand text-white">
                <div className="mx-auto max-w-6xl px-4 py-12">
                    <Link
                        href="/galeri"
                        className="text-sm text-sky-100 underline"
                    >
                        &larr; Semua album
                    </Link>
                    <h1 className="mt-3 text-3xl font-bold md:text-4xl">
                        {album.judul}
                    </h1>
                    <p className="mt-2 text-sky-100">
                        {album.tanggal}
                        {album.kategori && <> &middot; {album.kategori}</>}{" "}
                        &middot; {jumlah} foto
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-12">
                {album.deskripsi && (
                    <p className="mb-8 max-w-3xl leading-relaxed">
                        {album.deskripsi}
                    </p>
                )}
                {jumlah === 0 && <p className="text-muted">Belum ada foto.</p>}

                <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
                    {foto.map((f, n) => (
                        <button
                            key={n}
                            onClick={() => setI(n)}
                            className="mb-3 block w-full overflow-hidden rounded-lg"
                            aria-label={
                                f.keterangan
                                    ? `Perbesar: ${f.keterangan}`
                                    : `Perbesar foto ${n + 1}`
                            }
                        >
                            <img
                                src={`/storage/${f.gambar}`}
                                alt={f.keterangan ?? ""}
                                loading="lazy"
                                className="w-full"
                            />
                        </button>
                    ))}
                </div>
            </section>

            {aktif && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Foto ${(i ?? 0) + 1} dari ${jumlah}`}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/90 p-4"
                    onClick={() => setI(null)}
                >
                    <button
                        autoFocus
                        onClick={() => setI(null)}
                        className="absolute right-4 top-4 rounded bg-white px-3 py-2 text-sm font-bold text-slate-900"
                    >
                        Tutup
                    </button>

                    {jumlah > 1 && (
                        <>
                            <button
                                aria-label="Foto sebelumnya"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    geser(-1);
                                }}
                                className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-slate-900"
                            >
                                &lsaquo;
                            </button>
                            <button
                                aria-label="Foto berikutnya"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    geser(1);
                                }}
                                className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-slate-900"
                            >
                                &rsaquo;
                            </button>
                        </>
                    )}

                    <img
                        src={`/storage/${aktif.gambar}`}
                        alt={aktif.keterangan ?? ""}
                        className="max-h-[78vh] max-w-full rounded"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <p className="text-sm text-white">
                        {(i ?? 0) + 1} / {jumlah}
                        {aktif.keterangan && <> &middot; {aktif.keterangan}</>}
                    </p>
                </div>
            )}
        </PublicLayout>
    );
}
