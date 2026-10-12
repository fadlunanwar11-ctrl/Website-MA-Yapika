<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Berita extends Model
{
    protected $table = 'berita'; // tanpa ini Laravel mencari tabel "beritas"

    protected $fillable = ['judul', 'slug', 'ringkasan', 'isi', 'gambar', 'status', 'terbit_pada'];

    protected $casts = ['terbit_pada' => 'datetime'];

    public function scopeTerbit($query)
    {
        return $query->where('status', 'terbit')->where('terbit_pada', '<=', now());
    }
}