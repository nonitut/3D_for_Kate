import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Настройки
const STONE_COUNT = 30;
const MOUSE_POWER = 0.5;
const MOUSE_RADIUS = 8;
const FLOOR_Y = 0;

let stones = [];
let mousePos = new THREE.Vector3(0, 0, 0);

export function initSecondScreen() {
    const canvas = document.getElementById('canvas3');
    if (!canvas) return;

    // 1. Настройка сцены без физики
    const scene = new THREE.Scene();
    scene.background = null;
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
    camera.position.set(0, 15, 40);
    camera.lookAt(0, 5, 0);

    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 2. Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // 3. Загрузка камней с простой логикой движения
    new GLTFLoader().load('models/kamni.gltf', (gltf) => {
        const template = gltf.scene;
        template.scale.set(3, 3, 3);

        for (let i = 0; i < STONE_COUNT; i++) {
            const stone = template.clone();
            
            // Начальная позиция
            stone.position.x = (Math.random() - 0.5) * 20;
            stone.position.y = 5 + Math.random() * 10;
            stone.position.z = (Math.random() - 0.5) * 20;
            
            // Случайный поворот
            stone.rotation.x = Math.random() * Math.PI;
            stone.rotation.y = Math.random() * Math.PI;
            
            // Скорость для плавного движения
            stone.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5
                )
            };
            
            scene.add(stone);
            stones.push(stone);
        }
    });

    // 4. Обработчик мыши (упрощенный)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    canvas.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / canvas.width) * 2 - 1;
        mouse.y = -(e.clientY / canvas.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const ray = raycaster.ray;
        mousePos.copy(ray.origin).add(ray.direction.multiplyScalar(25));
    });

    // 5. Анимация с "псевдо-физикой"
    function animate() {
        requestAnimationFrame(animate);
        
        stones.forEach(stone => {
            // Расстояние до мыши
            const dx = stone.position.x - mousePos.x;
            const dy = stone.position.y - mousePos.y;
            const dz = stone.position.z - mousePos.z;
            const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
            
            // Эффект отталкивания от мыши
            if (distance < MOUSE_RADIUS && distance > 0) {
                const force = (1 - distance/MOUSE_RADIUS) * MOUSE_POWER;
                
                stone.userData.velocity.x += (dx/distance) * force * 0.1;
                stone.userData.velocity.y += (dy/distance) * force * 0.05;
                stone.userData.velocity.z += (dz/distance) * force * 0.1;
            }
            
            // "Левитация" - возврат к базовой высоте
            if (stone.position.y < FLOOR_Y) {
                stone.userData.velocity.y += 0.01;
            } else {
                stone.userData.velocity.y *= 0.98;
            }
            
            // Плавное замедление
            stone.userData.velocity.multiplyScalar(0.98);
            
            // Применение движения
            stone.position.add(stone.userData.velocity);
            
            // Медленное вращение
            stone.rotation.x += 0.001;
            stone.rotation.y += 0.002;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

document.addEventListener('DOMContentLoaded', initSecondScreen);
