<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Galeri extends Model
{
    protected $table = 'galeri';

    protected $fillable = ['album_id', 'gambar', 'keterangan'];

    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }
}