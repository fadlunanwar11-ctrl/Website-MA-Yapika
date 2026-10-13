<?php

use App\Http\Controllers\Admin\BeritaController as AdminBeritaController;
use App\Http\Controllers\Admin\ProfilMadrasahController as AdminProfilMadrasahController;
use App\Http\Controllers\Admin\GuruController as AdminGuruController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\Admin\ProgramController as AdminProgramController;
use App\Http\Controllers\GaleriController;
use App\Http\Controllers\Admin\GaleriController as AdminGaleriController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\Admin\PendaftarController as AdminPendaftarController;
use App\Http\Controllers\Admin\KontakController as AdminKontakController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfilMadrasahController;
use App\Http\Controllers\Admin\AlbumController as AdminAlbumController;
use App\Models\Berita;
use App\Models\Program;
use App\Models\Galeri;
use App\Http\Controllers\PpdbController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Pendaftar;

Route::get('/', function () {
    $berita = Berita::terbit()->latest('terbit_pada')->take(3)->get()->map(fn($b) => [
        'judul' => $b->judul,
        'slug' => $b->slug,
        'ringkasan' => $b->ringkasan,
        'gambar' => $b->gambar,
        'terbit_pada' => $b->terbit_pada->translatedFormat('d F Y'),
    ]);

    $programs = Program::orderBy('urutan')->orderBy('nama')
        ->get(['nama', 'kategori', 'deskripsi', 'gambar', 'poin']);
    $galeri = Galeri::whereHas('album', fn($q) => $q->terbit())->latest()->take(12)->get(['gambar', 'keterangan']);
    $unggulan = $programs->pluck('poin')
        ->flatMap(fn($p) => preg_split('/\R/', (string) $p))
        ->map(fn($x) => trim($x))
        ->filter()
        ->unique()
        ->values()
        ->take(16);

    return Inertia::render('Home', [
        'berita' => $berita,
        'program' => $programs->map(fn ($program) => $program->only([
            'nama',
            'kategori',
            'deskripsi',
            'gambar',
        ])),
        'galeri' => $galeri,
        'unggulan' => $unggulan,
    ]);
});

Route::get('/ppdb/cek', [PpdbController::class, 'cekForm']);
Route::post('/ppdb/cek', [PpdbController::class, 'cek'])->middleware('throttle:10,1');
Route::get('/ppdb', [PpdbController::class, 'create']);
Route::post('/ppdb', [PpdbController::class, 'store'])->middleware('throttle:10,1');
Route::get('/ppdb/selesai/{nomor}', [PpdbController::class, 'selesai']);
Route::get('/kontak', fn() => Inertia::render('Kontak'));
Route::get('/galeri', [GaleriController::class, 'index']);
Route::get('/galeri/{slug}', [GaleriController::class, 'show']);
Route::get('/program', [ProgramController::class, 'index']);
Route::get('/profil', [ProfilMadrasahController::class, 'show']);
Route::get('/berita', [BeritaController::class, 'index']);
Route::get('/berita/{slug}', [BeritaController::class, 'show']);

Route::middleware('auth')->prefix('admin')->group(function () {
    Route::resource('berita', AdminBeritaController::class)
        ->except('show')
        ->parameters(['berita' => 'berita']);
    Route::get('profil', [AdminProfilMadrasahController::class, 'edit']);
    Route::put('profil', [AdminProfilMadrasahController::class, 'update']);
    Route::resource('guru', AdminGuruController::class)->except('show');
    Route::resource('program', AdminProgramController::class)->except('show');
    Route::resource('album', AdminAlbumController::class)->except('show');
    Route::post('album/{album}/foto', [AdminAlbumController::class, 'tambahFoto']);
    Route::delete('foto/{galeri}', [AdminAlbumController::class, 'hapusFoto']);
    Route::get('pendaftar/export', [AdminPendaftarController::class, 'export']);
    Route::resource('pendaftar', AdminPendaftarController::class)->only(['index', 'show', 'update', 'destroy']);
    Route::get('kontak', [AdminKontakController::class, 'edit']);
    Route::put('kontak', [AdminKontakController::class, 'update']);
});

Route::get('/dashboard', function () {
    $perStatus = Pendaftar::selectRaw('status, count(*) as total')
        ->groupBy('status')->pluck('total', 'status');

    $perHari = Pendaftar::where('created_at', '>=', now()->subDays(6)->startOfDay())
        ->selectRaw('DATE(created_at) as tgl, count(*) as total')
        ->groupBy('tgl')->pluck('total', 'tgl');

    $harian = collect(range(6, 0))->map(fn ($i) => [
        'label' => now()->subDays($i)->translatedFormat('D j'),
        'total' => (int) ($perHari[now()->subDays($i)->toDateString()] ?? 0),
    ])->values();

    return Inertia::render('Dashboard', [
        'berita' => [
            'total' => Berita::count(),
            'terbit' => Berita::where('status', 'terbit')->count(),
            'draft' => Berita::where('status', 'draft')->count(),
        ],
        'ppdb' => [
            'total' => Pendaftar::count(),
            'per_status' => $perStatus,
            'hari_ini' => Pendaftar::whereDate('created_at', today())->count(),
            'harian' => $harian,
            'terbaru' => Pendaftar::with('program:id,nama')->latest()->take(5)->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'nomor' => $p->nomor,
                    'nama_lengkap' => $p->nama_lengkap,
                    'program' => $p->program?->nama,
                    'status' => $p->status,
                    'dibuat' => $p->created_at->translatedFormat('d M Y, H:i'),
                ]),
        ],
    ]);
})->middleware('auth')->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/sitemap.xml', function () {
    $halaman = ['/', '/profil', '/program', '/berita', '/galeri', '/ppdb', '/kontak'];
    $berita = Berita::terbit()->latest('terbit_pada')->get(['slug', 'updated_at']);

    $xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    foreach ($halaman as $h) {
        $xml .= '<url><loc>' . e(url($h)) . '</loc></url>';
    }
    foreach ($berita as $b) {
        $xml .= '<url><loc>' . e(url('/berita/' . $b->slug)) . '</loc><lastmod>' . $b->updated_at->toAtomString() . '</lastmod></url>';
    }

    return response($xml . '</urlset>', 200, ['Content-Type' => 'application/xml']);
});
require __DIR__ . '/auth.php';
