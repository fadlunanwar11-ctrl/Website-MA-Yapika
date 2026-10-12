import FotoUploader from "@/Components/FotoUploader";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { FormEvent } from "react";

type Album = {
    id: number;
    judul: string;
    slug: string;
    tanggal: string;
    kategori: string | null;
    deskripsi: string | null;
    status: string;
};
type Foto = { id: number; gambar: string; keterangan: string | null };

const input = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2";

export default function Form({
    album,
    foto,
    kategori,
}: {
    album: Album | null;
    foto: Foto[];
    kategori: Record<string, string>;
}) {
    const { data, setData, post, put, processing, errors, recentlySuccessful } =
        useForm({
            judul: album?.judul ?? "",
            tanggal: album?.tanggal ?? new Date().toISOString().slice(0, 10),
            kategori: album?.kategori ?? "",
            deskripsi: album?.deskripsi ?? "",
            status: album?.status ?? "draft",
        });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (album) put(`/admin/album/${album.id}`, { preserveScroll: true });
        else post("/admin/album");
    };

    const hapusFoto = (id: number) => {
        if (confirm("Hapus foto ini?"))
            router.delete(`/admin/foto/${id}`, { preserveScroll: true });
    };

    const hapusAlbum = () => {
        if (
            album &&
            confirm(`Hapus album "${album.judul}" beserta semua fotonya?`)
        ) {
            router.delete(`/admin/album/${album.id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold">
                    {album ? "Edit Album" : "Buat Album"}
                </h2>
            }
        >
            <Head title={album ? "Edit Album" : "Buat Album"} />
            <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label htmlFor="judul" className="font-medium">
                            Nama kegiatan
                        </label>
                        <input
                            id="judul"
                            className={input}
                            value={data.judul}
                            onChange={(e) => setData("judul", e.target.value)}
                        />
                        {errors.judul && (
                            <p className="mt-1 text-sm text-red-700">
                                {errors.judul}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="tanggal" className="font-medium">
                                Tanggal kegiatan
                            </label>
                            <input
                                id="tanggal"
                                type="date"
                                className={input}
                                value={data.tanggal}
                                onChange={(e) =>
                                    setData("tanggal", e.target.value)
                                }
                            />
                            {errors.tanggal && (
                                <p className="mt-1 text-sm text-red-700">
                                    {errors.tanggal}
                                </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="kategori" className="font-medium">
                                Kategori (opsional)
                            </label>
                            <select
                                id="kategori"
                                className={input}
                                value={data.kategori}
                                onChange={(e) =>
                                    setData("kategori", e.target.value)
                                }
                            >
                                <option value="">Tanpa kategori</option>
                                {Object.entries(kategori).map(([k, label]) => (
                                    <option key={k} value={k}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            {errors.kategori && (
                                <p className="mt-1 text-sm text-red-700">
                                    {errors.kategori}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="deskripsi" className="font-medium">
                            Deskripsi singkat (opsional)
                        </label>
                        <textarea
                            id="deskripsi"
                            rows={3}
                            className={input}
                            value={data.deskripsi}
                            onChange={(e) =>
                                setData("deskripsi", e.target.value)
                            }
                        />
                        {errors.deskripsi && (
                            <p className="mt-1 text-sm text-red-700">
                                {errors.deskripsi}
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
                            <option value="draft">
                                Draf (belum tampil di website)
                            </option>
                            <option value="terbit">
                                Terbit (tampil di website)
                            </option>
                        </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-brand px-5 py-2.5 font-bold text-white disabled:opacity-50"
                        >
                            {album ? "Simpan" : "Buat album, lalu tambah foto"}
                        </button>
                        <Link href="/admin/album" className="text-slate-600">
                            Kembali
                        </Link>
                        {recentlySuccessful && (
                            <span className="text-sm text-green-700">
                                Tersimpan.
                            </span>
                        )}
                        {album && album.status === "terbit" && (
                            <a
                                href={`/galeri/${album.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand underline"
                            >
                                Lihat di website
                            </a>
                        )}
                    </div>
                </form>

                {album ? (
                    <>
                        <FotoUploader url={`/admin/album/${album.id}/foto`} />

                        <div>
                            <h3 className="mb-3 font-bold">
                                Foto di album ({foto.length})
                            </h3>
                            {foto.length === 0 && (
                                <p className="text-slate-500">
                                    Belum ada foto.
                                </p>
                            )}
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                {foto.map((f) => (
                                    <div
                                        key={f.id}
                                        className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-2"
                                    >
                                        <img
                                            src={`/storage/${f.gambar}`}
                                            alt={f.keterangan ?? ""}
                                            className="h-32 w-full rounded object-cover"
                                        />
                                        <span className="truncate text-xs text-slate-600">
                                            {f.keterangan ?? "-"}
                                        </span>
                                        <button
                                            onClick={() => hapusFoto(f.id)}
                                            className="text-left text-sm text-red-700"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={hapusAlbum}
                            className="text-sm text-red-700"
                        >
                            Hapus album ini
                        </button>
                    </>
                ) : (
                    <p className="text-sm text-slate-500">
                        Setelah album dibuat, kamu bisa langsung menambahkan
                        foto.
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
