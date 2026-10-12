import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

type Item = {
    id: number;
    judul: string;
    tanggal: string;
    kategori: string | null;
    status: string;
    foto_count: number;
};

export default function Index({ album }: { album: Item[] }) {
    const hapus = (a: Item) => {
        if (confirm(`Hapus album "${a.judul}" beserta ${a.foto_count} fotonya?`)) {
            router.delete(`/admin/album/${a.id}`);
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Album Galeri</h2>}>
            <Head title="Album Galeri" />
            <div className="mx-auto max-w-5xl px-4 py-8">
                <Link href="/admin/album/create" className="inline-block rounded-md bg-brand px-4 py-2.5 text-sm font-bold text-white">
                    + Buat Album
                </Link>

                <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="p-3">Album</th>
                                <th className="p-3">Tanggal</th>
                                <th className="p-3">Kategori</th>
                                <th className="p-3">Foto</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {album.map((a) => (
                                <tr key={a.id} className="border-t border-slate-200">
                                    <td className="p-3">{a.judul}</td>
                                    <td className="p-3 whitespace-nowrap">{a.tanggal}</td>
                                    <td className="p-3">{a.kategori ?? "-"}</td>
                                    <td className="p-3">{a.foto_count}</td>
                                    <td className="p-3">
                                        <span className={`rounded-full px-2 py-1 text-xs ${a.status === "terbit" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                                            {a.status === "terbit" ? "Terbit" : "Draf"}
                                        </span>
                                    </td>
                                    <td className="flex gap-4 p-3">
                                        <Link href={`/admin/album/${a.id}/edit`} className="text-brand">Edit</Link>
                                        <button onClick={() => hapus(a)} className="text-red-700">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                            {album.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-slate-500">Belum ada album.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}