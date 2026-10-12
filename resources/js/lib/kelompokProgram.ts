export type KelompokProgram = { kunci: string; judul: string; ket: string; besar: boolean };

export const KELOMPOK_PROGRAM: KelompokProgram[] = [
    { kunci: "unggulan", judul: "Kelas Unggulan", ket: "Program kelas dan keunggulan akademik madrasah.", besar: true },
    { kunci: "ekstrakurikuler", judul: "Ekstrakurikuler", ket: "Kegiatan pengembangan minat dan bakat siswa di luar jam pelajaran.", besar: false },
    { kunci: "organisasi", judul: "Organisasi", ket: "Wadah siswa belajar berorganisasi dan kepemimpinan.", besar: false },
];