import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

type Item = {
    id: number;
    nama: string;
    jabatan: string | null;
    foto: string | null;
    urutan: number;
};

export default function Index({ guru }: { guru: Item[] }) {
    const hapus = (id: number, nama: string) => {
        if (confirm(`Hapus data "${nama}"?`)) {
            router.delete(`/admin/guru/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Kelola Guru</h2>}
        >
            <Head title="Kelola Guru" />
            <div className="mx-auto max-w-5xl px-4 py-8">
                <Link
                    href="/admin/guru/create"
                    className="inline-block rounded-md bg-brand px-4 py-2.5 text-sm font-bold text-white"
                >
                    + Tambah Guru
                </Link>

                <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="p-3">Foto</th>
                                <th className="p-3">Nama</th>
                                <th className="p-3">Jabatan / Mapel</th>
                                <th className="p-3">Urutan</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guru.map((g) => (
                                <tr
                                    key={g.id}
                                    className="border-t border-slate-200"
                                >
                                    <td className="p-3">
                                        {g.foto ? (
                                            <img
                                                src={`/storage/${g.foto}`}
                                                alt=""
                                                className="h-12 w-12 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded bg-slate-200" />
                                        )}
                                    </td>
                                    <td className="p-3">{g.nama}</td>
                                    <td className="p-3">{g.jabatan ?? "-"}</td>
                                    <td className="p-3">{g.urutan}</td>
                                    <td className="flex gap-4 p-3">
                                        <Link
                                            href={`/admin/guru/${g.id}/edit`}
                                            className="text-brand"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => hapus(g.id, g.nama)}
                                            className="text-accent"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {guru.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-6 text-center text-slate-500"
                                    >
                                        Belum ada data guru.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
