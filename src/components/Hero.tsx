import { useTranslation } from "react-i18next";
import Button from "./Button";
import { getCvPath, profile } from "../data/profile";
import i18n from "../utils/i18n";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Hero() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const language = i18n.language as "en" | "pt";
    
    return (
        <section
            id="header"
            className="mt-[98px] min-h-[calc(100vh-98px)] flex items-center justify-center text-white px-6 relative z-10"
        >
            {/* Content */}
            <div className="text-center max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
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
                        className="text-2xl sm:text-3xl md:text-4xl font-['Inter400'] font-bold leading-tight mb-6"
                        cursor={true}
                        repeat={Infinity}
                        speed={20}
                        deletionSpeed={30}
                    />
                </motion.div>

                <motion.p
                    className="text-sm sm:text-base text-gray-300 mb-8 font-[Inter400]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {t("hero.description")}
                </motion.p>

                <motion.div
                    className="flex justify-center gap-4 flex-wrap"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <Button type="primary">
                        <a href={getCvPath(language)} download>
                            {t("header.button2")}
                        </a>
                    </Button>
                    <Button type="secondary" onClick={() => navigate("/projects")}>
                        {t("header.button1")}
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}

export default Hero;
