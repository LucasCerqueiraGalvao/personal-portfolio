import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function SceneContent() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ mouse, camera, clock }) => {
        // Smooth camera movement based on mouse
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 2, 0.05);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 2, 0.05);
        camera.lookAt(0, 0, 0);

        // Rotate the central mesh
        if (meshRef.current) {
            meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} color="#ef4444" intensity={2} />
            
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                 <mesh ref={meshRef} scale={1.5}>
                    <icosahedronGeometry args={[1, 1]} />
                    <meshStandardMaterial color="#ef4444" wireframe transparent opacity={0.3} />
                 </mesh>
            </Float>
            
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </>
    );
}

export default function Scene3D() {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none bg-black">
            <Canvas gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <SceneContent />
            </Canvas>
        </div>
    );
}
