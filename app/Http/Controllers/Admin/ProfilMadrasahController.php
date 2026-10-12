<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pengaturan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfilMadrasahController extends Controller
{
    private const TEKS = ['visi', 'misi', 'sejarah', 'kurikulum'];

    public function edit()
    {
        $p = Pengaturan::whereIn('key', [...self::TEKS, 'kurikulum_pdf'])->pluck('value', 'key');

        return Inertia::render('Admin/ProfilMadrasah/Edit', [
            'profil' => [
                'visi' => $p['visi'] ?? '',
                'misi' => $p['misi'] ?? '',
                'sejarah' => $p['sejarah'] ?? '',
                'kurikulum' => $p['kurikulum'] ?? '',
                'kurikulum_pdf' => $p['kurikulum_pdf'] ?? null,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'visi' => ['nullable', 'string'],
            'misi' => ['nullable', 'string'],
            'sejarah' => ['nullable', 'string'],
            'kurikulum' => ['nullable', 'string', 'max:10000'],
            'kurikulum_pdf' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'hapus_pdf' => ['nullable', 'boolean'],
        ]);

        foreach (self::TEKS as $key) {
            if (array_key_exists($key, $data)) {
                Pengaturan::updateOrCreate(['key' => $key], ['value' => $data[$key]]);
            }
        }

        $lama = Pengaturan::where('key', 'kurikulum_pdf')->value('value');

        if ($request->hasFile('kurikulum_pdf')) {
            if ($lama) {
                Storage::disk('public')->delete($lama);
            }
            Pengaturan::updateOrCreate(
                ['key' => 'kurikulum_pdf'],
                ['value' => $request->file('kurikulum_pdf')->store('kurikulum', 'public')],
            );
        } elseif ($request->boolean('hapus_pdf') && $lama) {
            Storage::disk('public')->delete($lama);
            Pengaturan::where('key', 'kurikulum_pdf')->delete();
        }

        return back();
    }
}