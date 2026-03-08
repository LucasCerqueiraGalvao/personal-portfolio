import { FaCalendar } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
    formatExperienceDuration,
    formatExperiencePeriod,
    getLocalizedText,
    type ExperienceCompany,
    type SupportedLanguage,
} from "../../data/experiences";

type Props = {
    company: ExperienceCompany;
    idx: number;
    language: SupportedLanguage;
};

function ExperienceCompanyTimelineItem({ company, idx, language }: Props) {
    const rolesDescending = [...company.roles].sort((a, b) => {
        const endA = a.endDate ?? "9999-12";
        const endB = b.endDate ?? "9999-12";

        if (endA !== endB) {
            return endB.localeCompare(endA);
        }

        return b.startDate.localeCompare(a.startDate);
    });

    return (
        <Link to={`/experiences/${company.slug}`} className="block group">
            <div
                className="relative pl-6"
                data-aos="fade-right"
                data-aos-delay={`${(idx + 1) * 100}`}
            >
                <div className="absolute left-1 top-5 bottom-0 w-px bg-white/20" />

                <span className="absolute left-[-3px] top-[6px] w-4 h-4 bg-primary rounded-full border border-black" />

                <div className="mb-8">
                    <h4 className="text-lg font-bold text-white transition-colors group-hover:text-primary">
                        {company.name}
                    </h4>

                    <div className="mt-4 space-y-4">
                        {rolesDescending.map((role, roleIdx) => {
                            const rolePeriod = {
                                startDate: role.startDate,
                                endDate: role.endDate,
                            };

                            return (
                                <div
                                    key={`${company.slug}-${role.title.en}-${role.startDate}`}
                                    className={roleIdx > 0 ? "pt-4 border-t border-white/10" : ""}
                                >
                                    <p className="text-xs text-white/60 flex items-center gap-2">
                                        <FaCalendar className="text-white/35" />
                                        {formatExperiencePeriod(rolePeriod, language)}
                                        {" \u00B7 "}
                                        {formatExperienceDuration(rolePeriod, language)}
                                    </p>

                                    <h3 className="text-base font-semibold text-primary mt-1">
                                        {getLocalizedText(role.title, language)}
                                    </h3>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {role.skills.map((skill) => (
                                            <span
                                                key={`${company.slug}-${role.title.en}-${skill}`}
                                                className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ExperienceCompanyTimelineItem;
