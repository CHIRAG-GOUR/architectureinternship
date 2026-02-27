import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

/*
  3D City — adapted from CodePen vcomics/aGmoae
  Warm parchment palette with VISIBLE dark buildings
*/

export default function ThreeBackground() {
    const mountRef = useRef(null);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        if (window.innerWidth > 800) {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        container.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500);
        camera.position.set(0, 2, 14);

        const scene = new THREE.Scene();
        const fogColor = 0xF1E9D2;
        scene.background = new THREE.Color(fogColor);
        scene.fog = new THREE.Fog(fogColor, 10, 16);

        const city = new THREE.Object3D();
        const smoke = new THREE.Object3D();
        const town = new THREE.Object3D();

        let createCarPos = true;
        const uSpeed = 0.001;

        function mathRandom(num = 8) {
            return -Math.random() * num + Math.random() * num;
        }

        // Tint toggle
        let setTintNum = true;
        function setTintColor() {
            if (setTintNum) { setTintNum = false; return 0x3a2e1f; }
            else { setTintNum = true; return 0x2c2218; }
        }

        function init() {
            const segments = 2;
            for (let i = 1; i < 100; i++) {
                const geometry = new THREE.BoxGeometry(1, 1, 1, segments, segments, segments);

                const material = new THREE.MeshStandardMaterial({
                    color: setTintColor(),
                    wireframe: false,
                    side: THREE.DoubleSide,
                });
                const wmaterial = new THREE.MeshLambertMaterial({
                    color: 0xffffff,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.03,
                    side: THREE.DoubleSide,
                });

                const cube = new THREE.Mesh(geometry, material);
                const wire = new THREE.Mesh(geometry, wmaterial);
                const floor = new THREE.Mesh(geometry, material.clone());

                cube.add(wire);
                cube.castShadow = true;
                cube.receiveShadow = true;
                cube.rotationValue = 0.1 + Math.abs(mathRandom(8));

                floor.scale.y = 0.05;
                cube.scale.y = 0.1 + Math.abs(mathRandom(8));

                const cubeWidth = 0.9;
                cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth);
                cube.position.x = Math.round(mathRandom());
                cube.position.z = Math.round(mathRandom());

                floor.position.set(cube.position.x, 0, cube.position.z);

                town.add(floor);
                town.add(cube);
            }

            // Particles — golden
            const gmaterial = new THREE.MeshToonMaterial({ color: 0xc9a96e, side: THREE.DoubleSide });
            const gparticular = new THREE.CircleGeometry(0.01, 3);

            for (let h = 1; h < 300; h++) {
                const particular = new THREE.Mesh(gparticular, gmaterial);
                particular.position.set(mathRandom(5), mathRandom(5), mathRandom(5));
                particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
                smoke.add(particular);
            }

            // Ground plane
            const pmaterial = new THREE.MeshPhongMaterial({
                color: 0x3a2e1f,
                side: THREE.DoubleSide,
                opacity: 0.9,
                transparent: true,
            });
            const pgeometry = new THREE.PlaneGeometry(60, 60);
            const pelement = new THREE.Mesh(pgeometry, pmaterial);
            pelement.rotation.x = -90 * Math.PI / 180;
            pelement.position.y = -0.001;
            pelement.receiveShadow = true;
            city.add(pelement);
        }

        // Mouse
        const mouse = { x: 0, y: 0 };
        function onMouseMove(e) {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        }
        function onTouchMove(e) {
            if (e.touches.length === 1) {
                mouse.x = (e.touches[0].pageX / window.innerWidth) * 2 - 1;
                mouse.y = -(e.touches[0].pageY / window.innerHeight) * 2 + 1;
            }
        }
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("touchmove", onTouchMove);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xF1E9D2, 4);
        const lightFront = new THREE.SpotLight(0xc9a96e, 20, 10);
        lightFront.rotation.x = 45 * Math.PI / 180;
        lightFront.rotation.z = -45 * Math.PI / 180;
        lightFront.position.set(5, 5, 5);
        lightFront.castShadow = true;
        lightFront.shadow.mapSize.width = 2048;
        lightFront.shadow.mapSize.height = 2048;
        lightFront.penumbra = 0.1;

        const lightBack = new THREE.PointLight(0xd9c4a5, 0.5);
        lightBack.position.set(0, 6, 0);

        smoke.position.y = 2;

        scene.add(ambientLight);
        city.add(lightFront);
        scene.add(lightBack);
        scene.add(city);
        city.add(smoke);
        city.add(town);

        // Grid
        const gridHelper = new THREE.GridHelper(60, 120, 0xc9a96e, 0xd9c4a5);
        city.add(gridHelper);

        // Animated lines
        function createCars(cScale = 2, cPos = 20, cColor = 0xc9a96e) {
            const cMat = new THREE.MeshToonMaterial({ color: cColor, side: THREE.DoubleSide });
            const cGeo = new THREE.BoxGeometry(1, cScale / 40, cScale / 40);
            const cElem = new THREE.Mesh(cGeo, cMat);
            const cAmp = 3;

            if (createCarPos) {
                createCarPos = false;
                cElem.position.x = -cPos;
                cElem.position.z = mathRandom(cAmp);
                gsap.to(cElem.position, { x: cPos, duration: 3, repeat: -1, yoyo: true, delay: mathRandom(3) });
            } else {
                createCarPos = true;
                cElem.position.x = mathRandom(cAmp);
                cElem.position.z = -cPos;
                cElem.rotation.y = 90 * Math.PI / 180;
                gsap.to(cElem.position, { z: cPos, duration: 5, repeat: -1, yoyo: true, delay: mathRandom(3), ease: "power1.inOut" });
            }
            cElem.receiveShadow = true;
            cElem.castShadow = true;
            cElem.position.y = Math.abs(mathRandom(5));
            city.add(cElem);
        }

        function generateLines() {
            for (let i = 0; i < 60; i++) createCars(0.1, 20);
        }

        // Animate
        let animId;
        function animate() {
            animId = requestAnimationFrame(animate);
            city.rotation.y -= ((mouse.x * 8) - camera.rotation.y) * uSpeed;
            city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;
            if (city.rotation.x < -0.05) city.rotation.x = -0.05;
            else if (city.rotation.x > 1) city.rotation.x = 1;

            smoke.rotation.y += 0.01;
            smoke.rotation.x += 0.01;

            camera.lookAt(city.position);
            renderer.render(scene, camera);
        }

        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener("resize", onResize);

        generateLines();
        init();
        animate();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("resize", onResize);
            if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} id="three-bg" />;
}
