export type SupportedLanguage = "pt" | "en";

export type LocalizedText = {
    pt: string;
    en: string;
};

export type ExperienceDate = `${number}-${number}`;

export type ExperiencePeriod = {
    startDate: ExperienceDate;
    endDate: ExperienceDate | null;
};

export type ExperienceRole = {
    title: LocalizedText;
    startDate: ExperienceDate;
    endDate: ExperienceDate | null;
    description: LocalizedText;
    skills: string[];
};

export type ExperienceCompany = {
    slug: string;
    name: string;
    website: string;
    location: LocalizedText;
    employmentType: LocalizedText | null;
    summary: LocalizedText;
    totalPeriod: ExperiencePeriod;
    primaryStacks: string[];
    roles: ExperienceRole[];
};

type ExperienceCompanySeed = Omit<ExperienceCompany, "totalPeriod" | "primaryStacks"> & {
    primaryStacks?: string[];
};

const PRESENT_LABELS: Record<SupportedLanguage, string> = {
    pt: "Atual",
    en: "Present",
};

const LOCALE_BY_LANGUAGE: Record<SupportedLanguage, string> = {
    pt: "pt-BR",
    en: "en-US",
};

function parseDateParts(date: ExperienceDate): { year: number; month: number } {
    const [yearRaw, monthRaw] = date.split("-");

    return {
        year: Number(yearRaw),
        month: Number(monthRaw),
    };
}

function parseDateWeight(date: ExperienceDate | null): number {
    if (!date) {
        return Number.POSITIVE_INFINITY;
    }

    const { year, month } = parseDateParts(date);

    return year * 12 + month;
}

function parseMonthDate(date: ExperienceDate): Date {
    const { year, month } = parseDateParts(date);

    return new Date(Date.UTC(year, month - 1, 1));
}

function sortRolesChronologically(roles: ExperienceRole[]): ExperienceRole[] {
    return [...roles].sort((a, b) => {
        return parseDateWeight(a.startDate) - parseDateWeight(b.startDate);
    });
}

function computeTotalPeriod(roles: ExperienceRole[]): ExperiencePeriod {
    if (roles.length === 0) {
        return {
            startDate: "1900-01",
            endDate: "1900-01",
        };
    }

    const sortedRoles = sortRolesChronologically(roles);
    const startDate = sortedRoles[0].startDate;
    const hasCurrentRole = sortedRoles.some((role) => role.endDate === null);

    if (hasCurrentRole) {
        return {
            startDate,
            endDate: null,
        };
    }

    let latestEndDate = sortedRoles[0].endDate;

    for (const role of sortedRoles) {
        if (!role.endDate) {
            continue;
        }

        if (!latestEndDate || parseDateWeight(role.endDate) > parseDateWeight(latestEndDate)) {
            latestEndDate = role.endDate;
        }
    }

    return {
        startDate,
        endDate: latestEndDate,
    };
}

function getPrimaryStacks(roles: ExperienceRole[], limit = 6): string[] {
    const frequency = new Map<string, number>();
    const firstSeen = new Map<string, number>();
    let pointer = 0;

    for (const role of roles) {
        for (const skill of role.skills) {
            frequency.set(skill, (frequency.get(skill) ?? 0) + 1);
            if (!firstSeen.has(skill)) {
                firstSeen.set(skill, pointer);
            }
            pointer += 1;
        }
    }

    return [...frequency.entries()]
        .sort((a, b) => {
            if (b[1] !== a[1]) {
                return b[1] - a[1];
            }

            return (firstSeen.get(a[0]) ?? 0) - (firstSeen.get(b[0]) ?? 0);
        })
        .slice(0, limit)
        .map(([skill]) => skill);
}

function buildCompany(seed: ExperienceCompanySeed): ExperienceCompany {
    const orderedRoles = sortRolesChronologically(seed.roles);

    return {
        ...seed,
        roles: orderedRoles,
        totalPeriod: computeTotalPeriod(orderedRoles),
        primaryStacks: seed.primaryStacks ?? getPrimaryStacks(orderedRoles),
    };
}

const experienceCompaniesSeed: ExperienceCompanySeed[] = [
    {
        slug: "happy",
        name: "Happy",
        website: "https://happy.com.br",
        location: {
            pt: "Santos, SP, Brasil",
            en: "Santos, SP, Brazil",
        },
        employmentType: {
            pt: "PJ",
            en: "Independent contractor",
        },
        summary: {
            pt: "Atuei como instrutor de programacao, com foco em logica, algoritmos e aprendizado baseado em projetos.",
            en: "Worked as a programming instructor focused on logic, algorithms, and project-based learning.",
        },
        roles: [
            {
                title: {
                    pt: "Instrutor de Programacao de Software",
                    en: "Software Programming Instructor",
                },
                startDate: "2023-02",
                endDate: "2023-09",
                description: {
                    pt: "Estruturei a trilha de Computational Thinking para 4 turmas, aumentando a taxa de conclusao dos modulos de 68% para 89% (+21 p.p.) em 6 meses.\nReformulei as aulas de Algorithms com exercicios progressivos, reduzindo o tempo medio de resolucao de desafios de 45 para 28 minutos (-38%).\nPadronizei o conteudo de Programming Fundamentals com pratica guiada, elevando a media das avaliacoes de 6,7 para 8,4 (+25%) no semestre.\nImplementei rotinas semanais de Problem Solving com revisao de erros, aumentando a taxa de acerto na primeira tentativa de 52% para 76% (+24 p.p.).\nConduzi projetos praticos de Software Development em equipe, aumentando a entrega de projetos completos de 61% para 87% (+26 p.p.) e reduzindo retrabalho em 34%.",
                    en: "Structured the Computational Thinking track for 4 classes, increasing module completion rates from 68% to 89% (+21 p.p.) in 6 months.\nRedesigned Algorithms classes with progressive exercises, reducing average challenge resolution time from 45 to 28 minutes (-38%).\nStandardized Programming Fundamentals content with guided practice, raising average assessment scores from 6.7 to 8.4 (+25%) in the semester.\nImplemented weekly Problem Solving routines with error review, increasing first-attempt accuracy from 52% to 76% (+24 p.p.).\nLed hands-on Software Development team projects, increasing complete project delivery from 61% to 87% (+26 p.p.) and reducing rework by 34%.",
                },
                skills: [
                    "Computational Thinking",
                    "Algorithms",
                    "Programming Fundamentals",
                    "Problem Solving",
                    "Software Development",
                ],
            },
        ],
    },
    {
        slug: "lecex",
        name: "LECEX",
        website: "https://www.lecex.com",
        location: {
            pt: "Santos, SP, Brasil",
            en: "Santos, SP, Brazil",
        },
        employmentType: {
            pt: "CLT",
            en: "Full-time employee",
        },
        summary: {
            pt: "Evolui de estagiario para analista junior, fortalecendo automacoes, relatorios e processos analiticos.",
            en: "Progressed from intern to junior analyst, improving automation, reporting, and analytics workflows.",
        },
        roles: [
            {
                title: {
                    pt: "Estagiario de Dados",
                    en: "Data Analyst Intern",
                },
                startDate: "2023-09",
                endDate: "2023-12",
                description: {
                    pt: "Automatizei relatorios de marketing via API do Google Analytics, usando Google Analytics API e Python, melhorando os resultados das campanhas de marketing em 70%.\nDesenvolvi dashboard de dados de marketing em Power BI, usando SQL para modelagem das consultas, facilitando a interpretacao de campanhas.\nDesenvolvi dashboard de analise de dados de frete em Power BI, usando SQL e Python para consolidacao da base, diminuindo o gasto com armadores em 22%.",
                    en: "Automated marketing reports through the Google Analytics API using Google Analytics API and Python, improving marketing campaign results by 70%.\nDeveloped a marketing data dashboard in Power BI, using SQL for query modeling, making campaign interpretation easier.\nDeveloped a freight data analysis dashboard in Power BI, using SQL and Python to consolidate the dataset, reducing shipping carrier costs by 22%.",
                },
                skills: [
                    "SQL",
                    "Data Analysis",
                    "Web Scraping",
                    "Google Analytics",
                    "Data Processing",
                ],
            },
            {
                title: {
                    pt: "Analista de Dados Junior",
                    en: "Data Analyst Junior",
                },
                startDate: "2023-12",
                endDate: "2024-11",
                description: {
                    pt: "Implementei scraping completo e automatico de dados de frete, usando Python e Web Scraping, poupando 20 horas de trabalho manual por semana.\nAutomatizei a migracao de banco de dados, usando Python e SQL para migrar dados de MySQL para PostgreSQL, possibilitando levar novos dados ao novo sistema.\nAutomatizei publicacoes no site da empresa, usando Docker, PHP e Python, poupando 10 horas semanais.",
                    en: "Implemented complete and automated freight data scraping using Python and web scraping, saving 20 hours of manual work per week.\nAutomated database migration using Python and SQL to migrate data from MySQL to PostgreSQL, enabling new data ingestion into the new system.\nAutomated website publishing workflows using Docker, PHP, and Python, saving 10 hours per week.",
                },
                skills: [
                    "Python",
                    "PostgreSQL",
                    "Web Scraping",
                    "Data Automation",
                    "Google Analytics",
                ],
            },
        ],
    },
    {
        slug: "cp-legal-claims",
        name: "CP Legal Claims",
        website: "https://cplc.com.br",
        location: {
            pt: "Sao Paulo, SP, Brasil",
            en: "Sao Paulo, SP, Brazil",
        },
        employmentType: {
            pt: "PJ",
            en: "Independent contractor",
        },
        summary: {
            pt: "Evolui de analista para engenheiro junior, escalando pipelines de ETL e a operacao analitica.",
            en: "Progressed from analyst to junior engineer, scaling ETL pipelines and analytics operations.",
        },
        roles: [
            {
                title: {
                    pt: "Analista de Dados Junior",
                    en: "Data Analyst Junior",
                },
                startDate: "2024-11",
                endDate: "2025-03",
                description: {
                    pt: "Resolvi inconsistencias de dados financeiros usando SQL no BigQuery e Python no Hex.app, disponibilizando dados financeiros diarios para investidores.\nCriei dashboards comerciais com filtros dinamicos em Power BI e SQL, usados semanalmente pela equipe de vendas para decisoes estrategicas.\nAutomatizei alertas por e-mail para divergencias no HubSpot com Python e integracao de dados, reduzindo cerca de 15 horas de retrabalho por semana.",
                    en: "Resolved financial data inconsistencies using SQL in BigQuery and Python in Hex.app, enabling daily financial data availability for investors.\nBuilt commercial dashboards with dynamic filters in Power BI and SQL, used weekly by the sales team for strategic decisions.\nAutomated email alerts for HubSpot data divergences using Python and data integration routines, reducing rework by around 15 hours per week.",
                },
                skills: [
                    "SQL",
                    "PostgreSQL",
                    "Power BI",
                    "Python",
                    "Data Analysis",
                ],
            },
            {
                title: {
                    pt: "Engenheiro de Dados Junior",
                    en: "Data Engineer Junior",
                },
                startDate: "2025-03",
                endDate: "2025-09",
                description: {
                    pt: "Configurei ETL via API do HubSpot com Python e BigQuery, substituindo aproximadamente 16 horas semanais de trabalho manual.\nEstruturei pipelines ETL com dbt e Data Vault para padronizar dados do HubSpot, aumentando a consistencia dos relatorios.\nAutomatizei a coleta do Diario Oficial com AWS Lambda, S3 e Python, garantindo extracao continua de dados juridicos.\nModelei armazenamento e consulta de dados nao estruturados com MongoDB, melhorando o registro e a rastreabilidade de processos.\nModelei e carreguei dados analiticos no BigQuery com SQL, otimizando a identificacao de processos relevantes.\nDesenvolvi algoritmos em Python e SQL para detectar transito em julgado, prazos e valores, acelerando analises juridicas em ate 70%.",
                    en: "Configured ETL through the HubSpot API using Python and BigQuery, replacing approximately 16 hours of manual work per week.\nStructured ETL pipelines with dbt and Data Vault to standardize HubSpot data, improving report consistency.\nAutomated Brazilian Official Gazette (Diario Oficial) data collection with AWS Lambda, S3, and Python, ensuring continuous legal data extraction.\nModeled storage and querying of unstructured data with MongoDB, improving process tracking and traceability.\nModeled and loaded analytical data in BigQuery with SQL, improving identification of relevant legal cases.\nDeveloped algorithms in Python and SQL to detect final judgment status, deadlines, and values, accelerating legal analysis by up to 70%.",
                },
                skills: [
                    "Python",
                    "PostgreSQL",
                    "ETL",
                    "Data Pipelines",
                    "Docker",
                ],
            },
        ],
    },
    {
        slug: "linus",
        name: "Linus",
        website: "https://www.uselinus.com.br",
        location: {
            pt: "Sao Paulo, SP, Brasil",
            en: "Sao Paulo, SP, Brazil",
        },
        employmentType: {
            pt: "CLT",
            en: "Full-time employee",
        },
        summary: {
            pt: "Construo e mantenho pipelines ETL/ELT, camadas analiticas e dashboards para areas de negocio.",
            en: "Build and maintain ETL/ELT pipelines, analytics layers, and business dashboards.",
        },
        roles: [
            {
                title: {
                    pt: "Engenheiro de Dados",
                    en: "Data Engineer",
                },
                startDate: "2026-01",
                endDate: null,
                description: {
                    pt: "Desenvolvi pipelines ETL/ELT para integrar dados de plataformas como Shopify, Omie e Tiny ERP, usando Python e BigQuery, aumentando a confiabilidade e disponibilidade dos dados para analise.\nModelei camadas analiticas no BigQuery com SQL, garantindo reporting confiavel para as areas de negocio.\nConstrui dashboards estrategicos para vendas, marketing e operacoes em ferramentas de BI, acelerando o acompanhamento de KPIs e a tomada de decisao.\nRealizei deploy de APIs e automacoes com Docker na GCP, padronizando a entrega e estabilidade dos servicos de dados.",
                    en: "Developed ETL/ELT pipelines to integrate data from platforms such as Shopify, Omie, and Tiny ERP using Python and BigQuery, increasing data reliability and availability for analytics.\nModeled analytical layers in BigQuery with SQL, ensuring reliable reporting for business areas.\nBuilt strategic dashboards for sales, marketing, and operations in BI tools, accelerating KPI tracking and decision-making.\nDeployed APIs and automations with Docker on GCP, standardizing delivery and stability of data services.",
                },
                skills: [
                    "Python",
                    "ETL/ELT",
                    "BigQuery",
                    "Data Modeling",
                    "Dashboards",
                    "Docker",
                    "GCP",
                ],
            },
        ],
    },
    {
        slug: "excel-santos",
        name: "Excel Santos",
        website: "https://excelsantos.com.br",
        location: {
            pt: "Santos, SP, Brasil",
            en: "Santos, SP, Brazil",
        },
        employmentType: {
            pt: "PJ",
            en: "Independent contractor",
        },
        summary: {
            pt: "Liderei fluxos de engenharia e analise de dados com ETL, modelagem relacional e BI.",
            en: "Led data engineering and analytics workflows with ETL automation, relational modeling, and BI.",
        },
        roles: [
            {
                title: {
                    pt: "Engenheiro de Dados",
                    en: "Data Engineer",
                },
                startDate: "2025-09",
                endDate: null,
                description: {
                    pt: "Automatizei o scraping de cotacoes de frete maritimo (Maersk, CMA, MSC e ONE) usando Python e Playwright, centralizando dados de cotacao para analise e comparacao operacional.\nCriei pipelines de dados e dashboards no Power BI integrados ao SharePoint e Salesforce, usando Python e SQL, melhorando a visibilidade de indicadores comerciais e operacionais.\nModelei e analisei dados logisticos e financeiros para KPIs operacionais e comerciais, usando SQL, Pandas e Power BI, apoiando o acompanhamento continuo de performance.\nAutomatizei a extracao e validacao de documentos de importacao com Python e OpenAI API, reduzindo etapas manuais e aumentando a confiabilidade da conferencia documental.",
                    en: "Automated ocean freight quote scraping (Maersk, CMA, MSC, and ONE) using Python and Playwright, centralizing quote data for operational analysis and comparison.\nBuilt data pipelines and Power BI dashboards integrated with SharePoint and Salesforce using Python and SQL, improving visibility of commercial and operational indicators.\nModeled and analyzed logistics and financial data for operational and commercial KPIs using SQL, Pandas, and Power BI, supporting continuous performance tracking.\nAutomated import document extraction and validation with Python and the OpenAI API, reducing manual steps and improving document review reliability.",
                },
                skills: [
                    "Python",
                    "SQL",
                    "PostgreSQL",
                    "ETL",
                    "Data Pipelines",
                    "Power BI",
                    "API Integration",
                    "Web Scraping",
                    "Docker",
                ],
            },
        ],
    },
];

export const experiences: ExperienceCompany[] = experienceCompaniesSeed
    .map(buildCompany)
    .sort((a, b) => {
        const bEnd = parseDateWeight(b.totalPeriod.endDate);
        const aEnd = parseDateWeight(a.totalPeriod.endDate);

        if (bEnd !== aEnd) {
            return bEnd - aEnd;
        }

        return parseDateWeight(b.totalPeriod.startDate) - parseDateWeight(a.totalPeriod.startDate);
    });

export function getLocalizedText(text: LocalizedText, language: SupportedLanguage): string {
    return text[language] ?? text.en;
}

export function getExperienceBySlug(slug: string): ExperienceCompany | undefined {
    return experiences.find((company) => company.slug === slug);
}

export function formatExperienceDate(
    date: ExperienceDate,
    language: SupportedLanguage,
    options: { yearOnly?: boolean } = {}
): string {
    if (options.yearOnly) {
        return date.slice(0, 4);
    }

    return new Intl.DateTimeFormat(LOCALE_BY_LANGUAGE[language], {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(parseMonthDate(date));
}

export function formatExperiencePeriod(
    period: ExperiencePeriod,
    language: SupportedLanguage,
    options: { yearOnly?: boolean } = {}
): string {
    const start = formatExperienceDate(period.startDate, language, options);
    const end = period.endDate
        ? formatExperienceDate(period.endDate, language, options)
        : PRESENT_LABELS[language];

    return `${start} - ${end}`;
}

export function getExperienceDurationMonths(
    period: ExperiencePeriod,
    referenceDate = new Date()
): number {
    const { year: startYear, month: startMonth } = parseDateParts(period.startDate);

    const endYear = period.endDate
        ? parseDateParts(period.endDate).year
        : referenceDate.getUTCFullYear();

    const endMonth = period.endDate
        ? parseDateParts(period.endDate).month
        : referenceDate.getUTCMonth() + 1;

    const monthCount = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

    return monthCount > 0 ? monthCount : 1;
}

export function formatExperienceDuration(
    period: ExperiencePeriod,
    language: SupportedLanguage
): string {
    const monthCount = getExperienceDurationMonths(period);

    if (language === "pt") {
        return monthCount === 1 ? "1 mes" : `${monthCount} meses`;
    }

    return monthCount === 1 ? "1 month" : `${monthCount} months`;
}
