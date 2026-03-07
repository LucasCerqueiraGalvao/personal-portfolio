import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getCvPath, profile } from "../data/profile";
import i18n from "../utils/i18n";
import Button from "./Button";
import MenuMobile from "./Header/MenuMobile";

type HeaderLink = {
    to: string;
    label: string;
};

function Header() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [language, setLanguage] = useState<"en" | "pt">(
        i18n.language as "en" | "pt"
    );

    const toggleLanguage = () => {
        const newLang = language === "en" ? "pt" : "en";
        i18n.changeLanguage(newLang);
        setLanguage(newLang);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks: HeaderLink[] = [
        { to: "/home", label: t("header.nav.home") },
        { to: "/projects", label: t("header.nav.projects") },
        { to: "/experiences", label: t("header.nav.experiences") },
        { to: "/contact", label: t("header.nav.contact") },
    ];

    return (
        <header
            className={`bg-black font-['Inter400'] text-white fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled ? "h-[72px] py-4" : "h-[98px] py-6"
            }`}
        >
            <div className="mx-auto px-7 flex items-center justify-between">
                <Link
                    to="/home"
                    className={`font-['Michroma'] transition-all duration-300 ${
                        isScrolled ? "text-lg xl:text-xl" : "text-xl xl:text-2xl"
                    }`}
                >
                    {profile.initials}
                </Link>

                <div
                    className="xl:hidden flex flex-col gap-[6px] cursor-pointer z-50"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <div
                        className={`w-6 h-[2px] bg-white transition-all origin-left ${
                            isMobileMenuOpen ? "rotate-45 -translate-y-2" : ""
                        }`}
                    ></div>
                    <div
                        className={`w-6 h-[2px] bg-white transition-all ${
                            isMobileMenuOpen ? "opacity-0" : ""
                        }`}
                    ></div>
                    <div
                        className={`w-6 h-[2px] bg-white transition-all origin-left ${
                            isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                        }`}
                    ></div>
                </div>

                <nav className="hidden xl:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-['Inter400']">
                    <ul className="flex gap-x-8 text-sm xl:text-base">
                        {navLinks.map(({ to, label }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    className={({ isActive }) =>
                                        `hover-underline ${
                                            isActive ? "text-primary" : ""
                                        }`
                                    }
                                >
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="hidden xl:flex gap-3">
                    <Button type="secondary">
                        <a href={getCvPath(language)} download>
                            {t("header.button2")}
                        </a>
                    </Button>
                    <Button type="primary" onClick={() => navigate("/projects")}>
                        {t("header.button1")}
                    </Button>
                    <div className="hidden xl:flex items-center gap-3 ml-2">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-800 transition-all duration-300"
                            title="Change language"
                        >
                            <img
                                src={
                                    language === "en"
                                        ? "/images/flags/br.svg"
                                        : "/images/flags/us.svg"
                                }
                                alt={language === "en" ? "Portugues" : "English"}
                                className="w-5 h-5 cursor-pointer"
                            />
                            <span className="cursor-pointer text-xs text-white font-semibold">
                                {language === "en" ? "PT" : "EN"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <MenuMobile
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                toggleLanguage={toggleLanguage}
                navLinks={navLinks}
                language={language}
            />

            <div className="hidden xl:flex flex-col gap-6 text-2xl fixed left-6 top-1/2 -translate-y-1/2 z-40">
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
        </header>
    );
}

export default Header;

