import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

type Item = {
    id: number;
    nama: string;
    kategori: string;
    gambar: string | null;
    urutan: number;
};

export default function Index({ program }: { program: Item[] }) {
    const hapus = (id: number, nama: string) => {
        if (confirm(`Hapus program "${nama}"?`)) {
            router.delete(`/admin/program/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Kelola Program</h2>}
        >
            <Head title="Kelola Program" />
            <div className="mx-auto max-w-5xl px-4 py-8">
                <Link
                    href="/admin/program/create"
                    className="inline-block rounded-md bg-brand px-4 py-2.5 text-sm font-bold text-white"
                >
                    + Tambah Program
                </Link>

                <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="p-3">Gambar</th>
                                <th className="p-3">Nama</th>
                                <th className="p-3">Kategori</th>
                                <th className="p-3">Urutan</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {program.map((p) => (
                                <tr
                                    key={p.id}
                                    className="border-t border-slate-200"
                                >
                                    <td className="p-3">
                                        {p.gambar ? (
                                            <img
                                                src={`/storage/${p.gambar}`}
                                                alt=""
                                                className="h-12 w-12 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded bg-slate-200" />
                                        )}
                                    </td>
                                    <td className="p-3">{p.nama}</td>
                                    <td className="p-3">
                                        {{
                                            unggulan: "Kelas Unggulan",
                                            ekstrakurikuler: "Ekstrakurikuler",
                                            organisasi: "Organisasi",
                                        }[p.kategori] ?? p.kategori}
                                    </td>
                                    <td className="p-3">{p.urutan}</td>
                                    <td className="flex gap-4 p-3">
                                        <Link
                                            href={`/admin/program/${p.id}/edit`}
                                            className="text-brand"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => hapus(p.id, p.nama)}
                                            className="text-accent"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {program.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-6 text-center text-slate-500"
                                    >
                                        Belum ada program.
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
