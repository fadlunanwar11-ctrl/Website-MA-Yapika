import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { STATUS } from "@/lib/statusPendaftar";
import { Head, Link } from "@inertiajs/react";

type Props = {
    berita: { total: number; terbit: number; draft: number };
    ppdb: {
        total: number;
        per_status: Record<string, number>;
        hari_ini: number;
        harian: { label: string; total: number }[];
        terbaru: {
            id: number;
            nomor: string | null;
            nama_lengkap: string;
            program: string | null;
            status: string;
            dibuat: string;
        }[];
    };
};

export default function Dashboard({ berita, ppdb }: Props) {
    const baru = ppdb.per_status.baru ?? 0;
    const minggu = ppdb.harian.reduce((a, h) => a + h.total, 0);
    const maks = Math.max(1, ...ppdb.harian.map((h) => h.total));

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
                {baru > 0 && (
                    <Link
                        href="/admin/pendaftar?status=baru"
                        className="flex items-center justify-between rounded-lg border border-sky-300 bg-sky-50 p-4 text-sky-900"
                    >
                        <span>
                            <strong>{baru} pendaftar baru</strong> menunggu
                            diperiksa
                        </span>
                        <span className="font-bold underline">Periksa</span>
                    </Link>
                )}

                <section aria-labelledby="ringkasan-ppdb">
                    <h3 id="ringkasan-ppdb" className="mb-3 text-lg font-bold">
                        Pendaftar PPDB
                    </h3>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <div className="rounded-lg border border-slate-200 bg-white p-5">
                            <div className="text-3xl font-bold text-brand">
                                {ppdb.total}
                            </div>
                            <div className="text-sm text-slate-600">
                                Total pendaftar
                            </div>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white p-5">
                            <div className="text-3xl font-bold text-brand">
                                {ppdb.hari_ini}
                            </div>
                            <div className="text-sm text-slate-600">
                                Hari ini
                            </div>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white p-5">
                            <div className="text-3xl font-bold text-brand">
                                {minggu}
                            </div>
                            <div className="text-sm text-slate-600">
                                7 hari terakhir
                            </div>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white p-5">
                            <div className="text-3xl font-bold text-brand">
                                {ppdb.per_status.diterima ?? 0}
                            </div>
                            <div className="text-sm text-slate-600">
                                Diterima
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {Object.entries(STATUS).map(([key, s]) => (
                            <Link
                                key={key}
                                href={`/admin/pendaftar?status=${key}`}
                                className={`rounded-full px-3 py-1 text-sm ${s.kelas}`}
                            >
                                {s.label}: {ppdb.per_status[key] ?? 0}
                            </Link>
                        ))}
                    </div>
                </section>

                <section
                    aria-labelledby="grafik-ppdb"
                    className="rounded-lg border border-slate-200 bg-white p-5"
                >
                    <h3 id="grafik-ppdb" className="mb-4 font-bold">
                        Pendaftar per hari (7 hari terakhir)
                    </h3>
                    <ol className="flex h-40 items-end gap-2">
                        {ppdb.harian.map((h) => (
                            <li
                                key={h.label}
                                className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                            >
                                <span className="text-xs font-bold">
                                    {h.total}
                                </span>
                                <div
                                    className="w-full rounded-t bg-brand"
                                    style={{
                                        height: `${Math.max(
                                            h.total === 0 ? 2 : 6,
                                            (h.total / maks) * 100,
                                        )}%`,
                                    }}
                                />
                                <span className="text-xs text-slate-600">
                                    {h.label}
                                </span>
                            </li>
                        ))}
                    </ol>
                </section>

                <section aria-labelledby="terbaru-ppdb">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 id="terbaru-ppdb" className="text-lg font-bold">
                            Pendaftar terbaru
                        </h3>
                        <Link
                            href="/admin/pendaftar"
                            className="text-sm text-brand"
                        >
                            Lihat semua
                        </Link>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-3">Nomor</th>
                                    <th className="p-3">Nama</th>
                                    <th className="p-3">Program</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Waktu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ppdb.terbaru.map((p) => (
                                    <tr
                                        key={p.id}
                                        className="border-t border-slate-200"
                                    >
                                        <td className="p-3">
                                            {p.nomor ?? "-"}
                                        </td>
                                        <td className="p-3">
                                            <Link
                                                href={`/admin/pendaftar/${p.id}`}
                                                className="text-brand"
                                            >
                                                {p.nama_lengkap}
                                            </Link>
                                        </td>
                                        <td className="p-3">
                                            {p.program ?? "-"}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs ${STATUS[p.status]?.kelas ?? ""}`}
                                            >
                                                {STATUS[p.status]?.label ??
                                                    p.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap p-3">
                                            {p.dibuat}
                                        </td>
                                    </tr>
                                ))}
                                {ppdb.terbaru.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="p-6 text-center text-slate-500"
                                        >
                                            Belum ada pendaftar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section
                    aria-labelledby="ringkasan-berita"
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4"
                >
                    <h3 id="ringkasan-berita" className="font-bold">
                        Berita
                    </h3>
                    <p className="text-sm text-slate-600">
                        {berita.total} total &middot; {berita.terbit} terbit
                        &middot; {berita.draft} draf
                    </p>
                    <Link
                        href="/admin/berita/create"
                        className="rounded-md bg-brand px-4 py-2 text-sm font-bold text-white"
                    >
                        + Tambah Berita
                    </Link>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}