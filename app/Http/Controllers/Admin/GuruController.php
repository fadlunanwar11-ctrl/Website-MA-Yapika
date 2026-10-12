<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GuruController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Guru/Index', [
            'guru' => Guru::orderBy('urutan')->orderBy('nama')->get(['id', 'nama', 'jabatan', 'foto', 'urutan']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Guru/Form', ['guru' => null]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        unset($data['foto']);
        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('guru', 'public');
        }

        Guru::create($data);

        return redirect('/admin/guru');
    }

    public function edit(Guru $guru)
    {
        return Inertia::render('Admin/Guru/Form', [
            'guru' => $guru->only('id', 'nama', 'jabatan', 'foto', 'urutan'),
        ]);
    }

    public function update(Request $request, Guru $guru)
    {
        $data = $this->validated($request);

        unset($data['foto']);
        if ($request->hasFile('foto')) {
            if ($guru->foto) {
                Storage::disk('public')->delete($guru->foto);
            }
            $data['foto'] = $request->file('foto')->store('guru', 'public');
        }

        $guru->update($data);

        return redirect('/admin/guru');
    }

    public function destroy(Guru $guru)
    {
        if ($guru->foto) {
            Storage::disk('public')->delete($guru->foto);
        }
        $guru->delete();

        return redirect('/admin/guru');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'jabatan' => ['nullable', 'string', 'max:255'],
            'urutan' => ['nullable', 'integer', 'min:0'],
            'foto' => ['nullable', 'image', 'max:2048'],
        ]);
        $data['urutan'] = $data['urutan'] ?? 0;

        return $data;
    }
}