import { useForm } from "@inertiajs/react";
import { FormEvent, useEffect, useState } from "react";

const MAKS_FOTO = 10;
const MAKS_BYTE = 2 * 1024 * 1024;
const BATAS_TOTAL = 7.5 * 1024 * 1024;

const ukuran = (b: number) =>
    b >= 1024 * 1024
        ? `${(b / 1024 / 1024).toFixed(1)} MB`
        : `${Math.round(b / 1024)} KB`;
const idFile = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;

export default function FotoUploader({ url }: { url: string }) {
    const { data, setData, post, processing, errors, reset, progress } =
        useForm<{
            gambar: File[];
            keterangan: string;
        }>({ gambar: [], keterangan: "" });
    const [urls, setUrls] = useState<string[]>([]);

    useEffect(() => {
        const u = data.gambar.map((f) => URL.createObjectURL(f));
        setUrls(u);
        return () => u.forEach((x) => URL.revokeObjectURL(x));
    }, [data.gambar]);

    const tambah = (baru: File[]) => {
        const ada = new Set(data.gambar.map(idFile));
        setData("gambar", [
            ...data.gambar,
            ...baru.filter(
                (f) => f.type.startsWith("image/") && !ada.has(idFile(f)),
            ),
        ]);
    };

    const total = data.gambar.reduce((a, f) => a + f.size, 0);
    const terlaluBanyak = data.gambar.length > MAKS_FOTO;
    const adaBesar = data.gambar.some((f) => f.size > MAKS_BYTE);
    const bisaKirim =
        data.gambar.length > 0 && !terlaluBanyak && !adaBesar && !processing;
    const galat = Object.entries(errors).find(([k]) =>
        k.startsWith("gambar"),
    )?.[1];

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <form
            onSubmit={submit}
            className="space-y-4 rounded-lg border border-slate-200 bg-white p-5"
        >
            <h3 className="font-bold">Tambah foto ke album</h3>

            <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    tambah(Array.from(e.dataTransfer.files));
                }}
                className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-600 hover:bg-slate-50 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand"
            >
                <strong className="text-brand">Klik untuk memilih foto</strong>
                <span>
                    atau seret ke sini (maks. {MAKS_FOTO} foto, 2 MB per foto)
                </span>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => {
                        tambah(Array.from(e.target.files ?? []));
                        e.target.value = "";
                    }}
                />
            </label>
            {galat && <p className="text-sm text-red-700">{galat}</p>}

            {data.gambar.length > 0 && (
                <div>
                    <p className="mb-2 text-sm text-slate-600">
                        {data.gambar.length} foto dipilih, total {ukuran(total)}
                    </p>
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
                        {data.gambar.map((f, i) => {
                            const besar = f.size > MAKS_BYTE;
                            return (
                                <li
                                    key={idFile(f)}
                                    className={`relative rounded-lg border p-1 ${besar ? "border-red-500" : "border-slate-200"}`}
                                >
                                    {urls[i] && (
                                        <img
                                            src={urls[i]}
                                            alt={`Pratinjau ${f.name}`}
                                            className="h-24 w-full rounded object-cover"
                                        />
                                    )}
                                    <p className="mt-1 truncate text-xs text-slate-600">
                                        {f.name}
                                    </p>
                                    <p
                                        className={`text-xs ${besar ? "font-bold text-red-700" : "text-slate-500"}`}
                                    >
                                        {ukuran(f.size)}
                                        {besar && " (terlalu besar)"}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData(
                                                "gambar",
                                                data.gambar.filter(
                                                    (_, n) => n !== i,
                                                ),
                                            )
                                        }
                                        aria-label={`Buang ${f.name}`}
                                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white"
                                    >
                                        &times;
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    {terlaluBanyak && (
                        <p className="mt-2 text-sm text-red-700">
                            Buang {data.gambar.length - MAKS_FOTO} foto agar
                            maksimal {MAKS_FOTO}.
                        </p>
                    )}
                    {adaBesar && (
                        <p className="mt-2 text-sm text-red-700">
                            Ada foto di atas 2 MB. Buang atau kecilkan dulu.
                        </p>
                    )}
                    {!terlaluBanyak && !adaBesar && total > BATAS_TOTAL && (
                        <p className="mt-2 text-sm text-amber-700">
                            Total besar dan bisa melebihi batas server. Kalau
                            gagal, unggah beberapa kali.
                        </p>
                    )}
                </div>
            )}

            <div>
                <label htmlFor="ket-foto" className="font-medium">
                    Keterangan foto (opsional, berlaku untuk semua foto yang
                    diunggah)
                </label>
                <input
                    id="ket-foto"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    value={data.keterangan}
                    onChange={(e) => setData("keterangan", e.target.value)}
                />
            </div>

            {processing && progress && (
                <progress
                    value={progress.percentage ?? 0}
                    max={100}
                    className="h-2 w-full"
                />
            )}

            <button
                type="submit"
                disabled={!bisaKirim}
                className="cursor-pointer rounded-md bg-brand px-5 py-2.5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
                {processing
                    ? "Mengunggah..."
                    : `Unggah${data.gambar.length ? ` ${data.gambar.length} foto` : ""}`}
            </button>
        </form>
    );
}
