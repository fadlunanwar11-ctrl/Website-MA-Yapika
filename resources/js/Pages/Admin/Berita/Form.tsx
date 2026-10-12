import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEvent } from "react";

type Berita = {
    id: number;
    judul: string;
    ringkasan: string | null;
    isi: string;
    gambar: string | null;
    status: string;
};

const input = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2";

export default function Form({ berita }: { berita: Berita | null }) {
    const { data, setData, post, processing, errors } = useForm<{
        _method: string;
        judul: string;
        ringkasan: string;
        isi: string;
        status: string;
        gambar: File | null;
    }>({
        _method: berita ? "put" : "post",
        judul: berita?.judul ?? "",
        ringkasan: berita?.ringkasan ?? "",
        isi: berita?.isi ?? "",
        status: berita?.status ?? "draft",
        gambar: null,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(berita ? `/admin/berita/${berita.id}` : "/admin/berita", {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold">
                    {berita ? "Edit Berita" : "Tambah Berita"}
                </h2>
            }
        >
            <Head title={berita ? "Edit Berita" : "Tambah Berita"} />
            <form
                onSubmit={submit}
                className="mx-auto max-w-3xl space-y-5 px-4 py-8"
            >
                <div>
                    <label htmlFor="judul" className="font-medium">
                        Judul
                    </label>
                    <input
                        id="judul"
                        className={input}
                        value={data.judul}
                        onChange={(e) => setData("judul", e.target.value)}
                    />
                    {errors.judul && (
                        <p className="mt-1 text-sm text-accent">
                            {errors.judul}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="ringkasan" className="font-medium">
                        Ringkasan (opsional)
                    </label>
                    <textarea
                        id="ringkasan"
                        rows={2}
                        className={input}
                        value={data.ringkasan}
                        onChange={(e) => setData("ringkasan", e.target.value)}
                    />
                    {errors.ringkasan && (
                        <p className="mt-1 text-sm text-accent">
                            {errors.ringkasan}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="isi" className="font-medium">
                        Isi berita
                    </label>
                    <textarea
                        id="isi"
                        rows={10}
                        className={input}
                        value={data.isi}
                        onChange={(e) => setData("isi", e.target.value)}
                    />
                    {errors.isi && (
                        <p className="mt-1 text-sm text-accent">{errors.isi}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="gambar" className="font-medium">
                        Gambar (maks. 2 MB)
                    </label>
                    {berita?.gambar && (
                        <img
                            src={`/storage/${berita.gambar}`}
                            alt=""
                            className="mt-2 h-32 rounded object-cover"
                        />
                    )}
                    <input
                        id="gambar"
                        type="file"
                        accept="image/*"
                        className="mt-2 block cursor-pointer border-2  border-black text"
                        onChange={(e) =>
                            setData("gambar", e.target.files?.[0] ?? null)
                        }
                    />
                    {errors.gambar && (
                        <p className="mt-1 text-sm text-accent">
                            {errors.gambar}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="status" className="font-medium">
                        Status
                    </label>
                    <select
                        id="status"
                        className={input}
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                    >
                        <option value="draft">Draft (belum tampil)</option>
                        <option value="terbit">
                            Terbit (tampil di website)
                        </option>
                    </select>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-md bg-brand px-5 py-2.5 font-bold text-white disabled:opacity-50 cursor-pointer "
                    >
                        Simpan
                    </button>
                    <Link href="/admin/berita" className="text-slate-600">
                        Batal
                    </Link>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
