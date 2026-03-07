import { useTranslation } from "react-i18next";
import { profile } from "../data/profile";

function Footer() {
    const { i18n } = useTranslation();
    const year = new Date().getFullYear();
    const rightsReserved =
        i18n.language === "pt"
            ? "Todos os direitos reservados."
            : "All rights reserved.";
    const footerText = `© ${year} ${profile.fullName}. ${rightsReserved}`;

    return (
        <footer className="bg-[#0a0a0a] text-white px-6 pt-10 pb-6">
            <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center">
                {/* Logo + direitos */}
                <div className="w-full sm:w-auto text-sm text-white/30 flex justify-between items-center mb-6 sm:mb-0">
                    <span className="font-['Michroma'] text-xs">{profile.initials}</span>
                    <span className="sm:hidden block">{footerText}</span>
                </div>

                {/* Direitos no lado direito (desktop) */}
                <div className="hidden sm:block text-sm text-white/30">
                    {footerText}
                </div>
            </div>

            {/* Links sociais centralizados */}
            <div className="mt-8 text-center">
                <div className="flex justify-center flex-wrap gap-10 text-sm sm:text-base font-semibold tracking-widest">
                    <a
                        href={profile.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover-underline"
                    >
                        GITHUB
                    </a>
                    <a
                        href={profile.social.email}
                        className="hover-underline"
                    >
                        EMAIL
                    </a>
                    <a
                        href={profile.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover-underline"
                    >
                        LINKEDIN
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
