import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { FormEvent } from "react";

type Kontak = {
    alamat: string;
    telepon: string;
    whatsapp: string;
    email: string;
    jam_layanan: string;
    peta_embed: string;
};

const input = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2";

const kolom: [keyof Kontak, string, string][] = [
    ["alamat", "Alamat", "Alamat lengkap madrasah"],
    ["telepon", "Telepon", "(0274) 123456"],
    ["whatsapp", "WhatsApp", "081234567890"],
    ["email", "Email", "info@contoh.sch.id"],
    ["jam_layanan", "Jam layanan", "Senin sampai Jumat, 07.00 sampai 14.00"],
];

export default function Edit({ kontak }: { kontak: Kontak }) {
    const { data, setData, put, processing, errors, recentlySuccessful } =
        useForm<Kontak>(kontak);
    const submit = (e: FormEvent) => {
        e.preventDefault();
        put("/admin/kontak");
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Edit Kontak</h2>}
        >
            <Head title="Edit Kontak" />
            <form
                onSubmit={submit}
                className="mx-auto max-w-2xl space-y-5 px-4 py-8"
            >
                {kolom.map(([key, label, contoh]) => (
                    <div key={key}>
                        <label htmlFor={key} className="font-medium">
                            {label}
                        </label>
                        <input
                            id={key}
                            className={input}
                            placeholder={contoh}
                            value={data[key]}
                            onChange={(e) => setData(key, e.target.value)}
                        />
                        {errors[key] && (
                            <p className="mt-1 text-sm text-accent">
                                {errors[key]}
                            </p>
                        )}
                    </div>
                ))}

                <div>
                    <label htmlFor="peta_embed" className="font-medium">
                        Alamat peta (embed Google Maps)
                    </label>
                    <p className="text-sm text-slate-500">
                        Di Google Maps: cari lokasi, klik Bagikan, tab Sematkan
                        peta, salin kodenya. Tempel hanya isi
                        <code> src="..." </code>
                        yang diawali https://www.google.com/maps/embed
                    </p>
                    <textarea
                        id="peta_embed"
                        rows={3}
                        className={input}
                        value={data.peta_embed}
                        onChange={(e) => setData("peta_embed", e.target.value)}
                    />
                    {errors.peta_embed && (
                        <p className="mt-1 text-sm text-accent">
                            {errors.peta_embed}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-md bg-brand px-5 py-2.5 font-bold text-white disabled:opacity-50"
                    >
                        Simpan
                    </button>
                    {recentlySuccessful && (
                        <span className="text-sm text-green-700">
                            Tersimpan.
                        </span>
                    )}
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
