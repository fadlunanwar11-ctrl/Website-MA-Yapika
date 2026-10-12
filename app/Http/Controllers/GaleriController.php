<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Galeri;
use Inertia\Inertia;

class GaleriController extends Controller
{
    public function index()
    {
        $album = Album::terbit()
            ->withCount('foto')
            ->addSelect(['sampul' => Galeri::select('gambar')
                ->whereColumn('album_id', 'album.id')->orderBy('id')->limit(1)])
            ->orderByDesc('tanggal')->orderByDesc('id')
            ->get()
            ->map(fn ($a) => [
                'judul' => $a->judul,
                'slug' => $a->slug,
                'tahun' => $a->tanggal->format('Y'),
                'tanggal' => $a->tanggal->translatedFormat('d F Y'),
                'kategori' => Album::KATEGORI[$a->kategori] ?? null,
                'sampul' => $a->sampul,
                'foto_count' => $a->foto_count,
            ])
            ->values();

        return Inertia::render('Galeri/Index', ['album' => $album]);
    }

    public function show(string $slug)
    {
        $a = Album::terbit()->where('slug', $slug)->firstOrFail();

        return Inertia::render('Galeri/Show', [
            'album' => [
                'judul' => $a->judul,
                'tanggal' => $a->tanggal->translatedFormat('d F Y'),
                'kategori' => Album::KATEGORI[$a->kategori] ?? null,
                'deskripsi' => $a->deskripsi,
            ],
            'foto' => $a->foto()->orderBy('id')->get(['gambar', 'keterangan']),
        ]);
    }
}