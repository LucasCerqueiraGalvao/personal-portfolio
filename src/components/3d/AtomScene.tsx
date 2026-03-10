import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Stars } from "@react-three/drei";
import { useRef } from "react";
import type { Group, Mesh } from "three";

type OrbitProps = {
    radius: number;
    speed: number;
    tilt: [number, number, number];
    scaleY?: number;
};

function OrbitElectron({
    radius,
    speed,
    tilt,
    scaleY = 0.78,
}: OrbitProps) {
    const orbitRef = useRef<Group>(null);
    const electronRef = useRef<Mesh>(null);

    useFrame(({ clock }) => {
        const elapsed = clock.getElapsedTime();

        if (orbitRef.current) {
            orbitRef.current.rotation.x = tilt[0];
            orbitRef.current.rotation.y = tilt[1];
            orbitRef.current.rotation.z = tilt[2] + elapsed * 0.08;
        }

        if (electronRef.current) {
            const angle = elapsed * speed;
            electronRef.current.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            );
        }
    });

    return (
        <group ref={orbitRef} scale={[1, scaleY, 1]}>
            <mesh>
                <torusGeometry args={[radius, 0.012, 8, 128]} />
                <meshBasicMaterial color="#ef4444" transparent opacity={0.45} />
            </mesh>
            <mesh ref={electronRef}>
                <sphereGeometry args={[0.075, 16, 16]} />
                <meshStandardMaterial
                    color="#f87171"
                    emissive="#ef4444"
                    emissiveIntensity={1.2}
                />
            </mesh>
        </group>
    );
}

function AtomCore() {
    const nucleusRef = useRef<Mesh>(null);

    useFrame(({ clock }) => {
        const elapsed = clock.getElapsedTime();
        if (!nucleusRef.current) {
            return;
        }

        nucleusRef.current.rotation.x = elapsed * 0.3;
        nucleusRef.current.rotation.y = elapsed * 0.42;
    });

    return (
        <Float speed={1.6} floatIntensity={0.5} rotationIntensity={0.25}>
            <group>
                <mesh ref={nucleusRef}>
                    <icosahedronGeometry args={[1.05, 1]} />
                    <meshStandardMaterial
                        color="#ef4444"
                        emissive="#ef4444"
                        emissiveIntensity={0.32}
                        wireframe
                        transparent
                        opacity={0.5}
                    />
                </mesh>
                <mesh scale={0.35}>
                    <sphereGeometry args={[1, 24, 24]} />
                    <meshStandardMaterial
                        color="#fecaca"
                        emissive="#ef4444"
                        emissiveIntensity={0.5}
                    />
                </mesh>

                <OrbitElectron radius={2.3} speed={0.95} tilt={[0.2, 0.1, 0]} />
                <OrbitElectron
                    radius={2.6}
                    speed={-0.68}
                    tilt={[1.08, 0.42, 0.25]}
                    scaleY={0.72}
                />
                <OrbitElectron
                    radius={2.05}
                    speed={1.25}
                    tilt={[-0.86, 0.55, -0.38]}
                    scaleY={0.8}
                />
            </group>
        </Float>
    );
}

function AtomSceneContent() {
    return (
        <>
            <ambientLight intensity={0.6} />
            <pointLight position={[4, 4, 4]} intensity={0.9} color="#fda4af" />
            <pointLight position={[-4, -3, -4]} intensity={1.5} color="#ef4444" />

            <AtomCore />

            <Stars
                radius={45}
                depth={28}
                count={900}
                factor={2.2}
                saturation={0}
                fade
                speed={0.25}
            />
        </>
    );
}

function AtomScene() {
    return (
        <div className="h-full w-full">
            <Canvas gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 7]} />
                <AtomSceneContent />
            </Canvas>
        </div>
    );
}

export default AtomScene;

