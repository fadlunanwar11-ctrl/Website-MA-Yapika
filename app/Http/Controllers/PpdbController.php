<?php

namespace App\Http\Controllers;

use App\Models\Pendaftar;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PpdbController extends Controller
{
    public function create()
    {
        return Inertia::render('PPDB', [
            'program' => Program::orderBy('urutan')->orderBy('nama')->get(['id', 'nama']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'nisn' => ['required', 'digits:10'],
            'jenis_kelamin' => ['required', 'in:L,P'],
            'tanggal_lahir' => ['required', 'date', 'before:today'],
            'asal_sekolah' => ['required', 'string', 'max:255'],
            'alamat' => ['required', 'string', 'max:500'],
            'nama_wali' => ['required', 'string', 'max:255'],
            'no_hp_wali' => ['required', 'regex:/^(\+62|62|0)8[0-9]{8,12}$/'],
            'email' => ['nullable', 'email', 'max:255'],
            'program_id' => ['nullable', 'exists:program,id'],
        ], [
            'required' => ':attribute wajib diisi.',
            'digits' => ':attribute harus :digits digit angka.',
            'email' => 'Format email tidak valid.',
            'date' => 'Tanggal tidak valid.',
            'before' => 'Tanggal lahir tidak valid.',
            'regex' => ':attribute tidak valid (contoh: 081234567890).',
            'max' => ':attribute terlalu panjang.',
            'in' => ':attribute tidak valid.',
            'exists' => 'Program yang dipilih tidak tersedia.',
        ], [
            'nama_lengkap' => 'Nama lengkap',
            'nisn' => 'NISN',
            'jenis_kelamin' => 'Jenis kelamin',
            'tanggal_lahir' => 'Tanggal lahir',
            'asal_sekolah' => 'Asal sekolah',
            'alamat' => 'Alamat',
            'nama_wali' => 'Nama orang tua/wali',
            'no_hp_wali' => 'Nomor HP',
        ]);

        $pendaftar = Pendaftar::create($data);
        $pendaftar->update([
            'nomor' => sprintf('PPDB-%s-%04d', now()->format('Y'), $pendaftar->id),
        ]);

        return redirect('/ppdb/selesai/' . $pendaftar->nomor);
    }

    public function selesai(string $nomor)
    {
        abort_unless(preg_match('/^PPDB-\d{4}-\d{4}$/', $nomor), 404);

        return Inertia::render('PPDBSelesai', ['nomor' => $nomor]);
    }

    public function cekForm()
    {
        return Inertia::render('PPDBCek', ['hasil' => null]);
    }

    public function cek(Request $request)
    {
        $data = $request->validate([
            'nomor' => ['required', 'string', 'max:30'],
            'nisn' => ['required', 'digits:10'],
        ], [
            'required' => ':attribute wajib diisi.',
            'digits' => ':attribute harus 10 digit angka.',
        ], [
            'nomor' => 'Nomor pendaftaran',
            'nisn' => 'NISN',
        ]);

        $p = Pendaftar::where('nomor', strtoupper(trim($data['nomor'])))
            ->where('nisn', $data['nisn'])
            ->first();

        return Inertia::render('PPDBCek', [
            'hasil' => $p ? ['nomor' => $p->nomor, 'nama' => $p->nama_lengkap, 'status' => $p->status] : false,
        ]);
    }   
    
}