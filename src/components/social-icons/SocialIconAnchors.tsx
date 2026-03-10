import { useMemo, useRef, type ReactNode } from "react";
import {
    INITIAL_ANCHOR_MAP,
    SocialIconAnchorsContext,
    type AnchorMap,
    type SocialIconAnchorsContextValue,
} from "./useSocialIconAnchors";

export function SocialIconAnchorsProvider({
    children,
}: {
    children: ReactNode;
}) {
    const sidebarAnchorsRef = useRef<AnchorMap>({ ...INITIAL_ANCHOR_MAP });
    const contactAnchorsRef = useRef<AnchorMap>({ ...INITIAL_ANCHOR_MAP });

    const value = useMemo<SocialIconAnchorsContextValue>(
        () => ({
            sidebarAnchorsRef,
            contactAnchorsRef,
            setSidebarAnchor: (key, node) => {
                sidebarAnchorsRef.current[key] = node;
            },
            setContactAnchor: (key, node) => {
                contactAnchorsRef.current[key] = node;
            },
        }),
        []
    );

    return (
            <SocialIconAnchorsContext.Provider value={value}>
                {children}
            </SocialIconAnchorsContext.Provider>
    );
}
