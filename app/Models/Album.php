<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Album extends Model
{
    protected $table = 'album';

    public const KATEGORI = [
        'akademik' => 'Akademik',
        'keagamaan' => 'Keagamaan',
        'olahraga-seni' => 'Olahraga dan Seni',
        'organisasi' => 'Organisasi',
        'umum' => 'Kegiatan Umum',
    ];

    protected $fillable = ['judul', 'slug', 'tanggal', 'kategori', 'deskripsi', 'status'];

    protected $casts = ['tanggal' => 'date'];

    public function foto(): HasMany
    {
        return $this->hasMany(Galeri::class);
    }

    public function scopeTerbit($query)
    {
        return $query->where('status', 'terbit');
    }
}