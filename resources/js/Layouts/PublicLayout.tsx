import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, useState } from "react";

type Kontak = {
    alamat?: string | null;
    telepon?: string | null;
    email?: string | null;
};

const menu = [
    { label: "Beranda", href: "/" },
    { label: "Profil", href: "/profil" },
    { label: "Program", href: "/program" },
    { label: "Berita", href: "/berita" },
    { label: "Galeri", href: "/galeri" },
    { label: "Kontak", href: "/kontak" },
];

export default function PublicLayout({ children }: PropsWithChildren) {
    const [open, setOpen] = useState(false);
    const [dark, setDark] = useState<boolean>(() => {
        try {
            const t = localStorage.getItem("theme");
            if (t) return t === "dark";
        } catch {}
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    const page = usePage();
    const kontak = (page.props as unknown as { kontak: Kontak }).kontak;
    const aktif = (href: string) =>
        href === "/" ? page.url === "/" : page.url.startsWith(href);

    const ganti = () => {
        const next = !dark;
        setDark(next);
        try {
            localStorage.setItem("theme", next ? "dark" : "light");
        } catch {}
    };

    return (
        <div className={`${dark ? "dark" : ""} min-h-screen bg-page text-ink`}>
            <header className="sticky top-0 z-40 border-b border-line bg-card/90 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-3">
                        <img
                            src="/images/logo-yapika.png"
                            alt="Logo YAPIKA"
                            className="h-11 w-auto"
                        />
                        <span className="font-bold">MA Yapika</span>
                    </Link>

                    <nav className="hidden gap-6 text-sm md:flex">
                        {menu.map((m) => (
                            <Link
                                key={m.href}
                                href={m.href}
                                className={
                                    aktif(m.href)
                                        ? "font-bold text-link"
                                        : "hover:text-link"
                                }
                            >
                                {m.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={ganti}
                            aria-label={
                                dark
                                    ? "Ganti ke mode terang"
                                    : "Ganti ke mode gelap"
                            }
                            className="flex h-11 w-11 items-center justify-center rounded-md border border-line cursor-pointer"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {dark ? (
                                    <>
                                        <circle cx="12" cy="12" r="4" />
                                        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                                    </>
                                ) : (
                                    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                                )}
                            </svg>
                        </button>
                        <Link
                            href="/ppdb"
                            className="rounded-md bg-accent px-4 py-2.5 text-sm font-bold border-2 border-link"
                        >
                            PPDB
                        </Link>
                        <button
                            aria-label="Buka menu"
                            onClick={() => setOpen(!open)}
                            className="flex h-11 w-11 items-center justify-center rounded-md border border-line md:hidden"
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
                    </div>
                </div>

                {open && (
                    <nav className="flex flex-col border-t border-line px-4 py-2 md:hidden">
                        {menu.map((m) => (
                            <Link
                                key={m.href}
                                href={m.href}
                                className={`py-3 text-sm ${aktif(m.href) ? "font-bold text-link" : ""}`}
                            >
                                {m.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </header>

            <main>{children}</main>

            <footer className="border-t border-line bg-slate-900 text-slate-200">
                <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
                    <div>
                        <strong>MA Yapika</strong>
                        <p className="mt-2 text-sm">
                            {kontak?.alamat || "Alamat belum diisi"}
                        </p>
                    </div>
                    <div>
                        <strong>Kontak</strong>
                        <p className="mt-2 text-sm">
                            {[kontak?.telepon, kontak?.email]
                                .filter(Boolean)
                                .join(" / ") || "Belum diisi"}
                        </p>
                    </div>
                    <div className="text-sm">
                        <Link href="/kontak" className="underline">
                            Kontak lengkap dan peta
                        </Link>
                        <br />
                        <Link href="/ppdb/cek" className="underline">
                            Cek status PPDB
                        </Link>
                    </div>
                </div>
                <div className="mx-auto max-w-6xl px-4 pb-6 text-xs">
                    &copy; {new Date().getFullYear()} MA Yapika
                </div>
            </footer>
        </div>
    );
}
