export function getDifficultySettings(game) {
// TODO (versi siswa): pindahkan konfigurasi difficulty ke tabel agar mudah dibaca.
// Petunjuk: EASY, NORMAL, HARD mengatur kecepatan pukulan dan orbit target.
}

export function moveTarget(delta, game) {
    // TODO (versi siswa): gerakkan target mengelilingi pemain dengan delta time.
    // Petunjuk: ubah sudut berdasarkan speed dan arah; gunakan sin/cos untuk X/Z.
}

function damp(current, target, smoothing, delta) {
    // TODO (versi siswa): haluskan perubahan nilai tanpa bergantung pada FPS.
    // Petunjuk: faktor peredam dapat dihitung dengan eksponen dan delta time.
}

function randomBetween(min, max) {
    // TODO (versi siswa): ambil angka acak dalam rentang yang diberikan.
    // Petunjuk: min + Math.random() dikali selisih max dan min.
}
