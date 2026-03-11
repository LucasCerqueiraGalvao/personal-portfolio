import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import projectsRaw from "../../data/projects.json";
import EmblaCarousel from "../Carousel/EmblaCarousel";
import ProjectCard from "./ProjectCard";

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
    const { t, i18n } = useTranslation();
    const [activeFilter, setActiveFilter] = useState("all");
    const language = i18n.language.startsWith("pt") ? "pt" : "en";

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
            className="relative z-10 min-h-[calc(100dvh-98px)] overflow-x-hidden px-4 pb-6 pt-4 sm:min-h-0 sm:px-6 sm:pb-20 sm:pt-10"
        >
            <div className="mx-auto flex h-full max-w-7xl flex-col">
                <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="mb-5 text-center sm:mb-10"
                >
                    <h2 className="font-['Michroma'] text-2xl sm:text-3xl">
                        {t("header.nav.projects")}
                    </h2>
                </motion.div>

                <div className="mb-4 flex flex-wrap gap-2 pb-1 sm:mb-8 sm:pb-0">
                    <button
                        type="button"
                        onClick={() => setActiveFilter("all")}
                        className={`rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] transition ${
                            activeFilter === "all"
                                ? "border-[var(--accent)] bg-[var(--accent)] text-[#102236]"
                                : "border-[var(--line-soft)] bg-white/5 text-white/80 hover:bg-white/10"
                        }`}
                    >
                        {t("projects.filters.all")}
                    </button>

                    {FILTER_TAGS.map((stack) => (
                        <button
                            key={stack}
                            type="button"
                            onClick={() => setActiveFilter(stack)}
                            className={`rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] transition ${
                                activeFilter === stack
                                    ? "border-[var(--accent)] bg-[var(--accent)] text-[#102236]"
                                    : "border-[var(--line-soft)] bg-white/5 text-white/80 hover:bg-white/10"
                            }`}
                        >
                            {stack}
                        </button>
                    ))}
                </div>

                {filteredProjects.length === 0 ? (
                    <p className="rounded-2xl border border-[var(--line-soft)] bg-white/5 p-5 text-sm text-white/70">
                        {language === "pt"
                            ? "Nenhum projeto encontrado para esse filtro."
                            : "No projects found for this filter."}
                    </p>
                ) : (
                    <>
                        <div className="-mx-4 sm:hidden">
                            <EmblaCarousel
                                projects={filteredProjects}
                                options={{ align: "start", containScroll: "trimSnaps" }}
                            />
                        </div>

                        <div className="hidden gap-5 sm:grid sm:grid-cols-2 xl:grid-cols-3">
                            {filteredProjects.map((project, index) => (
                                <ProjectCard key={project.id} {...project} idx={index} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default ProjectsSection;
