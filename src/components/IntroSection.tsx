import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useTranslation } from "react-i18next";
import { profile } from "../data/profile";
import i18n from "../utils/i18n";

function IntroSection() {
    const { t } = useTranslation();
    const language = i18n.language.startsWith("pt") ? "pt" : "en";

    return (
        <section
            id="header"
            className="relative z-10 flex min-h-[calc(100vh-98px)] select-none items-center justify-center px-6 pb-24 pt-10 text-white sm:pb-28 sm:pt-14"
        >
            <div className="max-w-2xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <TypeAnimation
                        key={language}
                        sequence={[
                            profile.fullName.toUpperCase(),
                            2000,
                            t("hero.title"),
                            2000,
                        ]}
                        wrapper="h1"
                        className="font-['Inter400'] text-2xl font-bold leading-tight sm:text-3xl md:text-4xl"
                        cursor
                        repeat={Infinity}
                        speed={20}
                        deletionSpeed={32}
                    />
                </motion.div>

                <motion.p
                    className="mx-auto mt-6 max-w-xl text-sm text-[var(--text-muted)] sm:text-base"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                >
                    {t("hero.description")}
                </motion.p>
            </div>
        </section>
    );
}

export default IntroSection;
