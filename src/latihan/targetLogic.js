// TODO (versi siswa): pindahkan konfigurasi difficulty ke tabel agar mudah dibaca.
// Petunjuk: EASY, NORMAL, HARD mengatur kecepatan pukulan dan orbit target.
export function getDifficultySettings(game) {
    const presets = {
        EASY: { minPunchSpeed: 0.85, perfectSpeed: 1.70, orbitMin: 0.90, orbitMax: 1.25, directionChangeMin: 1.5, directionChangeMax: 2.8 },
        NORMAL: { minPunchSpeed: 1.20, perfectSpeed: 2.30, orbitMin: 1.30, orbitMax: 1.75, directionChangeMin: 1.0, directionChangeMax: 2.0 },
        HARD: { minPunchSpeed: 1.65, perfectSpeed: 2.80, orbitMin: 1.75, orbitMax: 2.45, directionChangeMin: 0.70, directionChangeMax: 1.45 }
    };
    return presets[game.difficulty] || presets.NORMAL;
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
