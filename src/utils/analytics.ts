import { GA_MEASUREMENT_ID } from "../config/analytics";

let lastTrackedPath: string | null = null;

export function trackPageView(pagePath: string) {
    if (!GA_MEASUREMENT_ID || typeof window === "undefined") {
        return;
    }

    if (!window.gtag || pagePath === lastTrackedPath) {
        return;
    }

    lastTrackedPath = pagePath;
    window.gtag("event", "page_view", {
        page_location: window.location.href,
        page_path: pagePath,
        page_title: document.title,
    });
}
