import * as THREE from 'three';

function createCard(root, width, height, x, y, color) {
    const card = new THREE.Group();
    card.position.set(x, y, 0);

    const background = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.60, side: THREE.DoubleSide })
    );
    background.position.z = 0.005;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    const text = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide })
    );
    text.position.z = 0.02;
    text.scale.set(width * 1.55, height * 0.72, 1);
    card.add(background, text);
    root.add(card);

    let previous = '';
    return (value, textColor = color) => {
        const key = value + textColor;
        if (previous === key) return;
        previous = key;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = textColor;
        context.font = 'bold 72px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(value, 512, 128);
        texture.needsUpdate = true;
    };
}

export function initHUD(scene, camera, renderer) {
    const group = new THREE.Group();
    group.visible = false;
    scene.add(group);

    const score = createCard(group, 0.42, 0.11, -0.58, 0.31, '#ffffff');
    const time = createCard(group, 0.42, 0.11, 0.58, 0.31, '#66ff66');
    const combo = createCard(group, 0.42, 0.11, -0.62, 0.14, '#ffcc66');
    const hits = createCard(group, 0.42, 0.11, 0.62, 0.14, '#ffffff');
    const leftSpeed = createCard(group, 0.52, 0.11, -0.55, -0.19, '#66aaff');
    const rightSpeed = createCard(group, 0.52, 0.11, 0.55, -0.19, '#ff7777');
    const status = createCard(group, 0.72, 0.10, 0, -0.35, '#aaaaaa');

    const countdownGroup = new THREE.Group();
    countdownGroup.visible = false;
    scene.add(countdownGroup);
    const countdownPanel = new THREE.Mesh(
        new THREE.PlaneGeometry(0.50, 0.38),
        new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.76, side: THREE.DoubleSide })
    );
    countdownGroup.add(countdownPanel);
    const countdownCanvas = document.createElement('canvas');
    countdownCanvas.width = 1024;
    countdownCanvas.height = 256;
    const countdownContext = countdownCanvas.getContext('2d');
    const countdownTexture = new THREE.CanvasTexture(countdownCanvas);
    countdownTexture.generateMipmaps = false;
    countdownTexture.minFilter = THREE.LinearFilter;
    const countdownText = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ map: countdownTexture, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide })
    );
    countdownText.position.z = 0.03;
    countdownText.scale.set(0.44, 0.29, 1);
    countdownGroup.add(countdownText);

    const cameraPosition = new THREE.Vector3();
    const cameraDirection = new THREE.Vector3();
    const targetPosition = new THREE.Vector3();
    const countdownPosition = new THREE.Vector3();
    let lastCountdownText = '';

    function setCountdownText(value, color = '#ffffff') {
        const key = value + color;
        if (key === lastCountdownText) return;
        lastCountdownText = key;
        countdownContext.clearRect(0, 0, countdownCanvas.width, countdownCanvas.height);
        countdownContext.fillStyle = color;
        countdownContext.font = 'bold 180px Arial';
        countdownContext.textAlign = 'center';
        countdownContext.textBaseline = 'middle';
        countdownContext.fillText(value, 512, 128);
        countdownTexture.needsUpdate = true;
    }

    return {
        show(visible) { group.visible = visible; },
        showCountdown(visible) { countdownGroup.visible = visible; },
        setCountdownText,
        update(game = {}) {
            score(`SCORE ${game.score ?? 0}`);
            time(`TIME ${game.timeLeft ?? 0}`, (game.timeLeft ?? 0) <= 5 ? '#ff5555' : '#66ff66');
            combo(`COMBO x${game.combo ?? 0}`, (game.combo ?? 0) >= 3 ? '#ffcc66' : '#ffffff');
            hits(`HIT ${game.hits ?? 0}  MISS ${game.misses ?? 0}`);
            leftSpeed(`LEFT ${(game.leftHandSpeed ?? 0).toFixed(1)} m/s`);
            rightSpeed(`RIGHT ${(game.rightHandSpeed ?? 0).toFixed(1)} m/s`);
            status(game.status || `DIFFICULTY ${game.difficulty || 'NORMAL'}`);
        },
        updateTransform() {
            if (!renderer.xr.isPresenting || !group.visible) return;
            const xrCamera = renderer.xr.getCamera(camera);
            xrCamera.getWorldPosition(cameraPosition);
            xrCamera.getWorldDirection(cameraDirection);
            cameraDirection.y = 0;
            if (cameraDirection.lengthSq() < 0.0001) cameraDirection.set(0, 0, -1);
            cameraDirection.normalize();
            targetPosition.copy(cameraPosition).add(cameraDirection.multiplyScalar(1.2));
            targetPosition.y += 0.03;
            group.position.lerp(targetPosition, 0.30);
            group.rotation.set(0, Math.atan2(-cameraDirection.x, -cameraDirection.z), 0);
        },
        updateCountdownTransform() {
            if (!renderer.xr.isPresenting || !countdownGroup.visible) return;
            const xrCamera = renderer.xr.getCamera(camera);
            xrCamera.getWorldPosition(cameraPosition);
            xrCamera.getWorldDirection(cameraDirection);
            cameraDirection.y = 0;
            if (cameraDirection.lengthSq() < 0.0001) cameraDirection.set(0, 0, -1);
            cameraDirection.normalize();
            countdownPosition.copy(cameraPosition).add(cameraDirection.multiplyScalar(1.05));
            countdownPosition.y = 1.60;
            countdownGroup.position.lerp(countdownPosition, 0.40);
            countdownGroup.rotation.set(0, Math.atan2(-cameraDirection.x, -cameraDirection.z), 0);
        }
    };
}

