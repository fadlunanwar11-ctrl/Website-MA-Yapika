<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProgramController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Program/Index', [
            'program' => Program::orderBy('urutan')->orderBy('nama')->get(['id', 'nama', 'kategori','gambar', 'urutan']),
            
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Program/Form', ['program' => null]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        unset($data['gambar']);
        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('program', 'public');
        }

        Program::create($data);

        return redirect('/admin/program');
    }

    public function edit(Program $program)
    {
        return Inertia::render('Admin/Program/Form', [
            'program' => $program->only('id', 'nama','kategori', 'deskripsi', 'poin', 'gambar', 'urutan'),
            
        ]);
    }
    public function update(Request $request, Program $program)
    {
        $data = $this->validated($request);

        unset($data['gambar']);
        if ($request->hasFile('gambar')) {
            if ($program->gambar) {
                Storage::disk('public')->delete($program->gambar);
            }
            $data['gambar'] = $request->file('gambar')->store('program', 'public');
        }

        $program->update($data);

        return redirect('/admin/program');
    }

    public function destroy(Program $program)
    {
        if ($program->gambar) {
            Storage::disk('public')->delete($program->gambar);
        }
        $program->delete();

        return redirect('/admin/program');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'kategori' => ['required', 'in:unggulan,ekstrakurikuler,organisasi'],
            'deskripsi' => ['nullable', 'string'],
            'poin' => ['nullable', 'string'],
            'urutan' => ['nullable', 'integer', 'min:0'],
            'gambar' => ['nullable', 'image', 'max:2048'],
        ]);
        $data['urutan'] = $data['urutan'] ?? 0;

        return $data;
    }
}