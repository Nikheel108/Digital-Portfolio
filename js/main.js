// Array of pages for navigation
const pages = [
    'index.html',
    'about.html',
    'skills.html',
    'projects.html',
    'education.html',
    'achievements.html',
    'contact.html'
];

let currentPageIndex = 0;

// Initialize the globe
function initGlobe() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    const container = document.querySelector('.globe-container');
    
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
    });
    renderer.setSize(120, 120);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create globe geometry with more segments for smoothness
    const geometry = new THREE.SphereGeometry(40, 64, 64);
    
    // Create earth texture
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
    const bumpMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg');
    const specularMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');

    // Create material with more realistic properties
    const material = new THREE.MeshPhongMaterial({
        map: earthTexture,
        bumpMap: bumpMap,
        bumpScale: 1.0,
        specularMap: specularMap,
        specular: new THREE.Color('grey'),
        shininess: 15,
        normalScale: new THREE.Vector2(0.85, 0.85)
    });

    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Add atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(40.5, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        uniforms: {},
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
            }
        `
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(100, 50, 80);
    scene.add(pointLight);

    camera.position.z = 95;
    camera.lookAt(scene.position);

    // Animation with smooth rotation
    let rotationSpeed = 0.002;
    function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += rotationSpeed;
        atmosphere.rotation.y += rotationSpeed;
        renderer.render(scene, camera);
    }
    animate();

    // Add interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
    });

    container.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };

            globe.rotation.y += deltaMove.x * 0.005;
            globe.rotation.x += deltaMove.y * 0.005;
            atmosphere.rotation.y = globe.rotation.y;
            atmosphere.rotation.x = globe.rotation.x;

            previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
        }
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
    });

    container.addEventListener('mouseleave', () => {
        isDragging = false;
    });
}

// Navigation function
function navigatePage(direction) {
    if (direction === 'next') {
        currentPageIndex = (currentPageIndex + 1) % pages.length;
    } else {
        currentPageIndex = (currentPageIndex - 1 + pages.length) % pages.length;
    }
    
    // Add rotation animation class
    const globe = document.querySelector('.globe-container');
    globe.style.transform = `rotate(${direction === 'next' ? '360deg' : '-360deg'})`;
    
    // Navigate to the new page after animation
    setTimeout(() => {
        window.location.href = pages[currentPageIndex];
    }, 500);
}

// Initialize current page index
function initCurrentPageIndex() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    currentPageIndex = Math.max(0, pages.indexOf(currentPage));
}

// Initialize everything when the page loads
window.addEventListener('load', () => {
    initCurrentPageIndex();
    initGlobe();
    
    // Add hover effects for navigation arrows
    const arrows = document.querySelectorAll('.nav-arrow');
    arrows.forEach(arrow => {
        arrow.addEventListener('mouseenter', () => {
            arrow.style.transform = 'scale(1.1)';
        });
        arrow.addEventListener('mouseleave', () => {
            arrow.style.transform = 'scale(1)';
        });
    });
}); 