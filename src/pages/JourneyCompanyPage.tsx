import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ExperienceRoleTimeline from "../components/ExperienceSection/ExperienceRoleTimeline";
import { APP_ROUTES } from "../config/routes";
import {
    formatExperiencePeriod,
    getExperienceBySlug,
    getLocalizedText,
    type SupportedLanguage,
} from "../data/experiences";

function normalizeWebsiteUrl(website: string): string {
    if (/^https?:\/\//i.test(website)) {
        return website;
    }

    return `https://${website}`;
}

function JourneyCompanyPage() {
    const { slug } = useParams<{ slug: string }>();
    const { t, i18n } = useTranslation();
    const language: SupportedLanguage = i18n.language.startsWith("pt")
        ? "pt"
        : "en";

    const company = slug ? getExperienceBySlug(slug) : undefined;

    if (!company) {
        return (
            <section className="relative z-10 min-h-screen px-6 py-12 pt-[104px] font-['Inter400'] text-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                        {t("experiences.companyNotFoundTitle")}
                    </h1>
                    <p className="text-white/70 mb-8">
                        {t("experiences.companyNotFoundDescription")}
                    </p>
                    <Link
                        to={APP_ROUTES.journey}
                        className="text-primary hover-underline"
                    >
                        {t("experiences.backToExperiences")}
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="relative z-10 min-h-screen px-6 py-12 pt-[104px] font-['Inter400'] text-white">
            <div className="max-w-5xl mx-auto">
                <Link
                    to={APP_ROUTES.journey}
                    className="text-primary hover-underline text-sm"
                >
                    {t("experiences.backToExperiences")}
                </Link>

                <h1 className="text-3xl sm:text-4xl font-bold mt-4">{company.name}</h1>

                <p className="text-white/80 mt-4 leading-relaxed">
                    {getLocalizedText(company.summary, language)}
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-wide text-white/50 mb-1">
                            {t("experiences.website")}
                        </p>
                        <a
                            href={normalizeWebsiteUrl(company.website)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline break-all"
                        >
                            {company.website}
                        </a>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-wide text-white/50 mb-1">
                            {t("experiences.totalPeriod")}
                        </p>
                        <p className="text-sm text-white/90">
                            {formatExperiencePeriod(company.totalPeriod, language)}
                        </p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-wide text-white/50 mb-1">
                            {t("experiences.location")}
                        </p>
                        <p className="text-sm text-white/90">
                            {getLocalizedText(company.location, language)}
                        </p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-wide text-white/50 mb-1">
                            {t("experiences.employmentType")}
                        </p>
                        <p className="text-sm text-white/90">
                            {company.employmentType
                                ? getLocalizedText(company.employmentType, language)
                                : t("experiences.notProvided")}
                        </p>
                    </div>
                </div>

                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-primary mb-5">
                        {t("experiences.careerTimeline")}
                    </h2>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm sm:p-6">
                        <ExperienceRoleTimeline
                            roles={company.roles}
                            language={language}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default JourneyCompanyPage;
