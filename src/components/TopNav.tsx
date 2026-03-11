import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";
import { APP_ROUTES } from "../config/routes";
import { getCvPath, profile } from "../data/profile";
import i18n from "../utils/i18n";
import { withBasePath } from "../utils/withBasePath";
import Button from "./Button";
import MenuMobile from "./Header/MenuMobile";
import { useSocialIconAnchors } from "./social-icons/useSocialIconAnchors";

type NavItem = {
    to: string;
    label: string;
};

function TopNav() {
    const { t } = useTranslation();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [language, setLanguage] = useState<"en" | "pt">(
        i18n.language.startsWith("pt") ? "pt" : "en"
    );
    const { setSidebarAnchor } = useSocialIconAnchors();
    const isContactRoute =
        location.pathname === APP_ROUTES.reach || location.pathname === "/reach";

    const navLinks: NavItem[] = [
        { to: APP_ROUTES.about, label: t("header.nav.home") },
        { to: APP_ROUTES.work, label: t("header.nav.projects") },
        { to: APP_ROUTES.journey, label: t("header.nav.experiences") },
        { to: APP_ROUTES.reach, label: t("header.nav.contact") },
    ];

    const toggleLanguage = () => {
        const nextLanguage = language === "en" ? "pt" : "en";
        i18n.changeLanguage(nextLanguage);
        setLanguage(nextLanguage);
    };

    return (
        <>
            <header
                className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/32 backdrop-blur-lg"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="relative flex h-[76px] items-center justify-between">
                        <div className="w-[208px] flex-none">
                            <Link
                                to={APP_ROUTES.about}
                                className="flex items-center gap-3 text-white"
                            >
                                <span className="font-['Michroma'] text-sm tracking-[0.22em] sm:text-base">
                                    {profile.initials}
                                </span>
                                <span className="hidden text-[10px] uppercase tracking-[0.3em] text-white/65 md:block">
                                    Data Solutions
                                </span>
                            </Link>
                        </div>

                        <nav className="absolute left-1/2 hidden -translate-x-1/2 xl:block">
                            <ul className="flex items-center gap-7 text-[11px] uppercase tracking-[0.18em]">
                                {navLinks.map(({ to, label }) => (
                                    <li key={to}>
                                        <NavLink
                                            to={to}
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "text-[var(--accent)]"
                                                    : "text-white/75 hover:text-white"
                                            }
                                        >
                                            {label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="ml-auto hidden w-[292px] flex-none items-center justify-end gap-2 xl:flex">
                            <button
                                type="button"
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 rounded-lg border border-[var(--line-soft)] bg-white/5 px-2.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/12"
                                title="Change language"
                            >
                                <img
                                    src={
                                        language === "en"
                                            ? withBasePath("/images/flags/br.svg")
                                            : withBasePath("/images/flags/us.svg")
                                    }
                                    alt={language === "en" ? "Portuguese" : "English"}
                                    className="h-4 w-4 rounded-full"
                                />
                                {language === "en" ? "PT" : "EN"}
                            </button>

                            <div className="w-[208px] flex-none">
                                <Button type="secondary" className="w-full">
                                    <a href={getCvPath(language)} download>
                                        {t("header.button2")}
                                    </a>
                                </Button>
                            </div>
                        </div>

                        <div className="ml-auto flex items-center gap-2 xl:hidden">
                            <button
                                type="button"
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 rounded-lg border border-[var(--line-soft)] bg-white/5 px-2.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white"
                                title="Change language"
                            >
                                <img
                                    src={
                                        language === "en"
                                            ? withBasePath("/images/flags/br.svg")
                                            : withBasePath("/images/flags/us.svg")
                                    }
                                    alt={language === "en" ? "Portuguese" : "English"}
                                    className="h-4 w-4 rounded-full"
                                />
                                {language === "en" ? "PT" : "EN"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                                className="flex h-9 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-[var(--line-soft)] bg-white/5"
                                aria-label="Open menu"
                            >
                                <span className="h-[1.5px] w-5 bg-white/85" />
                                <span className="h-[1.5px] w-5 bg-white/85" />
                                <span className="h-[1.5px] w-5 bg-white/85" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <MenuMobile
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                toggleLanguage={toggleLanguage}
                navLinks={navLinks}
                language={language}
            />

            {!isContactRoute && (
                <div className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 xl:flex">
                    <div
                        ref={(node) => setSidebarAnchor("linkedin", node)}
                        className="h-8 w-8"
                        aria-hidden="true"
                    />
                    <div
                        ref={(node) => setSidebarAnchor("github", node)}
                        className="h-8 w-8"
                        aria-hidden="true"
                    />
                    <div
                        ref={(node) => setSidebarAnchor("email", node)}
                        className="h-8 w-8"
                        aria-hidden="true"
                    />
                </div>
            )}
        </>
    );
}

export default TopNav;
