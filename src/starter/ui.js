import { enterVR } from './xr.js';

export function initUI({ renderer, audio, onDifficulty = () => {}, onDuration = () => {} }) {
    let difficulty = 'NORMAL';
    let duration = 30;
    const startScreen = document.getElementById('start-screen');

    document.querySelectorAll('.difficulty-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.difficulty-button').forEach(item => item.classList.remove('selected'));
            button.classList.add('selected');
            difficulty = button.dataset.difficulty;
            onDifficulty(difficulty);
        });
    });

    document.querySelectorAll('.time-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.time-button').forEach(item => item.classList.remove('selected'));
            button.classList.add('selected');
            duration = Number(button.dataset.time);
            onDuration(duration);
        });
    });

    document.getElementById('start-button').addEventListener('click', async () => {
        try {
            // Mulai audio tanpa menunggu download/decode selesai supaya
            // requestSession tetap berada pada aktivasi klik pengguna.
            audio.unlock().catch(error => console.warn('[AUDIO] Could not unlock audio:', error));
            await enterVR(renderer);
        } catch (error) {
            console.error('[XR] Could not start VR:', error);
            window.alert(error.message || 'Tidak dapat memulai VR.');
        }
    });

    return {
        get settings() { return { difficulty, duration }; },
        showStartScreen() { startScreen.style.display = 'flex'; },
        hideStartScreen() { startScreen.style.display = 'none'; }
    };
}
