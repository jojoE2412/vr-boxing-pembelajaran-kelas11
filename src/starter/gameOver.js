import * as THREE from 'three';

function createPanelText() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.88, 0.44),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide })
    );
    mesh.position.set(0, 0.19, 0.02);
    mesh.renderOrder = 10;
    mesh.frustumCulled = false;
    mesh.userData.draw = (score, best, hits, misses, perfects, bestCombo) => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = 'bold 64px Arial';
        context.fillStyle = '#ff4444';
        context.fillText('GAME OVER', 512, 60);
        context.font = 'bold 52px Arial';
        context.fillStyle = '#ffffff';
        context.fillText(`SCORE ${score}`, 512, 150);
        context.fillStyle = '#ffdd44';
        context.fillText(`BEST ${best}`, 512, 230);
        context.font = 'bold 38px Arial';
        context.fillStyle = '#aaaaaa';
        context.fillText(`HIT ${hits}    MISS ${misses}`, 512, 310);
        context.fillStyle = '#66ff88';
        context.fillText(`PERFECT ${perfects}`, 512, 375);
        context.fillStyle = '#ffcc66';
        context.fillText(`BEST COMBO x${bestCombo}`, 512, 440);
        texture.needsUpdate = true;
    };
    return mesh;
}

export function initGameOver({ scene, camera, renderer, controllers, onPlayAgain = () => {}, onHome = () => {} }) {
    const group = new THREE.Group();
    group.visible = false;
    scene.add(group);

    const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(1.00, 0.90),
        new THREE.MeshBasicMaterial({ color: 0x111521, depthTest: false, depthWrite: false, side: THREE.DoubleSide })
    );
    const border = new THREE.Mesh(
        new THREE.PlaneGeometry(1.02, 0.92),
        new THREE.MeshBasicMaterial({ color: 0xe04b56, depthTest: false, depthWrite: false, side: THREE.DoubleSide })
    );
    border.position.z = -0.002;
    border.renderOrder = 999;
    border.frustumCulled = false;
    panel.renderOrder = 1000;
    panel.frustumCulled = false;
    const panelText = createPanelText();
    panelText.renderOrder = 1001;
    group.add(border, panel, panelText);
    group.scale.setScalar(0.82);

    const buttons = [];
    const addButton = (label, y, action) => {
        const baseColor = 0x30394a;
        const hoverColor = 0xe04b56;
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(0.72, 0.13),
            new THREE.MeshBasicMaterial({ color: baseColor, depthTest: false, depthWrite: false, side: THREE.DoubleSide })
        );
        mesh.position.set(0, y, 0.05);
        mesh.renderOrder = 1002;
        mesh.frustumCulled = false;
        mesh.userData.action = action;
        mesh.userData.baseColor = baseColor;
        mesh.userData.hoverColor = hoverColor;
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.font = 'bold 54px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(label, 256, 64);
        const buttonTexture = new THREE.CanvasTexture(canvas);
        buttonTexture.colorSpace = THREE.SRGBColorSpace;
        const text = new THREE.Mesh(
            new THREE.PlaneGeometry(0.65, 0.10),
            new THREE.MeshBasicMaterial({ map: buttonTexture, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide })
        );
        text.position.set(0, y, 0.075);
        text.renderOrder = 1003;
        text.frustumCulled = false;
        group.add(mesh, text);
        buttons.push(mesh);
    };
    addButton('PLAY AGAIN', -0.20, () => {
        group.visible = false;
        controllers.leftPointer.visible = false;
        controllers.rightPointer.visible = false;
        onPlayAgain();
    });
    addButton('HOME', -0.36, () => {
        controllers.leftPointer.visible = false;
        controllers.rightPointer.visible = false;
        onHome();
    });

    const raycaster = new THREE.Raycaster();
    raycaster.far = 2.0;
    const hoverOrigin = new THREE.Vector3();
    const hoverDirection = new THREE.Vector3();
    function updateHover() {
        const hovered = new Set();
        if (group.visible && renderer.xr.isPresenting) {
            for (const controller of [controllers.left, controllers.right]) {
                controller.updateMatrixWorld(true);
                hoverOrigin.setFromMatrixPosition(controller.matrixWorld);
                hoverDirection.set(0, 0, -1).transformDirection(controller.matrixWorld);
                raycaster.set(hoverOrigin, hoverDirection);
                const hit = raycaster.intersectObjects(buttons, false)[0];
                if (hit) hovered.add(hit.object);
            }
        }
        for (const button of buttons) {
            button.material.color.setHex(hovered.has(button) ? button.userData.hoverColor : button.userData.baseColor);
        }
    }
    for (const controller of [controllers.left, controllers.right]) {
        controller.addEventListener('selectstart', () => {
            if (!group.visible || !renderer.xr.isPresenting) return;
            controller.updateMatrixWorld(true);
            const origin = new THREE.Vector3().setFromMatrixPosition(controller.matrixWorld);
            const direction = new THREE.Vector3(0, 0, -1).transformDirection(controller.matrixWorld);
            raycaster.set(origin, direction);
            const [hit] = raycaster.intersectObjects(buttons, false);
            if (hit) hit.object.userData.action();
        });
    }

    return {
        show(score, hits = 0, misses = 0, perfects = 0, bestCombo = 0) {
            const previousBest = Number(localStorage.getItem('vr-boxing-best-score') || 0);
            if (score > previousBest) {
                localStorage.setItem('vr-boxing-best-score', String(score));
            }
            const best = Math.max(score, previousBest);
            const text = group.children.find(child => child.userData.draw);
            if (text) {
                text.userData.draw(score, best, hits, misses, perfects, bestCombo);
            }
            if (renderer.xr.isPresenting) {
                const xrCamera = renderer.xr.getCamera(camera);
                const position = new THREE.Vector3();
                const direction = new THREE.Vector3();
                xrCamera.getWorldPosition(position);
                xrCamera.getWorldDirection(direction);
                direction.y = 0;
                if (direction.lengthSq() < 0.0001) direction.set(0, 0, -1);
                direction.normalize();
                group.position.copy(position).add(direction.multiplyScalar(1.10));
                group.position.y = 1.60;
                group.rotation.set(0, Math.atan2(-direction.x, -direction.z), 0);
            }
            group.visible = true;
            controllers.leftPointer.visible = true;
            controllers.rightPointer.visible = true;
            updateHover();
        },
        update: updateHover,
        hide() {
            group.visible = false;
            controllers.leftPointer.visible = false;
            controllers.rightPointer.visible = false;
            updateHover();
        }
    };
}

