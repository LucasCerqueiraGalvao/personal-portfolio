import { useTranslation } from "react-i18next";

type Props = {
    title: string;
    company: string;
    period: string;
    description: string;
    link?: string;
    idx: number;
};

function QualificationItem({
    title,
    company,
    period,
    description,
    link,
    idx,
}: Props) {
    const { t } = useTranslation();

    return (
        <div
            className="mb-10"
            data-aos="fade-left"
            data-aos-delay={`${(idx + 1) * 100}`}
        >
            <h4 className="text-lg text-white font-semibold">{title}</h4>
            <p className="text-sm text-white/60">
                {company} - {period}
            </p>
            <p className="text-sm text-white/80 mt-2 whitespace-pre-line">
                {description}
            </p>
            {link && (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm mt-2 inline-block hover:underline"
                >
                    {t("achievements.seeCredential")} {"->"}
                </a>
            )}
        </div>
    );
}

export default QualificationItem;
