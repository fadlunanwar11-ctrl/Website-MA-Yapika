import { Link } from "@inertiajs/react";
import { CSSProperties } from "react";
import { useState } from "react";

export type MarqueeItem = {
    nama: string;
    deskripsi?: string | null; // Tambahkan '?' agar opsional / bisa undefined
    gambar?: string | null;
};

export default function MarqueeCards({
    items,
    durasi = 60,
    reverse,
}: {
    items: MarqueeItem[];
    durasi?: number;
    reverse: boolean;
    // Tambahkan '?' agar opsional / bisa undefined
}) {
    const [paused, setPaused] = useState(false);
    if (items.length === 0) return null;

    const set = Array.from({ length: Math.ceil(6 / items.length) }).flatMap(
        () => items,
    );

    return (
        <div className="marquee py-4">
            <div
                className="marquee-track"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                style={
                    {
                        "--durasi": `${durasi}s`,
                        "--arah": reverse ? "reverse" : "normal",
                        animationPlayState: paused ? "paused" : "running",
                    } as CSSProperties
                }
            >
                {[0, 1].map((salinan) =>
                    set.map((p, i) => (
                        <Link
                            key={`${salinan}-${i}`}
                            href="/program"
                            tabIndex={salinan === 1 ? -1 : undefined}
                            aria-hidden={salinan === 1}
                            className=" kartu mr-4 flex w-72 flex-none flex-col gap-2 p-4 shadow-2xl hover:zoom-out-20 "
                        >
                            <strong>{p.nama}</strong>
                            {p.deskripsi && (
                                <span className="line-clamp-3 text-sm text-muted-foreground">
                                    {p.deskripsi}
                                </span>
                            )}
                        </Link>
                    )),
                )}
            </div>
        </div>
    );
}
