<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Inertia\Inertia;

class ProgramController extends Controller
{
    public function index()
    {
        return Inertia::render('Program', [
            'program' => Program::orderBy('urutan')->orderBy('nama')
                ->get(['nama','kategori', 'deskripsi', 'poin', 'gambar']),
        ]);
    }
}