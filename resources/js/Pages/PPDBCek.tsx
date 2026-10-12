import { Head, useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { STATUS } from "@/lib/statusPendaftar";

type Hasil = { nomor: string; nama: string; status: string } | false | null;

const pesan: Record<string, string> = {
    baru: "Pendaftaran sudah kami terima dan menunggu diperiksa panitia.",
    diverifikasi:
        "Data sudah diperiksa panitia. Mohon menunggu keputusan akhir.",
    diterima:
        "Selamat, kamu dinyatakan diterima. Panitia akan menghubungi orang tua/wali untuk langkah daftar ulang.",
    ditolak:
        "Mohon maaf, pendaftaran belum dapat diterima. Silakan hubungi panitia untuk informasi lebih lanjut.",
};

const input = "mt-1 w-full rounded-md border border-line px-3 py-2";

export default function PPDBCek({ hasil }: { hasil: Hasil }) {
    const { data, setData, post, processing, errors } = useForm({
        nomor: "",
        nisn: "",
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post("/ppdb/cek", { preserveState: true });
    };

    return (
        <PublicLayout>
            <Head title="Cek Status Pendaftaran" />
            <section className="mx-auto max-w-xl px-4 py-16">
                <h1 className="text-3xl font-bold">Cek Status Pendaftaran</h1>
                <p className="mt-2 text-muted">
                    Masukkan nomor pendaftaran dan NISN yang kamu isi saat
                    mendaftar.
                </p>

                <form
                    onSubmit={submit}
                    className="mt-6 space-y-4 kartu p-6"
                >
                    <div>
                        <label htmlFor="nomor" className="font-medium">
                            Nomor pendaftaran
                        </label>
                        <input
                            id="nomor"
                            className={input}
                            placeholder="PPDB-2026-0001"
                            value={data.nomor}
                            onChange={(e) => setData("nomor", e.target.value)}
                        />
                        {errors.nomor && (
                            <p className="mt-1 text-sm text-danger">
                                {errors.nomor}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="nisn" className="font-medium">
                            NISN
                        </label>
                        <input
                            id="nisn"
                            className={input}
                            inputMode="numeric"
                            maxLength={10}
                            value={data.nisn}
                            onChange={(e) => setData("nisn", e.target.value)}
                        />
                        {errors.nisn && (
                            <p className="mt-1 text-sm text-danger">
                                {errors.nisn}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-md bg-brand px-5 py-2.5 font-bold text-white disabled:opacity-50"
                    >
                        {processing ? "Memeriksa..." : "Cek Status"}
                    </button>
                    
                </form>

                {hasil === false && (
                    <p className="mt-6 rounded-md bg-red-50 p-4 text-red-800">
                        Data tidak ditemukan. Periksa kembali nomor pendaftaran
                        dan NISN.
                    </p>
                )}

                {hasil && (
                    <div className="mt-6 space-y-2 rounded-lg border-2 border-brand bg-card p-6">
                        <div className="text-sm text-muted">
                            {hasil.nomor}
                        </div>
                        <div className="text-xl font-bold">{hasil.nama}</div>
                        <span
                            className={`inline-block rounded-full px-3 py-1 text-sm ${STATUS[hasil.status]?.kelas ?? ""}`}
                        >
                            {STATUS[hasil.status]?.label ?? hasil.status}
                        </span>
                        <p className="text-ink">
                            {pesan[hasil.status] ?? ""}
                        </p>
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
