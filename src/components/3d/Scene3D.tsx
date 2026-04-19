import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import type {
    BufferAttribute,
    BufferGeometry,
    Group,
    Mesh,
    PointLight,
    Sprite,
    Texture,
} from "three";

import { withBasePath } from "../../utils/withBasePath";

type BodyKind = "star" | "planet";

type BodyConfig = {
    name: string;
    kind: BodyKind;
    mass: number;
    radius: number;
    color: string;
    emissive: string;
    glow: string;
    trail: string;
    glowScale: number;
    lightIntensity: number;
    textureSeed: number;
    spinSpeed: number;
};

type SimBody = {
    config: BodyConfig;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    acceleration: THREE.Vector3;
    trail: THREE.Vector3[];
};

type TrailGeometry = {
    geometry: BufferGeometry;
    position: BufferAttribute;
    color: BufferAttribute;
};

type DragState = {
    currentX: number;
    currentY: number;
    targetX: number;
    targetY: number;
    velocityX: number;
    velocityY: number;
    dragging: boolean;
    lastX: number;
    lastY: number;
};

type SeedState = {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
};

const WALLPAPER_CONFIG = {
    stepMs: 0.75,
    kg: 1000,
    ras: 0.1,
    kSoft: 2.8,
    hardConstraint: true,
    re: 0.1,
    rc: 0.2,
    Rc: 2.1,
    escapeDistance: 4,
    fov: 40,
    cameraDistance: 2.4519999,
    randomPositionRange: 2,
    randomVelocityRange: 0.1,
    constraintMass: 15_000_000,
    constraintK1: 0,
    constraintK2: 0.5,
    constraintN: 2,
    fixedSeed: 3509243656,
    timeScale: 1,
};

const BODY_CONFIGS: BodyConfig[] = [
    {
        name: "Star 1",
        kind: "star",
        mass: 5_000_000,
        radius: 0.03,
        color: "#fff6df",
        emissive: "#ffd5ad",
        glow: "#ffb075",
        trail: "#fff4de",
        glowScale: 2.78,
        lightIntensity: 2.1,
        textureSeed: 17,
        spinSpeed: 0.2,
    },
    {
        name: "Star 2",
        kind: "star",
        mass: 5_000_000,
        radius: 0.023,
        color: "#ffd0b0",
        emissive: "#ff865d",
        glow: "#ff704c",
        trail: "#ffc081",
        glowScale: 2.38,
        lightIntensity: 1.8,
        textureSeed: 41,
        spinSpeed: -0.26,
    },
    {
        name: "Star 3",
        kind: "star",
        mass: 5_000_000,
        radius: 0.016,
        color: "#ff9a77",
        emissive: "#ff4f42",
        glow: "#ff473d",
        trail: "#ff8d76",
        glowScale: 2.12,
        lightIntensity: 1.55,
        textureSeed: 73,
        spinSpeed: 0.32,
    },
    {
        name: "Planet",
        kind: "planet",
        mass: 5_000,
        radius: 0.011,
        color: "#418dff",
        emissive: "#123bff",
        glow: "#6eb8ff",
        trail: "#69a7ff",
        glowScale: 0.82,
        lightIntensity: 0.16,
        textureSeed: 109,
        spinSpeed: 0.55,
    },
];

const STAR_MASS = BODY_CONFIGS[0].mass;
const FIXED_TIMESTEP = WALLPAPER_CONFIG.stepMs / 1000;
const TRAIL_LENGTH = 620;
const TRAIL_OPACITY = 0.52;
const SCENE_SCALE = 2.18;
const MAX_FIXED_STEPS = 34;
const CAMERA_Z = 6.8 + WALLPAPER_CONFIG.cameraDistance;
const MIN_DISTANCE = 1e-5;
const GALAXY_TEXTURE_URL = withBasePath("/images/wallpaper/milky-way-8k.jpg");
const BACKGROUND_IMAGE_ASPECT = 2;
const BACKGROUND_PLANE_Z = -38;
const BACKGROUND_FRAME_SCALE = 1.7;
const BACKGROUND_VERTICAL_BIAS = -0.3;
const BACKGROUND_TEXTURE_ZOOM = 0.68;
const BACKGROUND_TEXTURE_REPEAT = BACKGROUND_TEXTURE_ZOOM * BACKGROUND_FRAME_SCALE;
const BACKGROUND_TEXTURE_FRAME_OFFSET =
    (BACKGROUND_TEXTURE_ZOOM - BACKGROUND_TEXTURE_REPEAT) / 2;
const BACKGROUND_TEXTURE_OFFSET_X = 0.16;
const BACKGROUND_TEXTURE_OFFSET_Y = 0.0;
const BACKGROUND_ROTATION_FOLLOW = 0.32;
const BACKGROUND_VERTICAL_FOLLOW = 0.035;
const BACKGROUND_MIN_VERTICAL_OFFSET = 0;
const BACKGROUND_MAX_VERTICAL_OFFSET = 1 - BACKGROUND_TEXTURE_ZOOM;

const YOSHIDA = {
    w1: 1.35120719196,
    w0: -1.70241438392,
};

const YOSHIDA_COEFFICIENTS = {
    c1: YOSHIDA.w1 / 2,
    c2: (YOSHIDA.w0 + YOSHIDA.w1) / 2,
    c3: (YOSHIDA.w0 + YOSHIDA.w1) / 2,
    c4: YOSHIDA.w1 / 2,
    d1: YOSHIDA.w1,
    d2: YOSHIDA.w0,
    d3: YOSHIDA.w1,
};

const G_SIM =
    (WALLPAPER_CONFIG.kg / 1000) *
    6.67430e-11 *
    (1e30 / 5e6) *
    Math.pow(60 * 60 * 24 * 365, 2) /
    Math.pow(1e12, 3);

function mulberry32(seed: number) {
    let state = seed >>> 0;

    return () => {
        state += 0x6d2b79f5;
        let value = Math.imul(state ^ (state >>> 15), 1 | state);
        value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);

        return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
}

function colorToRgb(color: string) {
    const parsed = new THREE.Color(color);

    return {
        r: Math.round(parsed.r * 255),
        g: Math.round(parsed.g * 255),
        b: Math.round(parsed.b * 255),
    };
}

function colorToRgba(color: string, alpha: number) {
    const { r, g, b } = colorToRgb(color);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function makeGlowTexture() {
    const size = 256;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = size;
    canvas.height = size;

    if (!context) {
        return new THREE.Texture();
    }

    const center = size / 2;
    const gradient = context.createRadialGradient(
        center,
        center,
        0,
        center,
        center,
        center
    );

    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.12, "rgba(255, 255, 255, 0.76)");
    gradient.addColorStop(0.32, "rgba(255, 92, 56, 0.25)");
    gradient.addColorStop(1, "rgba(255, 92, 56, 0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    context.globalCompositeOperation = "screen";
    context.strokeStyle = "rgba(255, 255, 255, 0.42)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, center);
    context.lineTo(size, center);
    context.moveTo(center, 0);
    context.lineTo(center, size);
    context.stroke();

    context.strokeStyle = "rgba(255, 170, 120, 0.18)";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(34, 34);
    context.lineTo(size - 34, size - 34);
    context.moveTo(size - 34, 34);
    context.lineTo(34, size - 34);
    context.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    return texture;
}

function makeStarTexture(config: BodyConfig) {
    const size = 512;
    const random = mulberry32(config.textureSeed);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = size;
    canvas.height = size;

    if (!context) {
        return new THREE.Texture();
    }

    context.fillStyle = config.color;
    context.fillRect(0, 0, size, size);

    const gradient = context.createRadialGradient(
        size * 0.42,
        size * 0.38,
        size * 0.08,
        size / 2,
        size / 2,
        size * 0.72
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.34, config.color);
    gradient.addColorStop(0.72, config.emissive);
    gradient.addColorStop(1, "#44120d");

    context.globalAlpha = 0.92;
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    context.globalCompositeOperation = "overlay";

    for (let i = 0; i < 180; i += 1) {
        const x = random() * size;
        const y = random() * size;
        const radius = 4 + random() * 34;
        const alpha = 0.04 + random() * 0.18;

        context.fillStyle =
            random() > 0.5
                ? colorToRgba(config.glow, alpha)
                : `rgba(255, 255, 255, ${alpha})`;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
    }

    context.globalCompositeOperation = "screen";

    for (let i = 0; i < 70; i += 1) {
        context.strokeStyle = colorToRgba(config.glow, 0.05 + random() * 0.13);
        context.lineWidth = 1 + random() * 3;
        context.beginPath();
        const y = random() * size;
        context.moveTo(0, y);

        for (let x = 0; x <= size; x += 48) {
            context.lineTo(x, y + Math.sin(x * 0.02 + random() * 6) * 18);
        }

        context.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return texture;
}

function makePlanetTexture(config: BodyConfig) {
    const size = 512;
    const random = mulberry32(config.textureSeed);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = size;
    canvas.height = size;

    if (!context) {
        return new THREE.Texture();
    }

    const gradient = context.createRadialGradient(
        size * 0.36,
        size * 0.34,
        size * 0.05,
        size / 2,
        size / 2,
        size * 0.72
    );

    gradient.addColorStop(0, "#bde1ff");
    gradient.addColorStop(0.28, config.color);
    gradient.addColorStop(0.72, "#153cff");
    gradient.addColorStop(1, "#071039");

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    context.globalCompositeOperation = "source-over";

    for (let i = 0; i < 34; i += 1) {
        const x = random() * size;
        const y = random() * size;
        const width = 38 + random() * 120;
        const height = 14 + random() * 50;

        context.fillStyle =
            random() > 0.48
                ? `rgba(34, 198, 154, ${0.16 + random() * 0.18})`
                : `rgba(9, 28, 98, ${0.2 + random() * 0.22})`;
        context.beginPath();
        context.ellipse(x, y, width, height, random() * Math.PI, 0, Math.PI * 2);
        context.fill();
    }

    context.globalCompositeOperation = "screen";

    for (let i = 0; i < 18; i += 1) {
        const y = size * (0.22 + random() * 0.58);

        context.strokeStyle = `rgba(220, 240, 255, ${0.07 + random() * 0.12})`;
        context.lineWidth = 4 + random() * 10;
        context.beginPath();
        context.moveTo(0, y);

        for (let x = 0; x <= size; x += 40) {
            context.lineTo(x, y + Math.sin(x * 0.014 + random() * 8) * 16);
        }

        context.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return texture;
}

function makeBodyTexture(config: BodyConfig) {
    return config.kind === "star"
        ? makeStarTexture(config)
        : makePlanetTexture(config);
}

function makeTrailGeometries(): TrailGeometry[] {
    return BODY_CONFIGS.map(() => {
        const geometry = new THREE.BufferGeometry();
        const position = new THREE.BufferAttribute(
            new Float32Array(TRAIL_LENGTH * 3),
            3
        );
        const color = new THREE.BufferAttribute(
            new Float32Array(TRAIL_LENGTH * 3),
            3
        );

        geometry.setAttribute("position", position);
        geometry.setAttribute("color", color);
        geometry.setDrawRange(0, 0);
        geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 80);

        return { geometry, position, color };
    });
}

function constraintAccelerationMagnitude(distance: number) {
    const {
        hardConstraint,
        constraintK1,
        constraintK2,
        constraintMass,
        constraintN,
        re,
        rc,
        Rc,
    } = WALLPAPER_CONFIG;

    if (hardConstraint) {
        if (distance <= re) {
            return (
                -constraintK1 *
                G_SIM *
                constraintMass *
                Math.pow(1 - Math.pow(distance / re, 2), 2)
            );
        }

        if (distance <= rc) {
            return 0;
        }

        if (distance < Rc) {
            const delta = distance - rc;
            const denominator = Math.sqrt(Math.max(Rc * Rc - delta * delta, MIN_DISTANCE));

            return (constraintK2 * G_SIM * constraintMass * delta) / denominator;
        }

        return 100 * constraintK2 * G_SIM * constraintMass;
    }

    if (distance <= re) {
        return (
            -constraintK1 *
            G_SIM *
            constraintMass *
            Math.pow(1 - Math.pow(distance / re, 2), 2)
        );
    }

    if (distance > rc) {
        return (
            constraintK2 *
            G_SIM *
            constraintMass *
            Math.pow(distance - rc, constraintN)
        );
    }

    return 0;
}

function makeStableSeedStates(): SeedState[] {
    const random = mulberry32(WALLPAPER_CONFIG.fixedSeed);
    const baseRadius = WALLPAPER_CONFIG.randomPositionRange * 0.39;
    const sideLength = baseRadius * Math.sqrt(3);
    const gravityAcceleration =
        (Math.sqrt(3) * G_SIM * STAR_MASS) / Math.max(sideLength * sideLength, MIN_DISTANCE);
    const cageAcceleration = Math.max(0, constraintAccelerationMagnitude(baseRadius));
    const circularSpeed = Math.sqrt((gravityAcceleration + cageAcceleration) * baseRadius);
    const states: SeedState[] = [];

    for (let index = 0; index < 3; index += 1) {
        const angle = index * ((Math.PI * 2) / 3) + (random() - 0.5) * 0.035;
        const radius = baseRadius * (1 + (random() - 0.5) * 0.035);
        const z = (random() - 0.5) * 0.08;
        const position = new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            z
        );
        const tangent = new THREE.Vector3(
            -Math.sin(angle),
            Math.cos(angle),
            (random() - 0.5) * 0.05
        ).normalize();
        const speed = circularSpeed * (1 + (random() - 0.5) * 0.04);

        states.push({
            position,
            velocity: tangent.multiplyScalar(speed),
        });
    }

    const planetAngle = Math.PI * (0.18 + random() * 0.36);
    const planetRadius = baseRadius * (0.42 + random() * 0.12);
    const planetPosition = new THREE.Vector3(
        Math.cos(planetAngle) * planetRadius,
        Math.sin(planetAngle) * planetRadius,
        0.28 + (random() - 0.5) * 0.08
    );
    const planetVelocity = new THREE.Vector3(
        -Math.sin(planetAngle),
        Math.cos(planetAngle),
        -0.08 + (random() - 0.5) * WALLPAPER_CONFIG.randomVelocityRange
    )
        .normalize()
        .multiplyScalar(circularSpeed * 1.18);

    states.push({
        position: planetPosition,
        velocity: planetVelocity,
    });

    centerSeedStates(states);

    return states;
}

function centerSeedStates(states: SeedState[]) {
    const totalMass = BODY_CONFIGS.reduce((total, config) => total + config.mass, 0);
    const center = new THREE.Vector3();
    const velocityCenter = new THREE.Vector3();

    states.forEach((state, index) => {
        const mass = BODY_CONFIGS[index].mass;
        center.addScaledVector(state.position, mass);
        velocityCenter.addScaledVector(state.velocity, mass);
    });

    center.divideScalar(totalMass);
    velocityCenter.divideScalar(totalMass);

    states.forEach((state) => {
        state.position.sub(center);
        state.velocity.sub(velocityCenter);
    });
}

function makeBodies(): SimBody[] {
    const seedStates = makeStableSeedStates();

    return BODY_CONFIGS.map((config, index) => ({
        config,
        position: seedStates[index].position.clone(),
        velocity: seedStates[index].velocity.clone(),
        acceleration: new THREE.Vector3(),
        trail: [],
    }));
}

function resetBodies(bodies: SimBody[]) {
    const seedStates = makeStableSeedStates();

    bodies.forEach((body, index) => {
        body.position.copy(seedStates[index].position);
        body.velocity.copy(seedStates[index].velocity);
        body.acceleration.set(0, 0, 0);
        body.trail.length = 0;
    });
}

function computeCenterOfMass(bodies: SimBody[], target: THREE.Vector3) {
    let totalMass = 0;

    target.set(0, 0, 0);

    bodies.forEach((body) => {
        totalMass += body.config.mass;
        target.addScaledVector(body.position, body.config.mass);
    });

    target.divideScalar(totalMass || 1);

    return target;
}

function centerPhysicsState(bodies: SimBody[]) {
    const center = new THREE.Vector3();
    const velocityCenter = new THREE.Vector3();
    let totalMass = 0;

    bodies.forEach((body) => {
        totalMass += body.config.mass;
        center.addScaledVector(body.position, body.config.mass);
        velocityCenter.addScaledVector(body.velocity, body.config.mass);
    });

    center.divideScalar(totalMass || 1);
    velocityCenter.divideScalar(totalMass || 1);

    bodies.forEach((body) => {
        body.position.sub(center);
        body.velocity.sub(velocityCenter);
    });
}

function addPairAcceleration(
    source: SimBody,
    target: SimBody,
    acceleration: THREE.Vector3
) {
    const offset = new THREE.Vector3().subVectors(target.position, source.position);
    const rawDistance = offset.length();

    if (rawDistance < MIN_DISTANCE) {
        return;
    }

    const distance = Math.max(rawDistance, MIN_DISTANCE);
    const direction = offset.multiplyScalar(1 / rawDistance);
    const { ras, kSoft } = WALLPAPER_CONFIG;
    const kRas = kSoft * ras;
    const beta = 3 / (kSoft - 1);
    const alpha = 1 - beta;
    let magnitude = 0;

    if (distance <= ras) {
        magnitude = (G_SIM * target.config.mass * distance) / Math.pow(ras, 3);
    } else if (distance < kRas) {
        const factor = alpha + beta * (distance / ras);
        magnitude = (factor * G_SIM * target.config.mass) / (distance * distance);
    } else {
        magnitude = (G_SIM * target.config.mass) / (distance * distance);
    }

    acceleration.addScaledVector(direction, magnitude);
}

function addConstraintAcceleration(
    body: SimBody,
    center: THREE.Vector3,
    acceleration: THREE.Vector3
) {
    const offset = new THREE.Vector3().subVectors(body.position, center);
    const distance = offset.length();

    if (distance < MIN_DISTANCE) {
        return;
    }

    const magnitude = constraintAccelerationMagnitude(distance);

    acceleration.addScaledVector(offset, -magnitude / distance);
}

function computeAccelerations(bodies: SimBody[]) {
    const center = new THREE.Vector3();

    computeCenterOfMass(bodies, center);

    bodies.forEach((body, index) => {
        body.acceleration.set(0, 0, 0);

        bodies.forEach((target, targetIndex) => {
            if (index !== targetIndex) {
                addPairAcceleration(body, target, body.acceleration);
            }
        });

        addConstraintAcceleration(body, center, body.acceleration);
    });
}

function drift(bodies: SimBody[], coefficient: number, delta: number) {
    bodies.forEach((body) => {
        body.position.addScaledVector(body.velocity, coefficient * delta);
    });
}

function kick(bodies: SimBody[], coefficient: number, delta: number) {
    computeAccelerations(bodies);

    bodies.forEach((body) => {
        body.velocity.addScaledVector(body.acceleration, coefficient * delta);
    });
}

function yoshidaStep(bodies: SimBody[], delta: number) {
    drift(bodies, YOSHIDA_COEFFICIENTS.c1, delta);
    kick(bodies, YOSHIDA_COEFFICIENTS.d1, delta);
    drift(bodies, YOSHIDA_COEFFICIENTS.c2, delta);
    kick(bodies, YOSHIDA_COEFFICIENTS.d2, delta);
    drift(bodies, YOSHIDA_COEFFICIENTS.c3, delta);
    kick(bodies, YOSHIDA_COEFFICIENTS.d3, delta);
    drift(bodies, YOSHIDA_COEFFICIENTS.c4, delta);
    centerPhysicsState(bodies);
}

function systemNeedsReset(bodies: SimBody[]) {
    return bodies.some((body) => {
        const distance = body.position.length();
        const speed = body.velocity.length();

        return (
            !Number.isFinite(distance) ||
            !Number.isFinite(speed) ||
            distance > WALLPAPER_CONFIG.escapeDistance * 1.28 ||
            speed > 12
        );
    });
}

function isInteractiveTarget(target: EventTarget | null) {
    if (!(target instanceof Element)) {
        return false;
    }

    return Boolean(
        target.closest(
            "a, button, input, select, textarea, summary, [role='button'], [role='link'], [contenteditable='true']"
        )
    );
}

function updateTrailGeometry(body: SimBody, trail: TrailGeometry) {
    body.trail.push(body.position.clone());

    if (body.trail.length > TRAIL_LENGTH) {
        body.trail.shift();
    }

    const positionArray = trail.position.array as Float32Array;
    const colorArray = trail.color.array as Float32Array;
    const baseColor = new THREE.Color(body.config.trail);

    body.trail.forEach((point, index) => {
        const offset = index * 3;
        const normalized = body.trail.length <= 1 ? 1 : index / (body.trail.length - 1);
        const intensity = Math.pow(normalized, 1.85);

        positionArray[offset] = point.x * SCENE_SCALE;
        positionArray[offset + 1] = point.y * SCENE_SCALE;
        positionArray[offset + 2] = point.z * SCENE_SCALE;
        colorArray[offset] = baseColor.r * intensity;
        colorArray[offset + 1] = baseColor.g * intensity;
        colorArray[offset + 2] = baseColor.b * intensity;
    });

    for (let index = body.trail.length; index < TRAIL_LENGTH; index += 1) {
        const offset = index * 3;

        positionArray[offset] = 0;
        positionArray[offset + 1] = 0;
        positionArray[offset + 2] = 0;
        colorArray[offset] = 0;
        colorArray[offset + 1] = 0;
        colorArray[offset + 2] = 0;
    }

    trail.geometry.setDrawRange(0, body.trail.length);
    trail.position.needsUpdate = true;
    trail.color.needsUpdate = true;
}

function TrailLine({ trail, index }: { trail: TrailGeometry; index: number }) {
    const line = useMemo(() => {
        const material = new THREE.LineBasicMaterial({
            transparent: true,
            opacity: BODY_CONFIGS[index].kind === "planet" ? 0.56 : TRAIL_OPACITY,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true,
            toneMapped: false,
        });

        return new THREE.Line(trail.geometry, material);
    }, [index, trail.geometry]);

    return <primitive object={line} />;
}

function OriginalSkyboxBackdrop({
    dragStateRef,
}: {
    dragStateRef: MutableRefObject<DragState>;
}) {
    const { camera, gl, size } = useThree();
    const galaxyTexture = useLoader(THREE.TextureLoader, GALAXY_TEXTURE_URL);
    const planeFrame = useMemo(() => {
        const perspectiveCamera = camera as THREE.PerspectiveCamera;
        const aspect = size.width / Math.max(size.height, 1);
        const distance = Math.abs(perspectiveCamera.position.z - BACKGROUND_PLANE_Z);
        const viewHeight =
            2 * Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov) / 2) * distance;
        const viewWidth = viewHeight * aspect;
        const coverHeight =
            Math.max(viewHeight, viewWidth / BACKGROUND_IMAGE_ASPECT) *
            BACKGROUND_FRAME_SCALE;
        const coverWidth = coverHeight * BACKGROUND_IMAGE_ASPECT;

        return {
            width: coverWidth,
            height: coverHeight,
            y: viewHeight * BACKGROUND_VERTICAL_BIAS,
        };
    }, [camera, size.height, size.width]);

    useEffect(() => {
        galaxyTexture.colorSpace = THREE.SRGBColorSpace;
        galaxyTexture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
        galaxyTexture.wrapS = THREE.RepeatWrapping;
        galaxyTexture.wrapT = THREE.RepeatWrapping;
        galaxyTexture.repeat.set(BACKGROUND_TEXTURE_REPEAT, BACKGROUND_TEXTURE_REPEAT);
        galaxyTexture.offset.set(
            BACKGROUND_TEXTURE_OFFSET_X + BACKGROUND_TEXTURE_FRAME_OFFSET,
            BACKGROUND_TEXTURE_OFFSET_Y + BACKGROUND_TEXTURE_FRAME_OFFSET
        );
        galaxyTexture.needsUpdate = true;
    }, [galaxyTexture, gl]);

    useFrame(() => {
        const dragState = dragStateRef.current;
        const horizontalOffset =
            BACKGROUND_TEXTURE_OFFSET_X +
            BACKGROUND_TEXTURE_FRAME_OFFSET +
            (dragState.currentY / (Math.PI * 2)) * BACKGROUND_ROTATION_FOLLOW;
        const verticalOffset = THREE.MathUtils.clamp(
            BACKGROUND_TEXTURE_OFFSET_Y -
            dragState.currentX * BACKGROUND_VERTICAL_FOLLOW,
            BACKGROUND_MIN_VERTICAL_OFFSET,
            BACKGROUND_MAX_VERTICAL_OFFSET
        ) + BACKGROUND_TEXTURE_FRAME_OFFSET;

        galaxyTexture.offset.x = THREE.MathUtils.euclideanModulo(horizontalOffset, 1);
        galaxyTexture.offset.y = verticalOffset;
    });

    return (
        <mesh
            renderOrder={-20}
            position={[0, planeFrame.y, BACKGROUND_PLANE_Z]}
            scale={[planeFrame.width, planeFrame.height, 1]}
        >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
                map={galaxyTexture}
                color="#ffffff"
                fog={false}
                depthTest={false}
                depthWrite={false}
            />
        </mesh>
    );
}

function ThreeBodyWallpaper({
    dragStateRef,
}: {
    dragStateRef: MutableRefObject<DragState>;
}) {
    const rootRef = useRef<Group>(null);
    const bodyRefs = useRef<Array<Mesh | null>>([]);
    const glowRefs = useRef<Array<Sprite | null>>([]);
    const lightRefs = useRef<Array<PointLight | null>>([]);
    const bodiesRef = useRef<SimBody[]>(makeBodies());
    const accumulatorRef = useRef(0);
    const frameRef = useRef(0);
    const trails = useMemo(makeTrailGeometries, []);
    const glowTexture = useMemo(makeGlowTexture, []);
    const bodyTextures = useMemo(
        () => BODY_CONFIGS.map((config) => makeBodyTexture(config)),
        []
    );

    useFrame(({ clock, camera }, delta) => {
        const elapsed = clock.getElapsedTime();
        const dragState = dragStateRef.current;
        const bodies = bodiesRef.current;
        const safeDelta = Math.min(delta, 0.05) * WALLPAPER_CONFIG.timeScale;
        let steps = 0;

        accumulatorRef.current += safeDelta;

        while (accumulatorRef.current >= FIXED_TIMESTEP && steps < MAX_FIXED_STEPS) {
            yoshidaStep(bodies, FIXED_TIMESTEP);
            accumulatorRef.current -= FIXED_TIMESTEP;
            steps += 1;
        }

        if (steps === MAX_FIXED_STEPS) {
            accumulatorRef.current = 0;
        }

        if (systemNeedsReset(bodies)) {
            resetBodies(bodies);
            accumulatorRef.current = 0;
        }

        if (!dragState.dragging) {
            dragState.targetY += delta * 0.035 + dragState.velocityY;
            dragState.targetX = THREE.MathUtils.clamp(
                dragState.targetX + dragState.velocityX,
                -1.08,
                1.08
            );
            dragState.velocityX *= 0.92;
            dragState.velocityY *= 0.92;
        }

        dragState.currentX = THREE.MathUtils.lerp(
            dragState.currentX,
            dragState.targetX,
            0.13
        );
        dragState.currentY = THREE.MathUtils.lerp(
            dragState.currentY,
            dragState.targetY,
            0.13
        );

        if (rootRef.current) {
            rootRef.current.rotation.x =
                dragState.currentX + Math.sin(elapsed * 0.15) * 0.018;
            rootRef.current.rotation.y = dragState.currentY;
            rootRef.current.rotation.z = Math.sin(elapsed * 0.08) * 0.014;
        }

        camera.position.z = THREE.MathUtils.lerp(camera.position.z, CAMERA_Z, 0.08);
        camera.lookAt(0, 0, 0);

        frameRef.current += 1;

        bodies.forEach((body, index) => {
            const x = body.position.x * SCENE_SCALE;
            const y = body.position.y * SCENE_SCALE;
            const z = body.position.z * SCENE_SCALE;
            const pulse =
                body.config.kind === "planet"
                    ? 1 + Math.sin(elapsed * 1.7 + index) * 0.025
                    : 1 + Math.sin(elapsed * 2.2 + index * 1.3) * 0.065;
            const visualRadius = Math.max(
                body.config.kind === "planet" ? 0.07 : 0.105,
                body.config.radius * 5.8
            );
            const glowSize = body.config.glowScale * pulse;
            const mesh = bodyRefs.current[index];

            mesh?.position.set(x, y, z);
            mesh?.scale.setScalar(visualRadius * pulse);

            if (mesh) {
                mesh.rotation.y += delta * body.config.spinSpeed;
                mesh.rotation.x += delta * body.config.spinSpeed * 0.23;
            }

            glowRefs.current[index]?.position.set(x, y, z);
            glowRefs.current[index]?.scale.set(glowSize, glowSize, glowSize);
            lightRefs.current[index]?.position.set(x, y, z);

            if (frameRef.current % 2 === 0) {
                updateTrailGeometry(body, trails[index]);
            }
        });
    });

    return (
        <>
            <OriginalSkyboxBackdrop dragStateRef={dragStateRef} />

            <group ref={rootRef} rotation={[-0.16, 0.36, 0]}>
                {trails.map((trail, index) => (
                    <TrailLine
                        key={`trail-${BODY_CONFIGS[index].name}`}
                        trail={trail}
                        index={index}
                    />
                ))}

                {BODY_CONFIGS.map((body, index) => (
                    <group key={body.name}>
                        <sprite ref={(node) => { glowRefs.current[index] = node; }}>
                            <spriteMaterial
                                map={glowTexture}
                                color={body.glow}
                                transparent
                                opacity={body.kind === "planet" ? 0.36 : 0.74}
                                blending={THREE.AdditiveBlending}
                                depthWrite={false}
                                depthTest={false}
                                toneMapped={false}
                            />
                        </sprite>

                        <mesh ref={(node) => { bodyRefs.current[index] = node; }}>
                            <sphereGeometry args={[1, 48, 48]} />
                            <meshStandardMaterial
                                map={bodyTextures[index] as Texture}
                                emissiveMap={body.kind === "star" ? bodyTextures[index] : null}
                                color={body.color}
                                emissive={body.emissive}
                                emissiveIntensity={body.kind === "planet" ? 0.7 : 2.8}
                                roughness={body.kind === "planet" ? 0.52 : 0.22}
                                metalness={0}
                                toneMapped={false}
                            />
                        </mesh>

                        <pointLight
                            ref={(node) => { lightRefs.current[index] = node; }}
                            color={body.emissive}
                            intensity={body.lightIntensity}
                            distance={body.kind === "planet" ? 3.2 : 7.6}
                            decay={2}
                        />
                    </group>
                ))}
            </group>
        </>
    );
}

function Scene3D() {
    const dragStateRef = useRef<DragState>({
        currentX: -0.16,
        currentY: 0.36,
        targetX: -0.16,
        targetY: 0.36,
        velocityX: 0,
        velocityY: 0,
        dragging: false,
        lastX: 0,
        lastY: 0,
    });

    useEffect(() => {
        const handlePointerDown = (event: PointerEvent) => {
            if (event.button !== 0 || isInteractiveTarget(event.target)) {
                return;
            }

            dragStateRef.current.dragging = true;
            dragStateRef.current.velocityX = 0;
            dragStateRef.current.velocityY = 0;
            dragStateRef.current.lastX = event.clientX;
            dragStateRef.current.lastY = event.clientY;
        };

        const handlePointerMove = (event: PointerEvent) => {
            const dragState = dragStateRef.current;

            if (!dragState.dragging) {
                return;
            }

            const deltaX = event.clientX - dragState.lastX;
            const deltaY = event.clientY - dragState.lastY;

            dragState.targetY += deltaX * 0.0056;
            dragState.targetX = THREE.MathUtils.clamp(
                dragState.targetX + deltaY * 0.0048,
                -1.08,
                1.08
            );
            dragState.velocityY = deltaX * 0.0008;
            dragState.velocityX = deltaY * 0.00065;
            dragState.lastX = event.clientX;
            dragState.lastY = event.clientY;
        };

        const handlePointerUp = () => {
            dragStateRef.current.dragging = false;
        };

        window.addEventListener("pointerdown", handlePointerDown, {
            capture: true,
            passive: true,
        });
        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerup", handlePointerUp, { passive: true });
        window.addEventListener("pointercancel", handlePointerUp, { passive: true });

        return () => {
            window.removeEventListener("pointerdown", handlePointerDown, {
                capture: true,
            });
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointercancel", handlePointerUp);
        };
    }, []);

    return (
        <div className="three-body-wallpaper pointer-events-none fixed inset-0 -z-10">
            <Canvas
                dpr={[1, 1.7]}
                gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: "high-performance",
                }}
                onCreated={({ gl }) => {
                    gl.setClearColor("#000000", 0);
                }}
            >
                <PerspectiveCamera
                    makeDefault
                    fov={WALLPAPER_CONFIG.fov}
                    position={[0, 0, CAMERA_Z]}
                />
                <ambientLight intensity={0.09} />
                <fog attach="fog" args={["#000000", 10, 34]} />
                <ThreeBodyWallpaper dragStateRef={dragStateRef} />
            </Canvas>
        </div>
    );
}

export default Scene3D;
