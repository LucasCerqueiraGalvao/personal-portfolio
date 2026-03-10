import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { projectDetails, type ProjectDetail } from "../data/projectDetails";
import projectsRaw from "../data/projects.json";
import { APP_ROUTES } from "../config/routes";

function WorkDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { i18n, t } = useTranslation();
    const language = i18n.language.startsWith("pt") ? "pt" : "en";

    const project = slug
        ? (projectDetails as Record<string, ProjectDetail | undefined>)[slug]
        : undefined;

    const projectListItem = slug
        ? projectsRaw.find((item) => item.slug === slug)
        : undefined;

    const projectTitle = projectListItem
        ? t(`projects.${projectListItem.id}.title`)
        : project?.slug ?? "";

    const projectDescription = projectListItem
        ? t(`projects.${projectListItem.id}.description`)
        : "";

    const statusLabel =
        project?.status === "private"
            ? language === "pt"
                ? "Privado"
                : "Private"
            : project?.status === "nda"
            ? "NDA"
            : project?.status === "offline"
            ? "Offline"
            : language === "pt"
            ? "Publico"
            : "Public";

    const sectionClassName =
        "relative z-10 min-h-screen px-6 py-12 pt-[104px] font-['Inter400'] text-white";

    if (!project) {
        return (
            <section className={sectionClassName}>
                <div className="mx-auto max-w-4xl">
                    <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
                        {language === "pt"
                            ? "Projeto nao encontrado"
                            : "Project not found"}
                    </h1>
                    <p className="mb-8 text-white/70">
                        {language === "pt"
                            ? "Este slug de projeto ainda nao foi mapeado."
                            : "This project slug is not mapped yet."}
                    </p>
                    <Link to={APP_ROUTES.work} className="text-primary hover-underline">
                        {language === "pt"
                            ? "Voltar para projetos"
                            : "Back to projects"}
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className={sectionClassName}>
            <div className="mx-auto max-w-4xl">
                <Link
                    to={APP_ROUTES.work}
                    className="text-primary hover-underline text-sm"
                >
                    {language === "pt"
                        ? "<- Voltar para projetos"
                        : "<- Back to projects"}
                </Link>

                <p className="text-primary mb-3 text-sm">
                    {language === "pt" ? "Projeto" : "Project"}: {project.slug}
                </p>

                <h1 className="mb-3 text-3xl font-bold sm:text-4xl">{projectTitle}</h1>

                <p className="mb-4 text-white/80">
                    {projectDescription || project.summary[language]}
                </p>

                <span className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-xs">
                    {statusLabel}
                </span>

                <div className="mb-8 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                        <span
                            key={tech}
                            className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-xs sm:text-sm"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="mb-8">
                    <h2 className="text-primary mb-2 text-xl font-semibold">
                        {language === "pt" ? "Destaques" : "Highlights"}
                    </h2>
                    <ul className="space-y-2 text-white/85">
                        {project.highlights.map((highlight, index) => (
                            <li key={`${project.slug}-highlight-${index}`}>
                                - {highlight[language]}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-6">
                    {project.sections.map((section) => (
                        <article key={section.id}>
                            <h2 className="text-primary mb-2 text-xl font-semibold">
                                {section.title[language]}
                            </h2>
                            <p className="text-white/80">{section.content[language]}</p>
                        </article>
                    ))}
                </div>

                <div className="mt-10 flex flex-wrap gap-6">
                    {project.links.repository && (
                        <a
                            href={project.links.repository}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover-underline"
                        >
                            {language === "pt" ? "Repositorio" : "Repository"}
                        </a>
                    )}
                    {project.links.demo && (
                        <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover-underline"
                        >
                            Demo
                        </a>
                    )}
                    {project.links.docs && (
                        <a
                            href={project.links.docs}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover-underline"
                        >
                            Docs
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}

export default WorkDetailPage;
