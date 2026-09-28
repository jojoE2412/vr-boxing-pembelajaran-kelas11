import * as THREE from 'three';
import { getDifficultySettings } from './targetLogic.js';

const SPEED_WINDOW = 0.12;
const HAND_IGNORE_SPEED = 0.55;
const PUNCH_COOLDOWN = 0.20;
const SCORE_INTERVAL_MS = 200;
const HIT_RADIUS = 0.50 * 0.48 + 0.12;

export function detectPunch(controller, hand, delta, game) {
    // TODO (versi siswa): deteksi pukulan dari kecepatan tangan controller.
    // Petunjuk: bandingkan posisi saat ini dengan sampel sebelumnya, lalu panggil checkHit.
}


export function checkHit(controller, game, motion = game.latestMotion, speed = game.latestPunchSpeed, hand = game.latestPunchHand) {
    // TODO (versi siswa): bandingkan lintasan controller dengan target/hitbox.
    // Petunjuk: ukur jarak titik ke segmen, lalu perbarui hit/miss, score, combo, dan audio.
}

function sampleHandMotion(controller, previousPosition, samples, delta) {
    // TODO (versi siswa): simpan posisi controller dan hitung kecepatan.
    // Petunjuk: jarak dibagi delta menghasilkan kecepatan; jendela waktu mengurangi noise.
}

function isTargetedSwing(motion, game) {
    // TODO (versi siswa): bedakan ayunan yang menuju target dari gerakan lain.
    // Petunjuk: gunakan dot product arah ayunan dan arah target.

}

function distancePointToSegment(point, start, end) {
    // TODO (versi siswa): cari jarak minimum titik terhadap garis segmen.
    // Petunjuk: proyeksikan vektor ke segmen dan batasi parameter t ke 0..1.
}

