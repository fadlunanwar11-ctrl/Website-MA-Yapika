<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pendaftar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PendaftarController extends Controller
{
    private const STATUS = ['baru', 'diverifikasi', 'diterima', 'ditolak'];

    public function index(Request $request)
    {
        $status = (string) $request->query('status', '');
        $cari = trim((string) $request->query('q', ''));

        $pendaftar = Pendaftar::with('program:id,nama')
            ->when($status, fn($q) => $q->where('status', $status))
            ->when($cari, fn($q) => $q->where(fn($w) => $w
                ->where('nama_lengkap', 'ilike', "%{$cari}%")
                ->orWhere('nomor', 'ilike', "%{$cari}%")
                ->orWhere('nisn', 'like', "%{$cari}%")))
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn($p) => [
                'id' => $p->id,
                'nomor' => $p->nomor,
                'nama_lengkap' => $p->nama_lengkap,
                'asal_sekolah' => $p->asal_sekolah,
                'program' => $p->program?->nama,
                'status' => $p->status,
                'dibuat' => $p->created_at->translatedFormat('d M Y'),
            ]);

        return Inertia::render('Admin/Pendaftar/Index', [
            'pendaftar' => $pendaftar,
            'filter' => ['q' => $cari, 'status' => $status],
            'hitung' => Pendaftar::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
        ]);
    }

    public function show(Pendaftar $pendaftar)
    {
        return Inertia::render('Admin/Pendaftar/Show', [
            'pendaftar' => [
                'id' => $pendaftar->id,
                'nomor' => $pendaftar->nomor,
                'nama_lengkap' => $pendaftar->nama_lengkap,
                'nisn' => $pendaftar->nisn,
                'jenis_kelamin' => $pendaftar->jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
                'tanggal_lahir' => $pendaftar->tanggal_lahir->translatedFormat('d F Y'),
                'asal_sekolah' => $pendaftar->asal_sekolah,
                'alamat' => $pendaftar->alamat,
                'nama_wali' => $pendaftar->nama_wali,
                'no_hp_wali' => $pendaftar->no_hp_wali,
                'email' => $pendaftar->email,
                'program' => $pendaftar->program?->nama,
                'status' => $pendaftar->status,
                'dibuat' => $pendaftar->created_at->translatedFormat('d F Y, H:i'),
            ],
        ]);
    }

    public function update(Request $request, Pendaftar $pendaftar)
    {
        $data = $request->validate([
            'status' => ['required', 'in:' . implode(',', self::STATUS)],
        ]);

        $pendaftar->update($data);

        return back();
    }

    public function destroy(Pendaftar $pendaftar)
    {
        $pendaftar->delete();

        return redirect('/admin/pendaftar');
    }

    public function export(Request $request)
    {
        $status = (string) $request->query('status', '');

        // cegah rumus berbahaya saat CSV dibuka di Excel
        $aman = function ($v) {
            $v = (string) $v;

            return preg_match('/^[=+\-@\t\r]/', $v) ? "'" . $v : $v;
        };

        return response()->streamDownload(function () use ($status, $aman) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF"); // BOM supaya Excel membaca UTF-8
            fputcsv($out, [
                'Nomor',
                'Nama lengkap',
                'NISN',
                'Jenis kelamin',
                'Tanggal lahir',
                'Asal sekolah',
                'Alamat',
                'Nama wali',
                'No HP wali',
                'Email',
                'Program',
                'Status',
                'Tanggal daftar',
            ]);

            Pendaftar::with('program:id,nama')
                ->when($status, fn($q) => $q->where('status', $status))
                ->orderBy('id')
                ->chunk(200, function ($rows) use ($out, $aman) {
                    foreach ($rows as $p) {
                        fputcsv($out, array_map($aman, [
                            $p->nomor,
                            $p->nama_lengkap,
                            $p->nisn,
                            $p->jenis_kelamin,
                            $p->tanggal_lahir->format('Y-m-d'),
                            $p->asal_sekolah,
                            $p->alamat,
                            $p->nama_wali,
                            $p->no_hp_wali,
                            $p->email,
                            $p->program?->nama,
                            $p->status,
                            $p->created_at->format('Y-m-d H:i'),
                        ]));
                    }
                });

            fclose($out);
        }, 'pendaftar-ppdb-' . now()->format('Ymd') . '.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }
}