<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Inertia\Inertia;

class BeritaController extends Controller
{
    public function index()
    {
        $berita = Berita::terbit()
            ->latest('terbit_pada')
            ->paginate(9)
            ->through(fn($b) => [
                'judul' => $b->judul,
                'slug' => $b->slug,
                'ringkasan' => $b->ringkasan,
                'gambar' => $b->gambar,
                'terbit_pada' => $b->terbit_pada->translatedFormat('d F Y'),
            ]);

        return Inertia::render('Berita/Index', ['berita' => $berita]);
    }

    public function show(string $slug)
    {
        $b = Berita::terbit()->where('slug', $slug)->firstOrFail();

        return Inertia::render('Berita/Show', [
            'berita' => [
                'judul' => $b->judul,
                'isi' => $b->isi,
                'gambar' => $b->gambar,
                'terbit_pada' => $b->terbit_pada->translatedFormat('d F Y'),
            ],
        ]);
    }
}