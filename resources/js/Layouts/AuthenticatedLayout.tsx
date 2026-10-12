import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useState } from "react";

const grup = [
    { judul: "", items: [{ label: "Dashboard", href: "/dashboard" }] },
    {
        judul: "Konten",
        items: [
            { label: "Berita", href: "/admin/berita" },
            { label: "Album Galeri", href: "/admin/album" },
            { label: "Program", href: "/admin/program" },
            { label: "Guru", href: "/admin/guru" },
        ],
    },
    {
        judul: "PPDB",
        items: [{ label: "Pendaftar PPDB", href: "/admin/pendaftar" }],
    },
    {
        judul: "Pengaturan",
        items: [
            { label: "Profil Madrasah", href: "/admin/profil" },
            { label: "Kontak", href: "/admin/kontak" },
        ],
    },
];

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const page = usePage();
    const user = (page.props as unknown as { auth: { user: { name: string } } })
        .auth.user;
    const [buka, setBuka] = useState(false);

    const aktif = (href: string) => page.url.startsWith(href);

    const menu = (
        <nav aria-label="Menu admin" className="flex flex-col gap-5 p-4">
            {grup.map((g) => (
                <div key={g.judul || "utama"}>
                    {g.judul && (
                        <p className="mb-1 px-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                            {g.judul}
                        </p>
                    )}
                    <ul className="flex flex-col gap-1">
                        {g.items.map((m) => (
                            <li key={m.href}>
                                <Link
                                    href={m.href}
                                    onClick={() => setBuka(false)}
                                    className={`block rounded-md px-3 py-2.5 text-sm ${
                                        aktif(m.href)
                                            ? "bg-brand font-bold text-white"
                                            : "text-slate-700 hover:bg-slate-100"
                                    }`}
                                >
                                    {m.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </nav>
    );

    const akun = (
        <div className="border-t border-slate-200 p-4 text-sm">
            <p className="truncate font-bold">{user?.name}</p>
            <Link href="/" className="block py-2 text-brand">
                Lihat website
            </Link>
            <Link href="/profile" className="block py-2 text-slate-700">
                Akun saya
            </Link>
            <Link
                href="/logout"
                method="post"
                as="button"
                className="py-2 text-red-700"
            >
                Keluar
            </Link>
        </div>
    );

    const logo = (
        <div className="flex h-16 flex-none items-center gap-3 border-b border-slate-200 px-4">
            <img src="/images/logo-yapika.png" alt="" className="h-10 w-auto" />
            <span className="font-bold">Admin MA Yapika</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
            <aside className="sticky top-0 hidden h-screen w-64 flex-none flex-col border-r border-slate-200 bg-white md:flex">
                {logo}
                <div className="flex-1 overflow-y-auto">{menu}</div>
                {akun}
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4">
                    <button
                        aria-label="Buka menu"
                        onClick={() => setBuka(true)}
                        className="flex h-11 w-11 flex-none items-center justify-center rounded-md border border-slate-300 md:hidden"
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                            <path d="M4 7h16M4 12h16M4 17h16" />
                        </svg>
                    </button>
                    <div className="min-w-0 flex-1">{header}</div>
                </header>

                <main className="flex-1">{children}</main>
            </div>

            {buka && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setBuka(false)}
                    />
                    <div className="absolute left-0 top-0 flex h-full w-72 max-w-[85%] flex-col bg-white shadow-xl">
                        {logo}
                        <div className="flex-1 overflow-y-auto">{menu}</div>
                        {akun}
                    </div>
                </div>
            )}
        </div>
    );
}
