import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const NUCLEUS_SCALE = 1.5;
const ORBIT_RADIUS_X = 3.34;
const ORBIT_RADIUS_Y = 3.02;
const ORBIT_SEGMENTS = 128;
const ELECTRON_SPEED = 0.6;
const ELECTRON_BASE_SCALE = 0.08;
const ORBIT_OCCLUSION_MARGIN = 0.18;
const ORBIT_REQUIRED_VIEW_ANGLE = Math.acos(
    THREE.MathUtils.clamp(
        (NUCLEUS_SCALE - ORBIT_OCCLUSION_MARGIN) / ORBIT_RADIUS_Y,
        -1,
        1
    )
);
const ORBIT_VIEW_ANGLE = ORBIT_REQUIRED_VIEW_ANGLE + 0.12;
const ORBIT_VIEW_WOBBLE = 0.03;
const ORBIT_TILT_WOBBLE_SPEED = 0.18;
const ORBIT_PRECESSION_SPEED = 0.11;
const WORLD_UP = new THREE.Vector3(0, 1, 0);
const WORLD_RIGHT = new THREE.Vector3(1, 0, 0);
const cameraDirection = new THREE.Vector3();
const screenRight = new THREE.Vector3();
const screenUp = new THREE.Vector3();
const majorAxisDirection = new THREE.Vector3();
const planePerpendicular = new THREE.Vector3();
const orbitNormal = new THREE.Vector3();
const minorAxisDirection = new THREE.Vector3();
const orbitPoint = new THREE.Vector3();

function SceneContent() {
    const meshRef = useRef<THREE.Mesh>(null);
    const electronRef = useRef<THREE.Mesh>(null);
    const orbitGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(new Float32Array(ORBIT_SEGMENTS * 3), 3)
        );
        return geometry;
    }, []);

    useFrame(({ mouse, camera, clock }) => {
        const elapsed = clock.getElapsedTime();

        camera.position.x = THREE.MathUtils.lerp(
            camera.position.x,
            mouse.x * 2,
            0.05
        );
        camera.position.y = THREE.MathUtils.lerp(
            camera.position.y,
            mouse.y * 2,
            0.05
        );
        camera.lookAt(0, 0, 0);

        if (meshRef.current) {
            meshRef.current.rotation.x = elapsed * 0.2;
            meshRef.current.rotation.y = elapsed * 0.3;
        }

        cameraDirection.copy(camera.position).normalize();
        const referenceAxis =
            Math.abs(cameraDirection.dot(WORLD_UP)) > 0.96
                ? WORLD_RIGHT
                : WORLD_UP;

        screenRight.copy(referenceAxis).cross(cameraDirection).normalize();
        screenUp.copy(cameraDirection).cross(screenRight).normalize();

        const precession = elapsed * ORBIT_PRECESSION_SPEED;
        const viewAngle =
            ORBIT_VIEW_ANGLE +
            Math.sin(elapsed * ORBIT_TILT_WOBBLE_SPEED) * ORBIT_VIEW_WOBBLE;

        majorAxisDirection
            .copy(screenRight)
            .multiplyScalar(Math.cos(precession))
            .addScaledVector(screenUp, Math.sin(precession))
            .normalize();

        planePerpendicular
            .copy(screenRight)
            .multiplyScalar(-Math.sin(precession))
            .addScaledVector(screenUp, Math.cos(precession))
            .normalize();

        orbitNormal
            .copy(cameraDirection)
            .multiplyScalar(Math.cos(viewAngle))
            .addScaledVector(planePerpendicular, Math.sin(viewAngle))
            .normalize();

        minorAxisDirection
            .crossVectors(orbitNormal, majorAxisDirection)
            .normalize();

        const positions = orbitGeometry.attributes.position
            .array as Float32Array;
        for (let index = 0; index < ORBIT_SEGMENTS; index += 1) {
            const angle = (index / ORBIT_SEGMENTS) * Math.PI * 2;
            orbitPoint
                .copy(majorAxisDirection)
                .multiplyScalar(Math.cos(angle) * ORBIT_RADIUS_X)
                .addScaledVector(
                    minorAxisDirection,
                    Math.sin(angle) * ORBIT_RADIUS_Y
                );

            const offset = index * 3;
            positions[offset] = orbitPoint.x;
            positions[offset + 1] = orbitPoint.y;
            positions[offset + 2] = orbitPoint.z;
        }
        orbitGeometry.attributes.position.needsUpdate = true;

        if (electronRef.current) {
            const electronAngle = elapsed * ELECTRON_SPEED;
            electronRef.current.position
                .copy(majorAxisDirection)
                .multiplyScalar(Math.cos(electronAngle) * ORBIT_RADIUS_X)
                .addScaledVector(
                    minorAxisDirection,
                    Math.sin(electronAngle) * ORBIT_RADIUS_Y
                );
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight
                position={[-10, -10, -10]}
                color="#ef4444"
                intensity={2}
            />

            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <group>
                    <mesh ref={meshRef} scale={NUCLEUS_SCALE}>
                        <icosahedronGeometry args={[1, 1]} />
                        <meshStandardMaterial
                            color="#ef4444"
                            wireframe
                            transparent
                            opacity={0.3}
                        />
                    </mesh>

                    <lineLoop geometry={orbitGeometry}>
                        <lineBasicMaterial
                            color="#ef4444"
                            transparent
                            opacity={0.36}
                        />
                    </lineLoop>

                    <mesh ref={electronRef} scale={ELECTRON_BASE_SCALE}>
                        <icosahedronGeometry args={[1, 1]} />
                        <meshStandardMaterial
                            color="#ef4444"
                            wireframe
                            transparent
                            opacity={0.55}
                        />
                    </mesh>
                </group>
            </Float>

            <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />
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
