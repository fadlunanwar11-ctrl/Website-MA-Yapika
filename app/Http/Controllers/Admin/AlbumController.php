<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Galeri;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AlbumController extends Controller
{
    public function index()
    {
        $album = Album::withCount('foto')->orderByDesc('tanggal')->orderByDesc('id')->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'judul' => $a->judul,
                'tanggal' => $a->tanggal->translatedFormat('d M Y'),
                'kategori' => Album::KATEGORI[$a->kategori] ?? null,
                'status' => $a->status,
                'foto_count' => $a->foto_count,
            ]);

        return Inertia::render('Admin/Album/Index', ['album' => $album]);
    }

    public function create()
    {
        return Inertia::render('Admin/Album/Form', [
            'album' => null,
            'foto' => [],
            'kategori' => Album::KATEGORI,
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['judul']);
        $album = Album::create($data);

        return redirect("/admin/album/{$album->id}/edit");
    }

    public function edit(Album $album)
    {
        return Inertia::render('Admin/Album/Form', [
            'album' => [
                'id' => $album->id,
                'judul' => $album->judul,
                'slug' => $album->slug,
                'tanggal' => $album->tanggal->format('Y-m-d'),
                'kategori' => $album->kategori,
                'deskripsi' => $album->deskripsi,
                'status' => $album->status,
            ],
            'foto' => $album->foto()->orderBy('id')->get(['id', 'gambar', 'keterangan']),
            'kategori' => Album::KATEGORI,
        ]);
    }

    public function update(Request $request, Album $album)
    {
        $album->update($this->validated($request)); // slug tetap supaya tautan lama tidak mati

        return back();
    }

    public function destroy(Album $album)
    {
        foreach ($album->foto as $f) {
            Storage::disk('public')->delete($f->gambar);
        }
        $album->delete();

        return redirect('/admin/album');
    }

    public function tambahFoto(Request $request, Album $album)
    {
        $request->validate([
            'gambar' => ['required', 'array', 'max:10'],
            'gambar.*' => ['image', 'max:2048'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ]);

        foreach ($request->file('gambar') as $file) {
            $album->foto()->create([
                'gambar' => $file->store('galeri', 'public'),
                'keterangan' => $request->input('keterangan'),
            ]);
        }

        return back();
    }

    public function hapusFoto(Galeri $galeri)
    {
        Storage::disk('public')->delete($galeri->gambar);
        $galeri->delete();

        return back();
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'tanggal' => ['required', 'date'],
            'kategori' => ['nullable', 'in:'.implode(',', array_keys(Album::KATEGORI))],
            'deskripsi' => ['nullable', 'string', 'max:2000'],
            'status' => ['required', 'in:draft,terbit'],
        ]);
    }

    private function uniqueSlug(string $judul): string
    {
        $base = Str::slug($judul) ?: 'album';
        $slug = $base;
        $i = 2;
        while (Album::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}