import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBriefcase, FaGraduationCap, FaTrophy } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "../../data/profile";
import {
    experiences as experienceCompanies,
    type SupportedLanguage,
} from "../../data/experiences";
import ExperienceCompanyTimelineItem from "./ExperienceCompanyTimelineItem";
import QualificationItem from "./QualificationItem";

type TabKey = "experiences" | "education" | "achievements";

const ExperienceSection = () => {
    const [activeTab, setActiveTab] = useState<TabKey>("experiences");
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

    const experiencesRef = useRef<HTMLButtonElement>(null);
    const educationRef = useRef<HTMLButtonElement>(null);
    const achievementsRef = useRef<HTMLButtonElement>(null);

    const { t, i18n } = useTranslation();
    const language: SupportedLanguage = i18n.language.startsWith("pt")
        ? "pt"
        : "en";

    useEffect(() => {
        let activeRef = experiencesRef;

        if (activeTab === "education") {
            activeRef = educationRef;
        }

        if (activeTab === "achievements") {
            activeRef = achievementsRef;
        }

        if (activeRef.current) {
            const { offsetLeft, offsetWidth } = activeRef.current;
            setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
        }
    }, [activeTab]);

    const educationKeys = [
        "fatec_ads_2026",
        "unisanta_cc_2026",
        "usp_fisica_2023",
        "usp_poli_mba_2027",
    ];

    const education = educationKeys.map((key) => ({
        title: t(`education.${key}.title`),
        company: t(`education.${key}.company`),
        period: t(`education.${key}.period`),
        description: t(`education.${key}.description`),
        link: t(`education.${key}.link`, ""),
    }));

    const achievementKeys = [
        "aws_cloud_foundations",
        "ada_data_science",
        "obi_2023",
        "sbc_regional_2024",
        "santo_scuderi_2024",
    ];

    const achievements = achievementKeys.map((key) => ({
        title: t(`achievements.${key}.title`),
        company: t(`achievements.${key}.company`),
        period: t(`achievements.${key}.period`),
        description: t(`achievements.${key}.description`),
        link: t(`achievements.${key}.link`, ""),
    }));

    return (
        <section
            id="experiences"
            className="bg-black text-white px-6 py-20 font-['Inter400'] flex flex-col items-center min-h-[calc(100vh-98px)] relative z-10"
        >
            <motion.h2
                className="text-3xl sm:text-4xl font-bold mb-8 text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                {t("experiences.mainTitle").toUpperCase()}
            </motion.h2>

            <motion.div
                className="relative flex flex-wrap justify-center gap-4 mb-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div
                    className="absolute bottom-0 h-[2px] bg-primary transition-all duration-300"
                    style={{
                        left: underlineStyle.left,
                        width: underlineStyle.width,
                    }}
                />

                <button
                    ref={experiencesRef}
                    onClick={() => setActiveTab("experiences")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition relative ${
                        activeTab === "experiences" ? "text-white" : "text-white/30"
                    }`}
                >
                    <FaBriefcase size={25} />
                    {t("experiences.title").toUpperCase()}
                </button>

                <button
                    ref={educationRef}
                    onClick={() => setActiveTab("education")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition relative ${
                        activeTab === "education" ? "text-white" : "text-white/30"
                    }`}
                >
                    <FaGraduationCap size={25} />
                    {t("education.title").toUpperCase()}
                </button>

                <button
                    ref={achievementsRef}
                    onClick={() => setActiveTab("achievements")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition relative ${
                        activeTab === "achievements" ? "text-white" : "text-white/30"
                    }`}
                >
                    <FaTrophy size={25} />
                    {t("achievements.title").toUpperCase()}
                </button>
            </motion.div>

            <div
                className={`relative w-full ${
                    activeTab === "experiences" ? "max-w-[760px]" : "max-w-[500px]"
                }`}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === "experiences" ? (
                            <div>
                                {experienceCompanies.map((company, idx) => (
                                    <ExperienceCompanyTimelineItem
                                        key={company.slug}
                                        company={company}
                                        idx={idx}
                                        language={language}
                                    />
                                ))}
                            </div>
                        ) : (
                            <>
                                {(activeTab === "education"
                                    ? education
                                    : achievements
                                ).map((item, idx) => (
                                    <QualificationItem idx={idx} key={idx} {...item} />
                                ))}

                                {activeTab === "achievements" && (
                                    <div className="mt-6 text-center">
                                        <a
                                            href={`${profile.social.linkedin}details/certifications/`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary font-semibold hover:underline"
                                        >
                                            {t("achievements.seeAllOnLinkedIn")} {"->"}
                                        </a>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

export default ExperienceSection;
