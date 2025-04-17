import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Основные переменные сцены
let scene, camera, renderer, controls;
let modelLoaded = false;
let fontLoaded = false;

// Инициализация сцены
function init3DScene() {
    const canvas = document.getElementById('canvas2');
    
    // Проверка наличия canvas
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    // Проверка размеров canvas
    if (canvas.clientWidth === 0 || canvas.clientHeight === 0) {
        console.error('Canvas has zero dimensions!');
        return;
    }

    // Создание сцены
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    // Настройка камеры
    camera = new THREE.PerspectiveCamera(
        75, 
        canvas.clientWidth / canvas.clientHeight, 
        0.1, 
        1000
    );
    camera.position.z = 15;

    // Создание рендерера
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Проверка поддержки WebGL
    if (!renderer.getContext()) {
        console.error('WebGL not supported or canvas context creation failed');
        showWebGLError();
        return;
    }

    // Добавление освещения
    setupLights();

    // Загрузка ресурсов
    loadResources();

    // Настройка OrbitControls
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Запуск анимации
    animate();
}

// Настройка освещения
function setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
    scene.add(hemisphereLight);
}

// Загрузка ресурсов
function loadResources() {
    const fontLoader = new FontLoader();
    const gltfLoader = new GLTFLoader();

    // Загрузка шрифта
    fontLoader.load(
        'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
        (font) => {
            fontLoaded = true;
            createText(font);
            checkResourcesLoaded();
        },
        undefined,
        (error) => {
            console.error('Error loading font:', error);
        }
    );

    // Загрузка модели
    gltfLoader.load(
        './models/kamni.gltf',
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(7, 7, 7);
            scene.add(model);
            modelLoaded = true;
            checkResourcesLoaded();
        },
        undefined,
        (error) => {
            console.error('Error loading model:', error);
        }
    );
}

// Создание текста
function createText(font) {
    const textGeometry = new TextGeometry('Hello Three.js', {
        font: font,
        size: 1,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    });

    textGeometry.center();

    const textMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.y = 2;
    scene.add(textMesh);
}

// Проверка загрузки всех ресурсов
function checkResourcesLoaded() {
    if (modelLoaded && fontLoaded) {
        console.log('All resources loaded');
        // Можно добавить дополнительные действия после загрузки
    }
}

// Функция анимации
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Обработка ошибки WebGL
function showWebGLError() {
    const errorElement = document.createElement('div');
    errorElement.style.color = 'red';
    errorElement.style.padding = '20px';
    errorElement.style.textAlign = 'center';
    errorElement.innerHTML = '<h2>WebGL Error</h2><p>Your browser or device does not support WebGL.</p>';
    document.body.appendChild(errorElement);
}

// Обработчик изменения размера окна
function onWindowResize() {
    const canvas = document.getElementById('canvas2');
    if (!canvas) return;

    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

// Инициализация при загрузке страницы
if (document.readyState === 'complete') {
    init3DScene();
} else {
    document.addEventListener('DOMContentLoaded', init3DScene);
}

// Добавление обработчика изменения размера окна
window.addEventListener('resize', onWindowResize);