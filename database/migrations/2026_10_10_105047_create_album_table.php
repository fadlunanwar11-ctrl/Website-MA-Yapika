<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('album')) {
            Schema::create('album', function (Blueprint $table) {
                $table->id();
                $table->string('judul');
                $table->string('slug')->unique();
                $table->date('tanggal');
                $table->string('kategori')->nullable();
                $table->text('deskripsi')->nullable();
                $table->string('status')->default('draft');
                $table->timestamps();
            });
        }

        if (!Schema::hasColumn('galeri', 'album_id')) {
            Schema::table('galeri', function (Blueprint $table) {
                $table->foreignId('album_id')->nullable()->constrained('album')->cascadeOnDelete();
            });
        }

        // foto lama dimasukkan ke satu album bawaan
        if (DB::table('galeri')->whereNull('album_id')->exists()) {
            $id = DB::table('album')->insertGetId([
                'judul' => 'Dokumentasi Umum',
                'slug' => 'dokumentasi-umum',
                'tanggal' => now()->toDateString(),
                'status' => 'terbit',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            DB::table('galeri')->whereNull('album_id')->update(['album_id' => $id]);
        }
    }

    public function down(): void
    {
        Schema::table('galeri', function (Blueprint $table) {
            $table->dropConstrainedForeignId('album_id');
        });
        Schema::dropIfExists('album');
    }
};
