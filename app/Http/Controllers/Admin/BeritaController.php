<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BeritaController extends Controller
{
    public function index()
    {
        $berita = Berita::latest()->paginate(15)->through(fn ($b) => [
            'id' => $b->id,
            'judul' => $b->judul,
            'status' => $b->status,
            'terbit_pada' => $b->terbit_pada?->translatedFormat('d F Y'),
        ]);

        return Inertia::render('Admin/Berita/Index', ['berita' => $berita]);
    }

    public function create()
    {
        return Inertia::render('Admin/Berita/Form', ['berita' => null]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['judul']);
        $data['terbit_pada'] = $data['status'] === 'terbit' ? now() : null;

        unset($data['gambar']);
        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('berita', 'public');
        }

        Berita::create($data);

        return redirect('/admin/berita');
    }

    public function edit(Berita $berita)
    {
        return Inertia::render('Admin/Berita/Form', [
            'berita' => $berita->only('id', 'judul', 'ringkasan', 'isi', 'gambar', 'status'),
        ]);
    }

    public function update(Request $request, Berita $berita)
    {
        $data = $this->validated($request);

        // slug sengaja tidak diubah supaya link berita tetap sama
        $data['terbit_pada'] = $data['status'] === 'terbit'
            ? ($berita->terbit_pada ?? now())
            : null;

        unset($data['gambar']);
        if ($request->hasFile('gambar')) {
            if ($berita->gambar) {
                Storage::disk('public')->delete($berita->gambar);
            }
            $data['gambar'] = $request->file('gambar')->store('berita', 'public');
        }

        $berita->update($data);

        return redirect('/admin/berita');
    }

    public function destroy(Berita $berita)
    {
        if ($berita->gambar) {
            Storage::disk('public')->delete($berita->gambar);
        }
        $berita->delete();

        return redirect('/admin/berita');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'ringkasan' => ['nullable', 'string', 'max:300'],
            'isi' => ['required', 'string'],
            'gambar' => ['nullable', 'image', 'max:2048'],
            'status' => ['required', 'in:draft,terbit'],
        ]);
    }

    private function uniqueSlug(string $judul): string
    {
        $base = Str::slug($judul) ?: 'berita';
        $slug = $base;
        $i = 2;
        while (Berita::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}