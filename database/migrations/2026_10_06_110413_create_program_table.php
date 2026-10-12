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
        if (!Schema::hasTable('program')) {
            Schema::create('program', function (Blueprint $table) {
                $table->id();
                $table->string('nama');
                $table->text('deskripsi')->nullable();
                $table->text('poin')->nullable();
                $table->string('gambar')->nullable();
                $table->unsignedInteger('urutan')->default(0);
                $table->timestamps();
            });
        }

    }

    public function down(): void
    {
        Schema::dropIfExists('program');
    }
};
