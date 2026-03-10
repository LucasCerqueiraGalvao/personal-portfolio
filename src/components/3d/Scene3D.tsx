import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useLocation } from "react-router-dom";
import * as THREE from "three";
import type { Group, LineBasicMaterial, Mesh, MeshStandardMaterial } from "three";
import { APP_ROUTES } from "../../config/routes";

type OrbitConfig = {
    radiusX: number;
    radiusY: number;
    speed: number;
    phase: number;
    tilt: [number, number, number];
    lineOpacity: number;
    electronScale: number;
};

type AtomScreenState = {
    x: number;
    y: number;
    radius: number;
};

const ORBITS: OrbitConfig[] = [
    {
        radiusX: 3.34,
        radiusY: 3.02,
        speed: 0.6,
        phase: 0,
        tilt: [0.22, 0.08, 0],
        lineOpacity: 0.36,
        electronScale: 0.08,
    },
    {
        radiusX: 2.9,
        radiusY: 2.5,
        speed: -0.82,
        phase: Math.PI / 2.7,
        tilt: [1.02, 0.34, 0.22],
        lineOpacity: 0.31,
        electronScale: 0.075,
    },
    {
        radiusX: 2.55,
        radiusY: 2.15,
        speed: 1.05,
        phase: Math.PI / 1.8,
        tilt: [-0.88, 0.5, -0.35],
        lineOpacity: 0.28,
        electronScale: 0.072,
    },
];

function OrbitPath({
    config,
    index,
    visibilityRef,
}: {
    config: OrbitConfig;
    index: number;
    visibilityRef: MutableRefObject<number>;
}) {
    const groupRef = useRef<Group>(null);
    const lineMaterialRef = useRef<LineBasicMaterial>(null);
    const electronRef = useRef<Mesh>(null);
    const electronMaterialRef = useRef<MeshStandardMaterial>(null);

    const geometry = useMemo(() => {
        const curve = new THREE.EllipseCurve(
            0,
            0,
            config.radiusX,
            config.radiusY,
            0,
            Math.PI * 2,
            false,
            0
        );

        const points = curve
            .getPoints(156)
            .map((point) => new THREE.Vector3(point.x, point.y, 0));

        return new THREE.BufferGeometry().setFromPoints(points);
    }, [config.radiusX, config.radiusY]);

    useFrame(({ clock }) => {
        const elapsed = clock.getElapsedTime();

        if (groupRef.current) {
            groupRef.current.rotation.x =
                config.tilt[0] + Math.sin(elapsed * 0.18 + index) * 0.04;
            groupRef.current.rotation.y =
                config.tilt[1] +
                elapsed * 0.06 * (index % 2 === 0 ? 1 : -1);
            groupRef.current.rotation.z =
                config.tilt[2] + Math.cos(elapsed * 0.14 + index) * 0.03;
        }

        if (electronRef.current) {
            const angle = elapsed * config.speed + config.phase;
            electronRef.current.position.set(
                Math.cos(angle) * config.radiusX,
                Math.sin(angle) * config.radiusY,
                0
            );
        }

        if (lineMaterialRef.current) {
            lineMaterialRef.current.opacity =
                config.lineOpacity * visibilityRef.current;
        }

        if (electronMaterialRef.current) {
            electronMaterialRef.current.opacity = 0.56 * visibilityRef.current;
        }
    });

    return (
        <group ref={groupRef}>
            <lineLoop geometry={geometry}>
                <lineBasicMaterial
                    ref={lineMaterialRef}
                    color="#ef4444"
                    transparent
                    opacity={config.lineOpacity}
                />
            </lineLoop>

            <mesh ref={electronRef} scale={config.electronScale}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    ref={electronMaterialRef}
                    color="#ef4444"
                    wireframe
                    transparent
                    opacity={0.56}
                />
            </mesh>
        </group>
    );
}

function SceneContent({
    isHome,
    atomScreenStateRef,
    spinTriggerRef,
}: {
    isHome: boolean;
    atomScreenStateRef: MutableRefObject<AtomScreenState>;
    spinTriggerRef: MutableRefObject<boolean>;
}) {
    const atomRootRef = useRef<Group>(null);
    const nucleusRef = useRef<Mesh>(null);
    const visibilityRef = useRef(1);
    const spinBurstRef = useRef(0);

    const desiredPosition = useMemo(() => new THREE.Vector3(), []);
    const projectedAtomPosition = useMemo(() => new THREE.Vector3(), []);

    useFrame(({ clock, mouse, camera, viewport, size }) => {
        const elapsed = clock.getElapsedTime();
        const isMobileViewport = viewport.width < 7.2;

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.95, 0.04);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 0.85, 0.04);
        camera.lookAt(0, 0, 0);

        if (!atomRootRef.current || !nucleusRef.current) {
            return;
        }

        if (spinTriggerRef.current) {
            spinBurstRef.current = 1;
            spinTriggerRef.current = false;
        }

        if (isHome) {
            desiredPosition.set(mouse.x * 0.55, mouse.y * 0.34, 0);
        } else {
            const dockX = viewport.width * (isMobileViewport ? 0.3 : 0.36);
            const dockY = viewport.height * (isMobileViewport ? 0.33 : 0.31);
            desiredPosition.set(dockX, dockY + Math.sin(elapsed * 1.2) * 0.04, -1.1);
        }

        atomRootRef.current.position.lerp(desiredPosition, isHome ? 0.055 : 0.085);

        const targetScale = isHome ? 1 : isMobileViewport ? 0.3 : 0.22;
        const nextScale = THREE.MathUtils.lerp(
            atomRootRef.current.scale.x,
            targetScale,
            isHome ? 0.055 : 0.09
        );
        atomRootRef.current.scale.setScalar(nextScale);

        if (isHome) {
            atomRootRef.current.rotation.y = THREE.MathUtils.lerp(
                atomRootRef.current.rotation.y,
                mouse.x * 0.28,
                0.05
            );
            atomRootRef.current.rotation.x = THREE.MathUtils.lerp(
                atomRootRef.current.rotation.x,
                -mouse.y * 0.2,
                0.05
            );
        } else {
            atomRootRef.current.rotation.y += 0.008;
            atomRootRef.current.rotation.x += 0.004;
        }

        if (spinBurstRef.current > 0.001) {
            atomRootRef.current.rotation.y += spinBurstRef.current * 0.44;
            atomRootRef.current.rotation.x += spinBurstRef.current * 0.22;
            spinBurstRef.current = Math.max(0, spinBurstRef.current - 0.05);
        }

        const targetVisibility = isHome ? 1 : 0.86;
        visibilityRef.current = THREE.MathUtils.lerp(
            visibilityRef.current,
            targetVisibility,
            0.08
        );

        nucleusRef.current.rotation.x = elapsed * 0.2;
        nucleusRef.current.rotation.y = elapsed * 0.3;

        projectedAtomPosition.copy(atomRootRef.current.position).project(camera);
        atomScreenStateRef.current = {
            x: (projectedAtomPosition.x * 0.5 + 0.5) * size.width,
            y: (-projectedAtomPosition.y * 0.5 + 0.5) * size.height,
            radius: (isHome ? 132 : 54) * atomRootRef.current.scale.x,
        };
    });

    return (
        <>
            <ambientLight intensity={0.48} />
            <pointLight position={[9, 7, 8]} intensity={0.92} color="#fda4af" />
            <pointLight position={[-9, -7, -8]} color="#ef4444" intensity={1.9} />

            <group ref={atomRootRef}>
                <mesh ref={nucleusRef} scale={1.5}>
                    <icosahedronGeometry args={[1, 1]} />
                    <meshStandardMaterial
                        color="#ef4444"
                        wireframe
                        transparent
                        opacity={0.32}
                    />
                </mesh>

                {ORBITS.map((config, index) => (
                    <OrbitPath
                        key={`orbit-${index}`}
                        config={config}
                        index={index}
                        visibilityRef={visibilityRef}
                    />
                ))}
            </group>

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

function Scene3D() {
    const location = useLocation();
    const atomScreenStateRef = useRef<AtomScreenState>({
        x: -9999,
        y: -9999,
        radius: 0,
    });
    const spinTriggerRef = useRef(false);
    const isHome =
        location.pathname === APP_ROUTES.about || location.pathname === "/";

    useEffect(() => {
        const handlePointerDown = (event: PointerEvent) => {
            const { x, y, radius } = atomScreenStateRef.current;

            if (radius <= 0) {
                return;
            }

            const dx = event.clientX - x;
            const dy = event.clientY - y;

            if (dx * dx + dy * dy <= radius * radius) {
                spinTriggerRef.current = true;
            }
        };

        window.addEventListener("pointerdown", handlePointerDown, {
            passive: true,
        });

        return () => {
            window.removeEventListener("pointerdown", handlePointerDown);
        };
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 -z-10">
            <Canvas gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <SceneContent
                    isHome={isHome}
                    atomScreenStateRef={atomScreenStateRef}
                    spinTriggerRef={spinTriggerRef}
                />
            </Canvas>
        </div>
    );
}

export default Scene3D;
