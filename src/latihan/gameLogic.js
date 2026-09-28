import { GAME_STATES } from './gameState.js';
import { getDifficultySettings, moveTarget } from './targetLogic.js';

export function startGame(game) {
    // TODO (versi siswa): reset score, timer, combo, dan state ronde.
    // Petunjuk: solusi referensi ada di bawah; state awal ronde adalah COUNTDOWN.
}

export function updateCountdown(delta, game) {
    // TODO (versi siswa): selesaikan hitung mundur lalu ubah state ke PLAYING.
    // Petunjuk: countdownStepTimer berkurang dengan delta; tampilkan 3, 2, 1, GO.
}

export function gameOver(game) {
    // TODO (versi siswa): akhiri ronde satu kali dan tampilkan hasil akhir.
    // Petunjuk: ubah state, sembunyikan HUD/dummy, lalu panggil game.showGameOver(score).
}

