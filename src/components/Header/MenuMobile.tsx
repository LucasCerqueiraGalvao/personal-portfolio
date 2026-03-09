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
            className={`p-10 fixed top-0 left-0 w-full h-screen bg-black flex flex-col items-center justify-between transition-transform duration-300 ${
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            } xl:hidden`}
        >
            <ul className="text-lg space-y-12 text-center">
                {navLinks.map(({ to, label }) => (
                    <li key={to}>
                        <NavLink
                            to={to}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                isActive ? "text-primary" : ""
                            }
                        >
                            {label}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className="flex gap-6 text-2xl">
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 transition-all duration-300"
                    title="Change language"
                >
                    <img
                        src={
                            language === "en"
                                ? withBasePath("/images/flags/br.svg")
                                : withBasePath("/images/flags/us.svg")
                        }
                        alt={language === "en" ? "Português" : "English"}
                        className="w-5 h-5 cursor-pointer"
                    />
                    <span className="text-xs text-white font-semibold cursor-pointer">
                        {language === "en" ? "PT" : "EN"}
                    </span>
                </button>

                <a
                    href={profile.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaLinkedin className="hover:text-primary transition duration-400 hover:scale-110 cursor-pointer" />
                </a>
                <a
                    href={profile.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaGithub className="hover:text-primary transition duration-400 hover:scale-110 cursor-pointer" />
                </a>
                <a href={profile.social.email}>
                    <FaEnvelope className="hover:text-primary transition duration-400 hover:scale-110 cursor-pointer" />
                </a>
            </div>
        </nav>
    );
}

export default MenuMobile;

