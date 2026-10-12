import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { STATUS } from "@/lib/statusPendaftar";
import { Head, Link, router } from "@inertiajs/react";
import { FormEvent, useState } from "react";

type Item = {
    id: number;
    nomor: string | null;
    nama_lengkap: string;
    asal_sekolah: string;
    program: string | null;
    status: string;
    dibuat: string;
};
type PageLink = { url: string | null; label: string; active: boolean };
type Props = {
    pendaftar: { data: Item[]; links: PageLink[] };
    filter: { q: string; status: string };
    hitung: Record<string, number>;
};

const input = "rounded-md border border-slate-300 px-3 py-2";

export default function Index({ pendaftar, filter, hitung }: Props) {
    const [q, setQ] = useState(filter.q);
    const [status, setStatus] = useState(filter.status);

    const cari = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            "/admin/pendaftar",
            { q, status },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Pendaftar PPDB</h2>}
        >
            <Head title="Pendaftar PPDB" />
            <div className="mx-auto max-w-6xl space-y-5 px-4 py-8">
                <div className="flex flex-wrap gap-2">
                    {Object.entries(STATUS).map(([key, s]) => (
                        <span
                            key={key}
                            className={`rounded-full px-3 py-1 text-sm ${s.kelas}`}
                        >
                            {s.label}: {hitung[key] ?? 0}
                        </span>
                    ))}
                </div>

                <form
                    onSubmit={cari}
                    className="flex flex-wrap items-center gap-3"
                >
                    <input
                        className={`${input} w-64`}
                        placeholder="Cari nama, nomor, atau NISN"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                    <select
                        className={input}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Semua status</option>
                        {Object.entries(STATUS).map(([key, s]) => (
                            <option key={key} value={key}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="rounded-md bg-brand px-4 py-2 text-sm font-bold text-white"
                    >
                        Cari
                    </button>
                    <a
                        href={`/admin/pendaftar/export?status=${encodeURIComponent(status)}`}
                        className="ml-auto rounded-md border-2 border-brand px-4 py-2 text-sm font-bold text-brand"
                    >
                        Ekspor CSV
                    </a>
                </form>

                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="p-3">Nomor</th>
                                <th className="p-3">Nama</th>
                                <th className="p-3">Asal sekolah</th>
                                <th className="p-3">Program</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Tanggal</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendaftar.data.map((p) => (
                                <tr
                                    key={p.id}
                                    className="border-t border-slate-200"
                                >
                                    <td className="p-3">{p.nomor ?? "-"}</td>
                                    <td className="p-3">{p.nama_lengkap}</td>
                                    <td className="p-3">{p.asal_sekolah}</td>
                                    <td className="p-3">{p.program ?? "-"}</td>
                                    <td className="p-3">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs ${STATUS[p.status]?.kelas ?? ""}`}
                                        >
                                            {STATUS[p.status]?.label ??
                                                p.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{p.dibuat}</td>
                                    <td className="p-3">
                                        <Link
                                            href={`/admin/pendaftar/${p.id}`}
                                            className="text-brand"
                                        >
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {pendaftar.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-6 text-center text-slate-500"
                                    >
                                        Belum ada pendaftar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pendaftar.links.length > 3 && (
                    <nav className="flex flex-wrap gap-2">
                        {pendaftar.links.map((l, i) =>
                            l.url ? (
                                <Link
                                    key={i}
                                    href={l.url}
                                    className={`rounded border px-3 py-2 text-sm ${l.active ? "bg-brand text-white" : "bg-white"}`}
                                    dangerouslySetInnerHTML={{
                                        __html: l.label,
                                    }}
                                />
                            ) : (
                                <span
                                    key={i}
                                    className="rounded border px-3 py-2 text-sm text-slate-400"
                                    dangerouslySetInnerHTML={{
                                        __html: l.label,
                                    }}
                                />
                            ),
                        )}
                    </nav>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
