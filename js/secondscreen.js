import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

export function initThirdScreen() {
    // Инициализация сцены для canvas3
    const canvas = document.getElementById('canvas2');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Настройка рендерера
    const renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    // Позиция камеры
    camera.position.set(0, 0, 5);

    // OrbitControls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;

    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Загрузка модели для третьей сцены (камни или сердце)
    const loader = new GLTFLoader();
    loader.load(
        'models/heart.gltf', // или 'models/heart.gltf'
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(2, 2, 2);
            model.position.y = -0.5;
            scene.add(model);
        },
        undefined,
        (error) => {
            console.error('Error loading model:', error);
        }
    );

    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Анимация
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

document.addEventListener('DOMContentLoaded', initThirdScreen);
