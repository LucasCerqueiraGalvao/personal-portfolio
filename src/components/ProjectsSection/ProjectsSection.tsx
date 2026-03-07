import EmblaCarousel from "../Carousel/EmblaCarousel";
import projectsRaw from "../../data/projects.json";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState } from "react";

type ProjectItem = {
    id: string;
    slug?: string;
    title: string;
    description: string;
    techs: string[];
    link?: string;
    source?: string;
    image?: string;
    isOffline?: boolean;
};

const FILTER_TAGS = [
    "Dashboard",
    "Python",
    "SQL",
    "Data Engineering",
    "GCP",
    "AWS",
    "Docker",
    "ML / DL",
    "AI / LLM",
    "Scraping",
    "CRM / ERP",
    "React",
] as const;

const PROJECT_FILTERS: Record<string, string[]> = {
    event_driven_integration_api_on_gcp: [
        "Python",
        "GCP",
        "Docker",
        "Data Engineering",
        "CRM / ERP",
    ],
    fiscal_data_platform_emissions_product_analytics: [
        "Python",
        "SQL",
        "Data Engineering",
        "Dashboard",
        "CRM / ERP",
        "GCP",
    ],
    legal_data_intelligence_platform: [
        "Python",
        "AWS",
        "SQL",
        "Data Engineering",
        "Scraping",
        "Docker",
        "Dashboard",
    ],
    crm_analytics_platform_dbt_data_vault: [
        "Python",
        "SQL",
        "Data Engineering",
        "Dashboard",
        "CRM / ERP",
        "GCP",
    ],
    enterprise_data_validation_framework: [
        "Python",
        "SQL",
        "Data Engineering",
        "CRM / ERP",
    ],
    documents_reader: ["Python", "Data Engineering", "AI / LLM"],
    cotation_scraper: ["Python", "Data Engineering", "Scraping", "Docker"],
    ic_machine_learning: ["Python", "ML / DL", "AI / LLM"],
    pcg_analise_de_dados: ["Python", "Dashboard", "SQL", "AWS", "React"],
    codex_discord_gateway: ["Python", "AI / LLM", "Docker"],
    aes_code_in_c: [],
    lucas_personal_portfolio: ["React", "Docker"],
};

function ProjectsSection() {
    const { t } = useTranslation();
    const [activeFilter, setActiveFilter] = useState("all");

    const projects: ProjectItem[] = projectsRaw.map((project) => ({
        ...project,
        title: t(`projects.${project.id}.title`),
        description: t(`projects.${project.id}.description`),
    }));

    const filteredProjects =
        activeFilter === "all"
            ? projects
            : projects.filter((project) =>
                  (PROJECT_FILTERS[project.id] ?? []).includes(activeFilter)
              );

    return (
        <section
            id="projects"
            className="bg-black text-white sm:px-6 px-0 py-20 font-['Inter400'] relative z-10"
        >
            <motion.h2
                className="text-3xl sm:text-4xl font-bold mb-12 text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                {t("projects.title").toUpperCase()}
            </motion.h2>

            <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-12 mb-6 sm:mb-8">
                <div className="flex flex-wrap items-center gap-2 pb-2">
                    <button
                        type="button"
                        onClick={() => setActiveFilter("all")}
                        className={`text-xs sm:text-sm px-3 py-1.5 rounded-full border transition whitespace-nowrap ${
                            activeFilter === "all"
                                ? "bg-primary border-primary text-black"
                                : "bg-white/10 border-white/20 text-white"
                        }`}
                    >
                        {t("projects.filters.all")}
                    </button>

                    {FILTER_TAGS.map((stack) => (
                        <button
                            key={stack}
                            type="button"
                            onClick={() => setActiveFilter(stack)}
                            className={`text-xs sm:text-sm px-3 py-1.5 rounded-full border transition whitespace-nowrap ${
                                activeFilter === stack
                                    ? "bg-primary border-primary text-black"
                                    : "bg-white/10 border-white/20 text-white"
                            }`}
                        >
                            {stack}
                        </button>
                    ))}
                </div>
            </div>

            {filteredProjects.length === 0 ? (
                <p className="text-center text-white/70 px-4">
                    Nenhum projeto nesta categoria ainda.
                </p>
            ) : (
                <EmblaCarousel
                    key={`project-filter-${activeFilter}`}
                    projects={filteredProjects}
                    options={{
                        align: "start",
                        slidesToScroll: 1,
                        loop: false,
                    }}
                />
            )}
        </section>
    );
}

export default ProjectsSection;
