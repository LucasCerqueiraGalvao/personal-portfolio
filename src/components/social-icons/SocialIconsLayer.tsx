import { motion, useAnimationControls } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { APP_ROUTES } from "../../config/routes";
import { profile } from "../../data/profile";
import { useSocialIconAnchors, type SocialKey } from "./useSocialIconAnchors";

type Point = {
    x: number;
    y: number;
};

type TargetMode = "contact" | "sidebar";

type SocialItem = {
    key: SocialKey;
    href: string;
    label: string;
    Icon: typeof FaLinkedin;
};

const SOCIAL_ITEMS: SocialItem[] = [
    {
        key: "linkedin",
        href: profile.social.linkedin,
        label: "LinkedIn",
        Icon: FaLinkedin,
    },
    {
        key: "github",
        href: profile.social.github,
        label: "GitHub",
        Icon: FaGithub,
    },
    {
        key: "email",
        href: profile.social.email,
        label: "Email",
        Icon: FaEnvelope,
    },
];

function getAnchorCenter(anchor: HTMLDivElement | null): Point | null {
    if (!anchor) {
        return null;
    }

    const rect = anchor.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
    };
}

function getFallbackPoint(mode: TargetMode, index: number): Point {
    if (mode === "contact") {
        return {
            x: window.innerWidth / 2 + (index - 1) * 56,
            y: Math.min(window.innerHeight - 86, window.innerHeight * 0.76),
        };
    }

    return {
        x: window.innerWidth - 42,
        y: window.innerHeight / 2 + (index - 1) * 56,
    };
}

function SocialIconsLayer() {
    const location = useLocation();
    const { sidebarAnchorsRef, contactAnchorsRef } = useSocialIconAnchors();
    const [isDesktop, setIsDesktop] = useState<boolean>(
        () => window.matchMedia("(min-width: 1280px)").matches
    );
    const [isTransientVisible, setIsTransientVisible] = useState(false);
    const hideTimeoutRef = useRef<number | null>(null);
    const isContactRoute =
        location.pathname === APP_ROUTES.reach || location.pathname === "/reach";

    const linkedinControls = useAnimationControls();
    const githubControls = useAnimationControls();
    const emailControls = useAnimationControls();

    const controls = useMemo(
        () => ({
            linkedin: linkedinControls,
            github: githubControls,
            email: emailControls,
        }),
        [emailControls, githubControls, linkedinControls]
    );

    const currentPointsRef = useRef<Record<SocialKey, Point>>({
        linkedin: { x: -120, y: -120 },
        github: { x: -120, y: -120 },
        email: { x: -120, y: -120 },
    });
    const hasInitializedRef = useRef(false);

    const getTargetPoint = useCallback(
        (mode: TargetMode, key: SocialKey, index: number): Point => {
            const anchorsRef =
                mode === "contact" ? contactAnchorsRef : sidebarAnchorsRef;
            return (
                getAnchorCenter(anchorsRef.current[key]) ??
                getFallbackPoint(mode, index)
            );
        },
        [contactAnchorsRef, sidebarAnchorsRef]
    );

    const setToMode = useCallback(
        (mode: TargetMode) => {
            SOCIAL_ITEMS.forEach(({ key }, index) => {
                const target = getTargetPoint(mode, key, index);
                currentPointsRef.current[key] = target;
                controls[key].set({ x: target.x, y: target.y, scale: 1 });
            });
        },
        [controls, getTargetPoint]
    );

    const animateToMode = useCallback(
        (mode: TargetMode) => {
            SOCIAL_ITEMS.forEach(({ key }, index) => {
                const start = currentPointsRef.current[key];
                const end = getTargetPoint(mode, key, index);
                const dx = end.x - start.x;
                const dy = end.y - start.y;
                const distance = Math.hypot(dx, dy) || 1;
                const normalX = -dy / distance;
                const normalY = dx / distance;
                const curveDirection = mode === "contact" ? 1 : -1;
                const curveStrength =
                    Math.min(160, Math.max(56, distance * 0.28)) * curveDirection;
                const mid = {
                    x: start.x + dx * 0.56 + normalX * curveStrength,
                    y: start.y + dy * 0.56 + normalY * curveStrength,
                };
                const sequenceIndex =
                    mode === "contact"
                        ? index
                        : SOCIAL_ITEMS.length - 1 - index;
                const easingCurve: Array<"easeIn" | "easeOut"> =
                    mode === "contact"
                        ? ["easeIn", "easeIn"]
                        : ["easeOut", "easeOut"];

                currentPointsRef.current[key] = end;
                controls[key].start({
                    x: [start.x, mid.x, end.x],
                    y: [start.y, mid.y, end.y],
                    scale: [1, 1.07, 1],
                    transition: {
                        duration: 0.78,
                        times: [0, 0.6, 1],
                        ease: easingCurve,
                        delay: sequenceIndex * 0.08,
                    },
                });
            });
        },
        [controls, getTargetPoint]
    );

    useEffect(() => {
        const media = window.matchMedia("(min-width: 1280px)");
        const handleMediaChange = () => setIsDesktop(media.matches);

        handleMediaChange();
        media.addEventListener("change", handleMediaChange);

        return () => media.removeEventListener("change", handleMediaChange);
    }, []);

    useEffect(() => {
        if (hasInitializedRef.current) {
            return;
        }

        const initialMode: TargetMode = isContactRoute ? "contact" : "sidebar";
        setToMode(initialMode);
        hasInitializedRef.current = true;
    }, [isContactRoute, setToMode]);

    useEffect(() => {
        if (!hasInitializedRef.current) {
            return;
        }

        if (hideTimeoutRef.current) {
            window.clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }

        const mode: TargetMode = isContactRoute ? "contact" : "sidebar";
        setIsTransientVisible(true);
        animateToMode(mode);
        const settleTimeout = window.setTimeout(() => {
            setToMode(mode);
        }, 860);

        if (!isContactRoute && !isDesktop) {
            hideTimeoutRef.current = window.setTimeout(() => {
                setIsTransientVisible(false);
            }, 920);
        }

        return () => {
            window.clearTimeout(settleTimeout);
        };
    }, [
        animateToMode,
        isContactRoute,
        isDesktop,
        location.pathname,
        setToMode,
    ]);

    useEffect(() => {
        const syncToCurrentMode = () => {
            if (!hasInitializedRef.current) {
                return;
            }

            const mode: TargetMode = isContactRoute ? "contact" : "sidebar";
            setToMode(mode);
        };

        const handleWindowChange = () => {
            window.requestAnimationFrame(syncToCurrentMode);
        };

        window.addEventListener("resize", handleWindowChange);
        window.addEventListener("scroll", handleWindowChange, { passive: true });

        return () => {
            window.removeEventListener("resize", handleWindowChange);
            window.removeEventListener("scroll", handleWindowChange);
        };
    }, [isContactRoute, setToMode]);

    useEffect(() => {
        return () => {
            if (hideTimeoutRef.current) {
                window.clearTimeout(hideTimeoutRef.current);
            }
        };
    }, []);

    const shouldRender = isDesktop || isContactRoute || isTransientVisible;

    if (!shouldRender) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-40">
            {SOCIAL_ITEMS.map(({ key, href, label, Icon }) => (
                <motion.a
                    key={key}
                    animate={controls[key]}
                    whileHover={{ scale: 1.1 }}
                    href={href}
                    target={key === "email" ? undefined : "_blank"}
                    rel={key === "email" ? undefined : "noopener noreferrer"}
                    aria-label={label}
                    className="pointer-events-auto absolute flex h-8 w-8 items-center justify-center text-2xl leading-none text-white/78 transition-colors duration-200 hover:text-[var(--accent)]"
                    style={{ translateX: "-50%", translateY: "-50%" }}
                >
                    <Icon />
                </motion.a>
            ))}
        </div>
    );
}

export default SocialIconsLayer;
