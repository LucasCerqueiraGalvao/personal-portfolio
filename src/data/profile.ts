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

type CvAsset = {
    path: string;
    filename: string;
};

type CvAssets = {
    pt: CvAsset;
    en: CvAsset;
};

export type ProfileData = {
    fullName: LocalizedText;
    initials: string;
    role: LocalizedText;
    social: SocialLinks;
    cv: CvAssets;
};

export const profile: ProfileData = {
    fullName: {
        pt: "Lucas Galvão",
        en: "Lucas Galvao",
    },
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
        pt: {
            path: "/cv/PT_Lucas_Galvao_CV_Data_Engineer.pdf",
            filename: "PT_Lucas_Galvao_CV_Data_Engineer.pdf",
        },
        en: {
            path: "/cv/EN_Lucas_Galvao_CV_Data_Engineer.pdf",
            filename: "EN_Lucas_Galvao_CV_Data_Engineer.pdf",
        },
    },
};

export function getProfileFullName(language: SupportedLanguage): string {
    return profile.fullName[language] ?? profile.fullName.en;
}

export function getCvPath(language: SupportedLanguage): string {
    return withBasePath(profile.cv[language]?.path ?? profile.cv.pt.path);
}

export function getCvDownloadName(language: SupportedLanguage): string {
    return profile.cv[language]?.filename ?? profile.cv.pt.filename;
}
