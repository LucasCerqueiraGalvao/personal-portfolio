import { useEffect, useState } from "react";
import { profile } from "../data/profile";

function SiteFooter() {
    const year = new Date().getFullYear();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 24);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <footer
            className={`relative z-10 px-4 pb-10 pt-6 transition-all duration-500 sm:px-6 ${
                isVisible
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-4 opacity-0"
            }`}
        >
            <div className="mx-auto max-w-7xl border-t border-white/12 pt-6">
                <div className="flex flex-col gap-4 text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <span className="font-['Michroma'] text-sm text-white">
                            {profile.initials}
                        </span>
                        <span>{profile.fullName}</span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-white/80">
                        <a
                            href={profile.social.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[var(--accent)]"
                        >
                            GitHub
                        </a>
                        <a
                            href={profile.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[var(--accent)]"
                        >
                            LinkedIn
                        </a>
                        <a
                            href={profile.social.email}
                            className="hover:text-[var(--accent)]"
                        >
                            Email
                        </a>
                    </div>
                </div>

                <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    {("(c) " + year + " " + profile.fullName + ". All rights reserved.")}
                </p>
            </div>
        </footer>
    );
}

export default SiteFooter;
