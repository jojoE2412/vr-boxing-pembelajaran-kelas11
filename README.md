# VR Boxing — Praktikum Logika & Pemrograman Game Kelas 11

Project pembelajaran menggunakan Three.js, WebXR, Vite, dan JavaScript. Arena, model, controller, UI dasar, HUD, audio, dan hitbox disiapkan sebagai fondasi. Siswa mengerjakan logika permainan di `src/latihan/`.

## Struktur

- `src/main.js`: entry point dan penghubung sistem.
- `src/starter/`: sistem yang disiapkan guru; siswa sebaiknya tidak mengubahnya.
- `src/latihan/`: kerangka logika permainan yang dapat diedit siswa.
- `src/assets/models/`: arena gym, ring, training dummy, dan glove.
- `src/assets/audio/`: efek HIT, PERFECT, dan MISS.

### Bagian yang boleh diedit siswa

`src/latihan/` adalah ruang kerja siswa. Fungsi-fungsi gameplay sengaja berupa TODO.

### Bagian yang disiapkan guru

Jangan mengubah `src/starter/` atau `src/assets/` untuk latihan logika dasar. `src/main.js` hanya menghubungkan sistem.

## Modul starter

- `scene.js`: scene, camera, renderer, lighting, lantai, grid, dan resize.
- `assets.js`: memuat model gym, ring, dummy, serta glove.
- `assetPositions.js`: transform model; angka skala, posisi, dan rotasi dipertahankan dari project.
- `xr.js`: konfigurasi dan pengelolaan sesi WebXR.
- `controllers.js`: referensi controller dan visual fist.
- `hitbox.js`: pembuatan dan pembaruan hitbox dummy.
- `ui.js`: pilihan difficulty/time dan tombol Play.
- `hud.js`: tampilan data HUD.
- `gameOver.js`: panel hasil, Play Again, dan Home.
- `audio.js`: memuat dan memainkan efek hit, perfect, dan miss.

## Modul latihan

- `gameState.js`: MENU, COUNTDOWN, PLAYING, GAME_OVER.
- `gameLogic.js`: mulai ronde dan game over.
- `targetLogic.js`: gerak target, delta time, sin/cos.
- `punchLogic.js`: deteksi pukulan serta hit/miss.
- `scoreLogic.js`: penghitungan score.
- `comboLogic.js`: aturan combo.
- `timerLogic.js`: timer dan kondisi waktu habis.

Setiap fungsi latihan berisi solusi referensi guru di bawah komentar `// TODO` dan `// Petunjuk`. Salin project sebelum menghapus solusi tersebut untuk membuat versi siswa. Fungsi menerima objek `game` dari entry point agar state tidak disebar lewat global. Objek ini menyediakan controller, target, hitbox melalui `game.getTargetHitbox()`, tampilan HUD, audio, difficulty, score/combo hooks, dan `game.showGameOver(score)`.

## Urutan belajar

1. Jalankan project dan kenali workspace.
2. Pelajari game loop dan parameter delta.
3. Atur state ronde pada `startGame()`.
4. Isi `moveTarget()` dengan delta time dan sin/cos.
5. Isi `detectPunch()` dan `checkHit()`.
6. Isi score dan combo.
7. Isi timer dan panggil `gameOver()` saat waktu habis.
8. Pahami state game dan modifikasi difficulty.
9. Tampilkan hasil latihan.

Jalankan `npm run dev` untuk development dan `npm run build` untuk memeriksa build.

