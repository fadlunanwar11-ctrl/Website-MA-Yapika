import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function PPDBSelesai({ nomor }: { nomor: string }) {
    return (
        <PublicLayout>
            <Head title="Pendaftaran Terkirim" />
            <section className="mx-auto max-w-xl px-4 py-20 text-center">
                <h1 className="text-3xl font-bold">Pendaftaran terkirim</h1>
                <p className="mt-3 text-muted">
                    Simpan nomor pendaftaran ini. Panitia akan menghubungi orang
                    tua/wali melalui nomor HP yang diisi.
                </p>
                <div className="mt-6 rounded-lg border-2 border-brand bg-card p-6 text-3xl font-bold text-link">
                    {nomor}
                </div>
                <Link
                    href="/ppdb/cek"
                    className="mt-6 inline-block font-bold text-link"
                >
                    Cek status pendaftaran
                </Link>
                <Link href="/" className="mt-8 inline-block text-link">
                    Kembali ke Beranda
                </Link>
            </section>
        </PublicLayout>
    );
}
