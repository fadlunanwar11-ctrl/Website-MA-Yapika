<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pengaturan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KontakController extends Controller
{
    private const KEYS = ['alamat', 'telepon', 'whatsapp', 'email', 'jam_layanan', 'peta_embed'];

    public function edit()
    {
        $p = Pengaturan::whereIn('key', self::KEYS)->pluck('value', 'key');

        return Inertia::render('Admin/Kontak/Edit', [
            'kontak' => collect(self::KEYS)->mapWithKeys(fn($k) => [$k => $p[$k] ?? ''])->all(),
        ]);
    }

    public function update(Request $request)
    {
        // bersihkan input sebelum divalidasi
        $wa = preg_replace('/[\s().\-]/', '', (string) $request->input('whatsapp'));
        $request->merge([
            'whatsapp' => $wa !== '' ? $wa : null,
            'peta_embed' => $this->ambilSrc($request->input('peta_embed')),
        ]);

        $data = $request->validate([
            'alamat' => ['nullable', 'string', 'max:500'],
            'telepon' => ['nullable', 'string', 'max:30'],
            'whatsapp' => ['nullable', 'regex:/^(\+62|62|0)8[0-9]{8,12}$/'],
            'email' => ['nullable', 'email', 'max:255'],
            'jam_layanan' => ['nullable', 'string', 'max:255'],
            'peta_embed' => ['nullable', 'url', 'max:2000', 'regex:#^https://(www\.google\.com/maps/embed\?|maps\.google\.com/maps\?.*output=embed)#'],
        ], [
            'whatsapp.regex' => 'Nomor WhatsApp tidak valid (contoh: 081234567890).',
            'peta_embed.regex' => 'Tempel kode embed dari Google Maps (diawali https://www.google.com/maps/embed).',
            'peta_embed.url' => 'Alamat peta tidak valid.',
        ]);

        foreach ($data as $key => $value) {
            Pengaturan::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return back();
    }

    // ambil isi src="..." kalau yang ditempel seluruh kode <iframe>
    private function ambilSrc(?string $v): ?string
    {
        $v = trim((string) $v);
        if ($v === '') {
            return null;
        }
        if (preg_match('/src="([^"]+)"/i', $v, $m)) {
            return html_entity_decode($m[1]);
        }

        return $v;
    }
}