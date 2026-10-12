import { Head, useForm, Link } from "@inertiajs/react";
import { FormEvent, ReactNode } from "react";
import PublicLayout from "@/Layouts/PublicLayout";

type Program = { id: number; nama: string };

const input = "mt-1 w-full rounded-md border border-line px-3 py-2";

const langkah = [
    "Isi formulir",
    "Verifikasi panitia",
    "Pengumuman hasil",
    "Daftar ulang",
];

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div>
            <label className="font-medium">{label}</label>
            {children}
            {error && <p className="mt-1 text-sm text-danger">{error}</p>}
        </div>
    );
}

export default function PPDB({ program }: { program: Program[] }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_lengkap: "",
        nisn: "",
        jenis_kelamin: "",
        tanggal_lahir: "",
        asal_sekolah: "",
        alamat: "",
        nama_wali: "",
        no_hp_wali: "",
        email: "",
        program_id: "",
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post("/ppdb");
    };

    return (
        <PublicLayout>
            <Head title="PPDB" />

            <section className="bg-brand text-white">
                <div className="mx-auto max-w-6xl px-4 py-14">
                    <h1 className="text-4xl font-bold">PPDB 2026/2027</h1>
                    <p className="mt-2 text-sky-100">
                        Penerimaan peserta didik baru MA Yapika
                    </p>
                    <Link
                        href="/ppdb/cek"
                        className="mt-4 inline-block rounded-md bg-white px-4 py-2 text-sm font-bold text-brand"
                    >
                        Sudah mendaftar? Cek status
                    </Link>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-12">
                <h2 className="mb-5 text-2xl font-bold">Alur Pendaftaran</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {langkah.map((l, i) => (
                        <div
                            key={l}
                            className="kartu p-4"
                        >
                            <div className="text-2xl font-bold text-danger">
                                {i + 1}
                            </div>
                            <strong>{l}</strong>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-3xl px-4 pb-16">
                <form
                    onSubmit={submit}
                    className="space-y-5 kartu p-6"
                >
                    <h2 className="text-xl font-bold">Formulir Pendaftaran</h2>

                    <Field
                        label="Nama lengkap calon siswa"
                        error={errors.nama_lengkap}
                    >
                        <input
                            className={input}
                            value={data.nama_lengkap}
                            onChange={(e) =>
                                setData("nama_lengkap", e.target.value)
                            }
                        />
                    </Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="NISN (10 digit)" error={errors.nisn}>
                            <input
                                className={input}
                                inputMode="numeric"
                                maxLength={10}
                                value={data.nisn}
                                onChange={(e) =>
                                    setData("nisn", e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            label="Jenis kelamin"
                            error={errors.jenis_kelamin}
                        >
                            <select
                                className={input}
                                value={data.jenis_kelamin}
                                onChange={(e) =>
                                    setData("jenis_kelamin", e.target.value)
                                }
                            >
                                <option value="">Pilih...</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </Field>
                        <Field
                            label="Tanggal lahir"
                            error={errors.tanggal_lahir}
                        >
                            <input
                                type="date"
                                className={input}
                                value={data.tanggal_lahir}
                                onChange={(e) =>
                                    setData("tanggal_lahir", e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Asal sekolah" error={errors.asal_sekolah}>
                            <input
                                className={input}
                                value={data.asal_sekolah}
                                onChange={(e) =>
                                    setData("asal_sekolah", e.target.value)
                                }
                            />
                        </Field>
                    </div>

                    <Field label="Alamat" error={errors.alamat}>
                        <textarea
                            rows={3}
                            className={input}
                            value={data.alamat}
                            onChange={(e) => setData("alamat", e.target.value)}
                        />
                    </Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field
                            label="Nama orang tua / wali"
                            error={errors.nama_wali}
                        >
                            <input
                                className={input}
                                value={data.nama_wali}
                                onChange={(e) =>
                                    setData("nama_wali", e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            label="Nomor HP orang tua / wali"
                            error={errors.no_hp_wali}
                        >
                            <input
                                className={input}
                                inputMode="tel"
                                value={data.no_hp_wali}
                                onChange={(e) =>
                                    setData("no_hp_wali", e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Email (opsional)" error={errors.email}>
                            <input
                                type="email"
                                className={input}
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            label="Pilihan program"
                            error={errors.program_id}
                        >
                            <select
                                className={input}
                                value={data.program_id}
                                onChange={(e) =>
                                    setData("program_id", e.target.value)
                                }
                            >
                                <option value="">Belum menentukan</option>
                                {program.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nama}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-md bg-accent px-6 py-3 font-bold text-white disabled:opacity-50"
                    >
                        {processing ? "Mengirim..." : "Kirim Pendaftaran"}
                    </button>
                </form>
            </section>
        </PublicLayout>
    );
}
