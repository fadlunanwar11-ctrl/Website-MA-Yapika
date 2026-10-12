<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pendaftar', function (Blueprint $table) {
            $table->id();
            $table->string('nomor')->nullable()->unique();
            $table->string('nama_lengkap');
            $table->string('nisn', 10);
            $table->string('jenis_kelamin', 1);
            $table->date('tanggal_lahir');
            $table->string('asal_sekolah');
            $table->text('alamat');
            $table->string('nama_wali');
            $table->string('no_hp_wali', 20);
            $table->string('email')->nullable();
            $table->foreignId('program_id')->nullable()->constrained('program')->nullOnDelete();
            $table->string('status')->default('baru');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftar');
    }
};
