import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEvent } from "react";

type Program = {
    id: number;
    nama: string;
    kategori: string;

    deskripsi: string | null;
    poin: string | null;
    gambar: string | null;
    urutan: number;
};

const input = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2";

export default function Form({ program }: { program: Program | null }) {
    const { data, setData, post, processing, errors } = useForm<{
        _method: string;
        nama: string;
        kategori: string;
        deskripsi: string;
        poin: string;
        urutan: number;
        gambar: File | null;
    }>({
        _method: program ? "put" : "post",
        nama: program?.nama ?? "",
        kategori: program?.kategori ?? "unggulan",
        deskripsi: program?.deskripsi ?? "",
        poin: program?.poin ?? "",
        urutan: program?.urutan ?? 0,
        gambar: null,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(program ? `/admin/program/${program.id}` : "/admin/program", {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold">
                    {program ? "Edit Program" : "Tambah Program"}
                </h2>
            }
        >
            <Head title={program ? "Edit Program" : "Tambah Program"} />
            <form
                onSubmit={submit}
                className="mx-auto max-w-2xl space-y-5 px-4 py-8"
            >
                <div>
                    <label htmlFor="nama" className="font-medium">
                        Nama program
                    </label>
                    <input
                        id="nama"
                        className={input}
                        value={data.nama}
                        onChange={(e) => setData("nama", e.target.value)}
                    />
                    {errors.nama && (
                        <p className="mt-1 text-sm text-accent">
                            {errors.nama}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="kategori" className="font-medium">
                        Kategori
                    </label>
                    <select
                        id="kategori"
                        className={input}
                        value={data.kategori}
                        onChange={(e) => setData("kategori", e.target.value)}
                    >
                        <option value="unggulan">Kelas Unggulan</option>
                        <option value="ekstrakurikuler">Ekstrakurikuler</option>
                        <option value="organisasi">Organisasi</option>
                    </select>
                    {errors.kategori && (
                        <p className="mt-1 text-sm text-accent">
                            {errors.kategori}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="deskripsi" className="font-medium">
                        Deskripsi singkat
                    </label>
                    <textarea
                        id="deskripsi"
                        rows={3}
                        className={input}
                        value={data.deskripsi}
                        onChange={(e) => setData("deskripsi", e.target.value)}
                    />
                    {errors.deskripsi && (
                        <p className="mt-1 text-sm text-accent">
                            {errors.deskripsi}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="poin" className="font-medium">
                        Poin unggulan
                    </label>
                    <p className="text-sm text-slate-500">
                        Satu poin per baris (mata pelajaran, kegiatan, dan
                        sebagainya).
                    </p>
                    <textarea
                        id="poin"
                        rows={5}
                        className={input}
                        value={data.poin}
                        onChange={(e) => setData("poin", e.target.value)}
                    />
                    {errors.poin && (
                        <p className="mt-1 text-sm text-accent">
                            {errors.poin}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="urutan" className="font-medium">
                        Urutan tampil
                    </label>
                    <input
                        id="urutan"
                        type="number"
                        min={0}
                        className={input}
                        value={data.urutan}
                        onChange={(e) =>
                            setData("urutan", Number(e.target.value))
                        }
                    />
                    {errors.urutan && (
                        <p className="mt-1 text-sm text-accent">
                            {errors.urutan}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="gambar" className="font-medium">
                        Gambar (maks. 2 MB)
                    </label>
                    {program?.gambar && (
                        <img
                            src={`/storage/${program.gambar}`}
                            alt=""
                            className="mt-2 h-32 rounded object-cover"
                        />
                    )}
                    <input
                        id="gambar"
                        type="file"
                        accept="image/*"
                        className="mt-2 block"
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

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-md bg-brand px-5 py-2.5 font-bold text-white disabled:opacity-50"
                    >
                        Simpan
                    </button>
                    <Link href="/admin/program" className="text-slate-600">
                        Batal
                    </Link>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
