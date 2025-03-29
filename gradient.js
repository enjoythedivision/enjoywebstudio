let scene, camera, renderer, material, clock;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0; // Target for smooth transition
let sectionColors = {
    about: { colorA: [1.0, 0.2, 0.6], colorB: [0.6, 0.2, 0.1], colorC: [0, 0, 0] },
    services: { colorA: [0.3, 0.7, 1.0], colorB: [0.7, 0.3, 0.1], colorC: [0.1, 0.1, 0.1] },
    projects: { colorA: [0.2, 0.8, 0.3], colorB: [0.7, 0.5, 0.0], colorC: [0.2, 0.2, 0.2] },
    contact: { colorA: [0.9, 0.1, 0.5], colorB: [0.2, 0.3, 0.7], colorC: [0.0, 0.0, 0.0] }
};

let currentSection = null; // Track the current section
let transitionSpeed = 0.1; // Control the speed of the color transition
let targetColors = null; // Target colors for transition
let lastColors = { colorA: new THREE.Vector3(), colorB: new THREE.Vector3(), colorC: new THREE.Vector3() };

function init() {
    // 1️⃣ Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('bg').appendChild(renderer.domElement); // Appending the canvas to the div with id 'bg'

    clock = new THREE.Clock();

    // 2️⃣ Shader with More Black and Gradient
    const fragmentShader = `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform vec3 u_colorA;
        uniform vec3 u_colorB;
        uniform vec3 u_colorC;

        // Noise function for grain effect
        float random(vec2 uv) {
            return fract(sin(dot(uv, vec2(4.9898,78.233))) * 43758.5453);
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            uv.x *= u_resolution.x / u_resolution.y;

            // Gradients based on mouse position
            vec3 colorA = u_colorA;  // Dynamic color A
            vec3 colorB = u_colorB;  // Dynamic color B
            vec3 colorC = u_colorC;  // Dynamic color C

            // Calculate color gradients
            float color1 = 0.5 + 0.5 * sin(u_time + uv.x * 5.0 + u_mouse.x * 2.0);
            float color2 = 0.5 + 0.5 * cos(u_time + uv.y * 4.0 + u_mouse.y * 2.0);
            vec3 gradient = mix(mix(colorA, colorB, color1), colorC, color2);

            // Add more black influence by adjusting the mix weight
            gradient = mix(gradient, colorC, 0.7); // Increase the amount of black (0.8)

            // Fixed Grain (Static Noise)
            float grain = random(gl_FragCoord.xy * 0.5) * 0.06; // Adjust noise strength

            // Blend gradient over black background
            gl_FragColor = vec4(gradient + vec3(grain), 1.0);
        }
    `;

    material = new THREE.ShaderMaterial({
        fragmentShader,
        uniforms: {
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            u_time: { value: 0 },
            u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
            u_colorA: { value: new THREE.Vector3(...sectionColors.about.colorA) },
            u_colorB: { value: new THREE.Vector3(...sectionColors.about.colorB) },
            u_colorC: { value: new THREE.Vector3(...sectionColors.about.colorC) },
        }
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    animate();
}

function animate() {
    material.uniforms.u_time.value = clock.getElapsedTime();

    // Smoothly move the target mouse position towards the actual mouse position
    targetX += (mouseX - targetX) * 0.05; // Smooth the transition
    targetY += (mouseY - targetY) * 0.05;

    material.uniforms.u_mouse.value.set(targetX, targetY);

    // Gradually transition the color values
    if (targetColors) {
        lastColors.colorA.lerp(new THREE.Vector3(...targetColors.colorA), transitionSpeed);
        lastColors.colorB.lerp(new THREE.Vector3(...targetColors.colorB), transitionSpeed);
        lastColors.colorC.lerp(new THREE.Vector3(...targetColors.colorC), transitionSpeed);

        material.uniforms.u_colorA.value = lastColors.colorA;
        material.uniforms.u_colorB.value = lastColors.colorB;
        material.uniforms.u_colorC.value = lastColors.colorC;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Capture the mouse position
window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth; // Normalize mouseX
    mouseY = event.clientY / window.innerHeight; // Normalize mouseY
});

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
});

// Listen for scroll events to detect which section is in view
window.addEventListener('scroll', () => {
    let sectionInView = null;

    document.querySelectorAll('#about, #services, #projects, #contact').forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            sectionInView = section.id;
        }
    });

    if (sectionInView !== currentSection) {
        currentSection = sectionInView;

        // Set the target colors for the section in view
        if (sectionInView) {
            const colors = sectionColors[sectionInView];
            targetColors = colors;
        }
    }
});

init();
