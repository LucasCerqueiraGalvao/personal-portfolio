import type { KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../config/routes";
import { withBasePath } from "../../utils/withBasePath";

type Props = {
    id: string;
    slug?: string;
    title: string;
    description: string;
    techs: string[];
    image?: string;
    link?: string;
    idx: number;
    source?: string;
    isOffline?: boolean;
};

function ProjectCard({
    slug,
    title,
    description,
    techs,
    image,
    link,
    idx,
    source,
    isOffline = false,
}: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const canOpen = !isOffline && Boolean(slug || link);
    const visibleTechs = techs.slice(0, 3);
    const hiddenTechCount = Math.max(0, techs.length - visibleTechs.length);
    const cardAriaLabel = `${t("projects.buttons.view")}: ${title}`;

    const handleOpen = () => {
        if (!canOpen) {
            return;
        }

        if (slug) {
            navigate(APP_ROUTES.workDetail(slug));
            return;
        }

        if (link) {
            window.open(link, "_blank", "noopener,noreferrer");
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (!canOpen) {
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleOpen();
        }
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            onClick={canOpen ? handleOpen : undefined}
            onKeyDown={canOpen ? handleKeyDown : undefined}
            role={canOpen ? "button" : undefined}
            tabIndex={canOpen ? 0 : -1}
            aria-label={canOpen ? cardAriaLabel : undefined}
            className={`surface-card group relative flex h-full w-full max-w-full min-h-[clamp(372px,52dvh,432px)] min-w-0 flex-col overflow-hidden rounded-2xl transition-[transform,border-color,box-shadow] duration-300 sm:min-h-[500px] ${
                canOpen
                    ? "cursor-pointer hover:-translate-y-1 hover:border-[var(--accent)]/70 hover:shadow-[0_18px_45px_rgba(239,68,68,0.2)] focus-visible:-translate-y-1 focus-visible:border-[var(--accent)]/80 focus-visible:shadow-[0_18px_45px_rgba(239,68,68,0.2)] focus-visible:outline-none"
                    : "cursor-default"
            }`}
        >
            {canOpen && (
                <span className="pointer-events-none absolute right-3 top-3 z-20 rounded-full border border-[var(--accent)]/55 bg-black/55 px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-[var(--accent)] opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {t("projects.buttons.view")}
                </span>
            )}

            <div className="relative h-[clamp(158px,24dvh,204px)] w-full overflow-hidden bg-[#061220] sm:aspect-[16/10] sm:h-auto">
                {image ? (
                    <img
                        src={withBasePath(image)}
                        alt={title}
                        className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-white/60">
                        {t("projects.noImage")}
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#06111d] to-transparent" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                <div className="mb-2 flex min-h-[22px] min-w-0 items-center justify-between gap-2 sm:mb-3 sm:min-h-[24px]">
                    {source ? (
                        <span className="chip max-w-full truncate text-[10px]">
                            {t(`projects.sources.${source}`)}
                        </span>
                    ) : (
                        <span />
                    )}

                    {isOffline && (
                        <span className="rounded-full border border-rose-300/55 bg-rose-300/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-rose-200">
                            Offline
                        </span>
                    )}
                </div>

                <h3 className="min-h-[40px] min-w-0 break-words [overflow-wrap:anywhere] text-[15px] font-semibold leading-snug text-white [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden sm:min-h-[56px] sm:text-lg">
                    {title}
                </h3>
                <p className="mt-1 min-h-[38px] min-w-0 break-words [overflow-wrap:anywhere] text-xs leading-relaxed text-[var(--text-muted)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden sm:mt-2 sm:min-h-[72px] sm:text-sm sm:[-webkit-line-clamp:3]">
                    {description}
                </p>

                <div className="mt-3 flex min-h-[28px] flex-wrap content-start gap-1.5 sm:mt-4 sm:min-h-[56px] sm:gap-2">
                    {visibleTechs.map((tech) => (
                        <span
                            key={tech}
                            className="rounded-full border border-[var(--line-soft)] bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-white/80"
                        >
                            {tech}
                        </span>
                    ))}
                    {hiddenTechCount > 0 && (
                        <span className="rounded-full border border-[var(--line-soft)] bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-white/70">
                            +{hiddenTechCount}
                        </span>
                    )}
                </div>
            </div>
        </motion.article>
    );
}

export default ProjectCard;
