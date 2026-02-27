import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function BlueprintGrid() {
    const gridRef = useRef();

    // Create a gridHelper
    useFrame((state) => {
        if (gridRef.current) {
            gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 1;
        }
    });

    return (
        <group ref={gridRef}>
            <gridHelper args={[100, 100, "#00ffff", "#004466"]} position={[0, -2, 0]} />
            <gridHelper args={[100, 100, "#00ffff", "#004466"]} position={[0, 10, 0]} />
        </group>
    );
}

function WireframeBoxes() {
    const group = useRef();

    const boxes = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 40; i++) {
            temp.push({
                position: [
                    (Math.random() - 0.5) * 40,
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 40 - 10
                ],
                scale: Math.random() * 2 + 0.5,
                speed: Math.random() * 0.2 + 0.1
            });
        }
        return temp;
    }, []);

    useFrame((state) => {
        group.current.children.forEach((child, i) => {
            child.rotation.x += 0.005 * boxes[i].speed;
            child.rotation.y += 0.005 * boxes[i].speed;
            child.position.y += Math.sin(state.clock.elapsedTime * boxes[i].speed + i) * 0.005;
        });
    });

    return (
        <group ref={group}>
            {boxes.map((box, i) => (
                <mesh key={i} position={box.position} scale={box.scale}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshBasicMaterial color="#00ffff" wireframe={true} transparent opacity={0.3} />
                </mesh>
            ))}
        </group>
    );
}

function CameraRig() {
    useFrame((state) => {
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 2, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 2 + 2, 0.05);
        state.camera.lookAt(0, 0, -10);
    });
    return null;
}

export default function BlueprintBackground({ scrollYProgress = 0 }) {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: -1,
                background: "linear-gradient(135deg, #0a1128 0%, #001f3f 100%)",
                pointerEvents: "none",
            }}
        >
            <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
                <fog attach="fog" args={["#0a1128", 5, 30]} />
                <BlueprintGrid />
                <WireframeBoxes />
                <CameraRig />
            </Canvas>
        </div>
    );
}
