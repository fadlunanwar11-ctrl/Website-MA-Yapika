import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEvent } from "react";

type Guru = {
    id: number;
    nama: string;
    jabatan: string | null;
    foto: string | null;
    urutan: number;
};

const input = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2";

export default function Form({ guru }: { guru: Guru | null }) {
    const { data, setData, post, processing, errors } = useForm<{
        _method: string;
        nama: string;
        jabatan: string;
        urutan: number;
        foto: File | null;
    }>({
        _method: guru ? "put" : "post",
        nama: guru?.nama ?? "",
        jabatan: guru?.jabatan ?? "",
        urutan: guru?.urutan ?? 0,
        foto: null,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(guru ? `/admin/guru/${guru.id}` : "/admin/guru", {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold">
                    {guru ? "Edit Guru" : "Tambah Guru"}
                </h2>
            }
        >
            <Head title={guru ? "Edit Guru" : "Tambah Guru"} />
            <form
                onSubmit={submit}
                className="mx-auto max-w-2xl space-y-5 px-4 py-8"
            >
                <div>
                    <label htmlFor="nama" className="font-medium">
                        Nama
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
                    <label htmlFor="jabatan" className="font-medium">
                        Jabatan / Mata pelajaran
                    </label>
                    <input
                        id="jabatan"
                        className={input}
                        value={data.jabatan}
                        onChange={(e) => setData("jabatan", e.target.value)}
                    />
                    {errors.jabatan && (
                        <p className="mt-1 text-sm text-accent">
                            {errors.jabatan}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="urutan" className="font-medium">
                        Urutan tampil
                    </label>
                    <p className="text-sm text-slate-500">
                        Angka kecil tampil lebih dulu (misalnya 1 untuk kepala
                        madrasah).
                    </p>
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
                    <label htmlFor="foto" className="font-medium">
                        Foto (maks. 2 MB)
                    </label>
                    {guru?.foto && (
                        <img
                            src={`/storage/${guru.foto}`}
                            alt=""
                            className="mt-2 h-32 rounded object-cover"
                        />
                    )}
                    <input
                        id="foto"
                        type="file"
                        accept="image/*"
                        className="mt-2 block"
                        onChange={(e) =>
                            setData("foto", e.target.files?.[0] ?? null)
                        }
                    />
                    {errors.foto && (
                        <p className="mt-1 text-sm text-accent">
                            {errors.foto}
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
                    <Link href="/admin/guru" className="text-slate-600">
                        Batal
                    </Link>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
