import { withBasePath } from "../utils/withBasePath";

export type SupportedLanguage = "pt" | "en";

type LocalizedText = {
    pt: string;
    en: string;
};

type SocialLinks = {
    github: string;
    linkedin: string;
    email: string;
};

type CvPaths = {
    pt: string;
    en: string;
};

export type ProfileData = {
    fullName: string;
    initials: string;
    role: LocalizedText;
    social: SocialLinks;
    cv: CvPaths;
};

export const profile: ProfileData = {
    fullName: "Lucas Cerqueira Galvão",
    initials: "LG",
    role: {
        pt: "Engenheiro de Dados e Analista de Dados",
        en: "Data Engineer and Data Analyst",
    },
    social: {
        github: "https://github.com/LucasCerqueiraGalvao",
        linkedin: "https://www.linkedin.com/in/lucas-cerqueira-galvao/",
        email: "mailto:lucas_galvao01@hotmail.com",
    },
    cv: {
        pt: "/cv/cv_lucas_galvao_data_engineer_pt.pdf",
        en: "/cv/cv_lucas_galvao_data_engineer_en.pdf",
    },
};

export function getCvPath(language: SupportedLanguage): string {
    return withBasePath(profile.cv[language] ?? profile.cv.pt);
}
