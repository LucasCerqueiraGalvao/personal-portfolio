import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

function CustomCursor() {
    const [isMobile, setIsMobile] = useState(false);
    const [cursorVariant, setCursorVariant] = useState<"default" | "pointer" | "text">("default");

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const checkMobile = () => {
            const isMobileDevice =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                ) ||
                window.innerWidth <= 768 ||
                "ontouchstart" in window;
            setIsMobile(isMobileDevice);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile) return;

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            const target = e.target as HTMLElement;
            
            // Check if hovering over clickable elements
            const isClickable = 
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a") ||
                target.classList.contains("cursor-pointer");

            // Check if hovering over text
            const isText = 
                target.tagName === "P" ||
                target.tagName === "SPAN" ||
                target.tagName === "H1" ||
                target.tagName === "H2" ||
                target.tagName === "H3" ||
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA";

            if (isClickable) {
                setCursorVariant("pointer");
            } else if (isText) {
                setCursorVariant("text");
            } else {
                setCursorVariant("default");
            }
        };

        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, [isMobile, cursorX, cursorY]);

    const variants = {
        default: {
            width: 16,
            height: 16,
            backgroundColor: "transparent",
            border: "1px solid #ef4444",
            mixBlendMode: "difference" as const,
            borderRadius: "50%",
        },
        pointer: {
            width: 48,
            height: 48,
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            border: "1px solid rgba(239, 68, 68, 0.5)",
            mixBlendMode: "normal" as const,
            borderRadius: "50%",
        },
        text: {
            width: 32,
            height: 32,
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid #ef4444",
            mixBlendMode: "normal" as const,
            borderRadius: "50%",
        },
    };

    if (isMobile) return null;

    return (
        <>
            {/* Main Dot */}
            <motion.div
                className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    width: 8,
                    height: 8,
                    backgroundColor: "#ef4444",
                }}
            />
            
            {/* Trailing Circle */}
            <motion.div
                className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full flex items-center justify-center"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                variants={variants}
                animate={cursorVariant}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
            />
        </>
    );
}

export default CustomCursor;
