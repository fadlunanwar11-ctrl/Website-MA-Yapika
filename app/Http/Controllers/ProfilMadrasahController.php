<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\Pengaturan;
use Inertia\Inertia;

class ProfilMadrasahController extends Controller
{
    public function show()
    {
        $p = Pengaturan::whereIn('key', ['visi', 'misi', 'sejarah', 'kurikulum', 'kurikulum_pdf'])
            ->pluck('value', 'key');

        return Inertia::render('Profil', [
            'visi' => $p['visi'] ?? '',
            'misi' => $p['misi'] ?? '',
            'sejarah' => $p['sejarah'] ?? '',
            'kurikulum' => $p['kurikulum'] ?? '',
            'kurikulum_pdf' => $p['kurikulum_pdf'] ?? null,
            'guru' => Guru::orderBy('urutan')->orderBy('nama')->get(['nama', 'jabatan', 'foto']),
        ]);
    }
}