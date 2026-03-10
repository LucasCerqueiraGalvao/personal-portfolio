import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { profile } from "../../data/profile";
import { withBasePath } from "../../utils/withBasePath";

type Props = {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
    toggleLanguage: () => void;
    navLinks: { to: string; label: string }[];
    language: "en" | "pt";
};

function MenuMobile({
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toggleLanguage,
    navLinks,
    language,
}: Props) {
    return (
        <nav
            className={`fixed inset-0 z-40 xl:hidden transition-all duration-300 ${
                isMobileMenuOpen
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0"
            }`}
        >
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(circle at 14% -8%, rgba(239, 68, 68, 0.09), transparent 34%), radial-gradient(circle at 88% 4%, rgba(248, 113, 113, 0.07), transparent 32%), linear-gradient(145deg, #020103, #070307)",
                }}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <div
                className={`absolute inset-x-0 top-16 bottom-0 px-6 py-8 transition-all duration-300 ${
                    isMobileMenuOpen
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-4 opacity-0"
                }`}
            >
                <ul className="space-y-5">
                    {navLinks.map(({ to, label }) => (
                        <li key={to}>
                            <NavLink
                                to={to}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block text-sm uppercase tracking-[0.18em] transition ${
                                        isActive
                                            ? "font-semibold text-[var(--accent)]"
                                            : "text-white/82 hover:text-white"
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-6">
                    <button
                        type="button"
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 rounded-lg border border-[var(--line-soft)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/90"
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

                    <div className="flex items-center gap-5 text-lg text-white/80">
                        <a
                            href={profile.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition hover:text-[var(--accent)]"
                        >
                            <FaLinkedin />
                        </a>
                        <a
                            href={profile.social.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition hover:text-[var(--accent)]"
                        >
                            <FaGithub />
                        </a>
                        <a
                            href={profile.social.email}
                            className="transition hover:text-[var(--accent)]"
                        >
                            <FaEnvelope />
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default MenuMobile;
