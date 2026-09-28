import * as THREE from 'three';
import './style.css';
import { initScene } from './starter/scene.js';
import { loadAssets } from './starter/assets.js';
import { initControllers } from './starter/controllers.js';
import { createHitbox, updateHitbox, getTargetHitbox } from './starter/hitbox.js';
import { initXR, exitVR } from './starter/xr.js';
import { initUI } from './starter/ui.js';
import { initHUD } from './starter/hud.js';
import { initAudio } from './starter/audio.js';
import { initGameOver } from './starter/gameOver.js';
import { placeDummy } from './starter/assetPositions.js';
import { GAME_STATES } from './latihan/gameState.js';
import { startGame, updateCountdown } from './latihan/gameLogic.js';
import { moveTarget } from './latihan/targetLogic.js';
import { detectPunch } from './latihan/punchLogic.js';
import { updateTimer } from './latihan/timerLogic.js';
import { addScore } from './latihan/scoreLogic.js';
import { updateCombo } from './latihan/comboLogic.js';

const { scene, camera, renderer, playerMarker } = initScene();
const controllers = initControllers(renderer, scene);
const audio = initAudio();
const hud = initHUD(scene, camera, renderer);
const hitbox = createHitbox();
const playerAnchor = new THREE.Vector3(0, 1.6, 0);
const target = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.80, 0.22),
    new THREE.MeshStandardMaterial({ color: 0xff3333 })
);
target.position.set(0, playerAnchor.y, -0.70);
target.visible = false;
scene.add(target);

const game = {
    state: GAME_STATES.MENU,
    score: 0,
    combo: 0,
    timeLeft: 30,
    hits: 0,
    misses: 0,
    perfects: 0,
    bestCombo: 0,
    status: 'SIAP',
    difficulty: 'NORMAL',
    selectedTime: 30,
    targetAngle: 0,
    orbitDirection: 1,
    orbitSpeed: 1.4,
    targetRadius: 0.70,
    leftMotionSamples: [],
    rightMotionSamples: [],
    leftHandSpeed: 0,
    rightHandSpeed: 0,
    controllersInitialized: false,
    vrSessionActive: false,
    vrGameInitialized: false,
    leftPunchCooldown: 0,
    rightPunchCooldown: 0,
    leftHitArmed: true,
    rightHitArmed: true,
    addScore: points => addScore(points, game),
    updateCombo: hit => updateCombo(hit, game),
    scene, camera, renderer, controllers, playerAnchor, target, hitbox, hud, audio
};
function setGlovesVisible(visible) {
    if (assets?.leftGlove) assets.leftGlove.visible = visible;
    if (assets?.rightGlove) assets.rightGlove.visible = visible;
}
const gameOver = initGameOver({
    scene, camera, renderer, controllers,
    onPlayAgain: () => { setGlovesVisible(true); startGame(game); },
    onHome: () => exitVR(renderer)
});
game.gameOverDisplay = gameOver;
game.showGameOver = (score, hits, misses, perfects, bestCombo) => {
    setGlovesVisible(false);
    gameOver.show(score, hits, misses, perfects, bestCombo);
};
game.getTargetHitbox = () => getTargetHitbox(hitbox);

const ui = initUI({
    renderer,
    audio,
    onDifficulty: value => { game.difficulty = value; },
    onDuration: value => { game.selectedTime = value; }
});

let assets = null;
loadAssets(scene, controllers, target, playerAnchor).then(result => {
    assets = result;
    game.assets = result;
    if (assets.dummy) {
        target.visible = false;
        assets.dummy.visible = game.state === GAME_STATES.PLAYING;
    }
}).catch(error => {
    console.error('[ASSETS] Failed to load:', error);
});

initXR(renderer, {
    onSessionStart: () => {
        game.vrSessionActive = true;
        game.vrGameInitialized = false;
        game.state = 'WAITING_XR';
        ui.hideStartScreen();
    },
    onSessionEnd: () => {
        setGlovesVisible(true);
        game.vrSessionActive = false;
        game.vrGameInitialized = false;
        game.controllersInitialized = false;
        game.leftMotionSamples.length = 0;
        game.rightMotionSamples.length = 0;
        game.state = GAME_STATES.MENU;
        if (assets?.dummy) assets.dummy.visible = false;
        hud.show(false);
        gameOver.hide();
        hud.showCountdown(false);
        ui.showStartScreen();
    }
});

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
    const delta = THREE.MathUtils.clamp(clock.getDelta(), 0.001, 0.05);

    if (renderer.xr.isPresenting) {
        renderer.xr.getCamera(camera).getWorldPosition(playerAnchor);
        playerAnchor.y = 1.60;
        if (!game.controllersInitialized) {
            controllers.left.getWorldPosition(controllers.previousLeftPosition);
            controllers.right.getWorldPosition(controllers.previousRightPosition);
            game.controllersInitialized = true;
        }
    }

    if (game.vrSessionActive && !game.vrGameInitialized && renderer.xr.getSession()) {
        playerMarker.position.set(playerAnchor.x, 0.01, playerAnchor.z);
        game.vrGameInitialized = true;
        startGame(game);
    }

    if (game.state === GAME_STATES.COUNTDOWN) updateCountdown(delta, game);

    if (game.state === GAME_STATES.PLAYING) {
        moveTarget(delta, game);
    }

    if (assets?.dummy) {
        placeDummy(assets.dummy, target.position, playerAnchor);
        target.position.y += 0.35;
        assets.dummy.updateMatrixWorld(true);
        updateHitbox(hitbox, assets.dummy);
        assets.dummy.visible = game.state === GAME_STATES.PLAYING;
    }

    if (game.state === GAME_STATES.PLAYING) {
        detectPunch(controllers.left, 'left', delta, game);
        detectPunch(controllers.right, 'right', delta, game);
        updateTimer(delta, game);
        controllers.leftFist.scale.setScalar(THREE.MathUtils.damp(controllers.leftFist.scale.x, 1, 16, delta));
        controllers.rightFist.scale.setScalar(THREE.MathUtils.damp(controllers.rightFist.scale.x, 1, 16, delta));
    }

    hud.update(game);
    gameOver.update();
    hud.updateTransform();
    hud.updateCountdownTransform();
    renderer.render(scene, camera);
});







