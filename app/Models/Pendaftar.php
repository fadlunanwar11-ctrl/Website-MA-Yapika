<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Pendaftar extends Model
{
    protected $table = 'pendaftar';

    protected $fillable = [
        'nomor',
        'nama_lengkap',
        'nisn',
        'jenis_kelamin',
        'tanggal_lahir',
        'asal_sekolah',
        'alamat',
        'nama_wali',
        'no_hp_wali',
        'email',
        'program_id',
        'status',
    ];

    protected $casts = ['tanggal_lahir' => 'date'];
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }
}