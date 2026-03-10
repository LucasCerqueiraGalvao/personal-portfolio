import { createContext, useContext, type MutableRefObject } from "react";

export type SocialKey = "linkedin" | "github" | "email";

export type AnchorMap = Record<SocialKey, HTMLDivElement | null>;

export type SocialIconAnchorsContextValue = {
    sidebarAnchorsRef: MutableRefObject<AnchorMap>;
    contactAnchorsRef: MutableRefObject<AnchorMap>;
    setSidebarAnchor: (key: SocialKey, node: HTMLDivElement | null) => void;
    setContactAnchor: (key: SocialKey, node: HTMLDivElement | null) => void;
};

export const INITIAL_ANCHOR_MAP: AnchorMap = {
    linkedin: null,
    github: null,
    email: null,
};

export const SocialIconAnchorsContext =
    createContext<SocialIconAnchorsContextValue | null>(null);

export function useSocialIconAnchors() {
    const context = useContext(SocialIconAnchorsContext);

    if (!context) {
        throw new Error(
            "useSocialIconAnchors must be used within SocialIconAnchorsProvider"
        );
    }

    return context;
}

