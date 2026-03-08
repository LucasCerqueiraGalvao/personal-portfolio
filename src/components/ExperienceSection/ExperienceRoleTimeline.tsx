import {
    formatExperiencePeriod,
    getLocalizedText,
    type ExperienceRole,
    type SupportedLanguage,
} from "../../data/experiences";

type Props = {
    roles: ExperienceRole[];
    language: SupportedLanguage;
    compact?: boolean;
};

function ExperienceRoleTimeline({ roles, language, compact = false }: Props) {
    return (
        <div className="space-y-5">
            {roles.map((role, index) => {
                const itemKey = `${role.title.en}-${role.startDate}-${role.endDate ?? "present"}`;

                return (
                    <div key={itemKey} className="relative pl-7">
                        {index < roles.length - 1 && (
                            <span className="absolute left-[7px] top-5 h-[calc(100%+12px)] w-px bg-white/20" />
                        )}

                        <span className="absolute left-0 top-[5px] h-4 w-4 rounded-full border border-black bg-primary" />

                        <div>
                            <h4 className="text-base sm:text-lg font-semibold text-white">
                                {getLocalizedText(role.title, language)}
                            </h4>

                            <p className="text-xs sm:text-sm text-white/60 mt-1">
                                {formatExperiencePeriod(
                                    {
                                        startDate: role.startDate,
                                        endDate: role.endDate,
                                    },
                                    language
                                )}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-3">
                                {role.skills.map((skill) => (
                                    <span
                                        key={`${itemKey}-${skill}`}
                                        className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {!compact && (
                                <p className="text-sm text-white/80 mt-3 leading-relaxed whitespace-pre-line">
                                    {getLocalizedText(role.description, language)}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ExperienceRoleTimeline;
