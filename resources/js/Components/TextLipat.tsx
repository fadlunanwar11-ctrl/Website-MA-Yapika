import { ReactNode, useId, useLayoutEffect, useRef, useState } from "react";

type Props = {
    children: ReactNode;
    tinggi?: number; // tinggi saat tertutup, dalam piksel
    labelBuka?: string;
    labelTutup?: string;
    pudar?: string; // warna pudar harus sama dengan latar, misalnya "from-alt"
    className?: string; // gaya untuk isi teks
};

export default function TextLipat({
    children,
    tinggi = 176,
    labelBuka = "Baca selengkapnya",
    labelTutup = "Tampilkan lebih sedikit",
    pudar = "from-card",
    className = "",
}: Props) {
    const id = useId();
    const kotak = useRef<HTMLDivElement>(null);
    const isi = useRef<HTMLDivElement>(null);
    const [penuh, setPenuh] = useState(0);
    const [terbuka, setTerbuka] = useState(false);

    useLayoutEffect(() => {
        const el = isi.current;
        if (!el) return;
        const ukur = () => setPenuh(el.offsetHeight);
        ukur();
        if (typeof ResizeObserver === "undefined") return;
        const ro = new ResizeObserver(ukur);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const panjang = penuh > tinggi + 8;
    const terpotong = panjang && !terbuka;

    const ganti = () => {
        if (terbuka) {
            const gerak = !window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches;
            const r = kotak.current?.getBoundingClientRect();
            if (r && r.top < 80) {
                kotak.current?.scrollIntoView({
                    block: "start",
                    behavior: gerak ? "smooth" : "auto",
                });
            }
        }
        setTerbuka(!terbuka);
    };

    return (
        <div>
            <div className="relative">
                <div
                    ref={kotak}
                    id={id}
                    style={
                        panjang
                            ? { maxHeight: terbuka ? penuh : tinggi }
                            : undefined
                    }
                    className="scroll-mt-32 overflow-hidden transition-[max-height] duration-300 ease-out motion-reduce:transition-none"
                >
                    <div ref={isi} className={className}>
                        {children}
                    </div>
                </div>

                {terpotong && (
                    <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t ${pudar} to-transparent`}
                    />
                )}
            </div>

            {panjang && (
                <button
                    type="button"
                    onClick={ganti}
                    aria-expanded={terbuka}
                    aria-controls={id}
                    className="mt-3 font-bold text-link hover:underline"
                >
                    {terbuka ? labelTutup : labelBuka}
                </button>
            )}
        </div>
    );
}
