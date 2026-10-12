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
        if (!Schema::hasTable('guru')) {
            Schema::create('guru', function (Blueprint $table) {
                $table->id();
                $table->string('nama');
                $table->string('jabatan')->nullable();
                $table->string('foto')->nullable();
                $table->unsignedInteger('urutan')->default(0);
                $table->timestamps();
            });
        }

        // buang tabel "gurus" yang salah dari migration lama
        Schema::dropIfExists('gurus');
    }

    public function down(): void
    {
        Schema::dropIfExists('guru');
    }
};
