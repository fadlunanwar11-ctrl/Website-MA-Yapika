<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $table = 'program';

    protected $fillable = ['nama', 'kategori', 'deskripsi', 'poin', 'gambar', 'urutan'];
}
