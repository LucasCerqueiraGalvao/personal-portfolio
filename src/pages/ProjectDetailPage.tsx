import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { projectDetails, type ProjectDetail } from "../data/projectDetails";
import projectsRaw from "../data/projects.json";

function ProjectDetailPage() {
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
            ? "Público"
            : "Public";

    if (!project) {
        return (
            <section className="pt-[120px] min-h-screen bg-black text-white px-6 py-12 font-['Inter400']">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                        {language === "pt"
                            ? "Projeto não encontrado"
                            : "Project not found"}
                    </h1>
                    <p className="text-white/70 mb-8">
                        {language === "pt"
                            ? "Este slug de projeto ainda não foi mapeado."
                            : "This project slug is not mapped yet."}
                    </p>
                    <Link to="/projects" className="text-primary hover-underline">
                        {language === "pt"
                            ? "Voltar para projetos"
                            : "Back to projects"}
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="pt-[120px] min-h-screen bg-black text-white px-6 py-12 font-['Inter400']">
            <div className="max-w-4xl mx-auto">
                <Link
                    to="/projects"
                    className="text-primary hover-underline text-sm"
                >
                    {language === "pt"
                        ? "← Voltar para projetos"
                        : "← Back to projects"}
                </Link>

                <p className="text-primary text-sm mb-3">
                    {language === "pt" ? "Projeto" : "Project"}: {project.slug}
                </p>

                <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                    {projectTitle}
                </h1>

                <p className="text-white/80 mb-4">
                    {projectDescription || project.summary[language]}
                </p>

                <span className="inline-flex text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20 mb-6">
                    {statusLabel}
                </span>

                <div className="flex flex-wrap gap-2 mb-8">
                    {project.stack.map((tech) => (
                        <span
                            key={tech}
                            className="text-xs sm:text-sm px-2 py-0.5 rounded-full bg-white/10 border border-white/20"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2 text-primary">
                        {language === "pt" ? "Destaques" : "Highlights"}
                    </h2>
                    <ul className="space-y-2 text-white/85">
                        {project.highlights.map((highlight, index) => (
                            <li key={`${project.slug}-highlight-${index}`}>
                                • {highlight[language]}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-6">
                    {project.sections.map((section) => (
                        <article key={section.id}>
                            <h2 className="text-xl font-semibold mb-2 text-primary">
                                {section.title[language]}
                            </h2>
                            <p className="text-white/80">
                                {section.content[language]}
                            </p>
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
                            {language === "pt" ? "Repositório" : "Repository"}
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

export default ProjectDetailPage;
