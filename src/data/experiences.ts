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
                    pt: "- Planejei e ministrei aulas de programacao com foco em algoritmos, pensamento computacional e resolucao de problemas.\n- Introduzi fundamentos de programacao por meio de projetos praticos e desenvolvimento de jogos.\n- Estruturei materiais didaticos para ensinar fluxo de controle, variaveis e design de algoritmos.\n- Orientei praticas de depuracao e desenvolvimento iterativo.\n- Estimulei pensamento analitico e decomposicao estruturada de problemas.",
                    en: "- Designed and delivered programming classes focused on algorithms, computational thinking, and logical problem solving.\n- Introduced students to programming fundamentals through project-based learning and game development.\n- Developed structured learning materials to teach concepts such as control flow, variables, and algorithm design.\n- Guided students through debugging practices and iterative development.\n- Fostered analytical thinking and structured problem decomposition.",
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
                    pt: "- Apoiei a construcao de relatorios automatizados e planilhas analiticas para marketing e performance financeira.\n- Realizei extracao de dados e tarefas iniciais de web scraping em fontes externas.\n- Contribui para relatorios analiticos com dados do Google Analytics.\n- Escrevi consultas SQL para recuperar e organizar bases de dados.\n- Apoiei iniciativas de automacao para melhorar fluxos internos de report.",
                    en: "- Assisted in building automated reports and analytical spreadsheets for marketing and financial performance analysis.\n- Performed data extraction and basic web scraping tasks from external sources.\n- Supported the development of analytical reports using Google Analytics data.\n- Wrote SQL queries to retrieve and organize datasets for analysis.\n- Contributed to automation initiatives improving internal reporting workflows.",
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
                    pt: "- Automatizei fluxos analiticos com Python para aumentar eficiencia no processamento e reporting.\n- Extrai e processei dados de multiplas fontes com web scraping e integracoes de API.\n- Construi dashboards e relatorios de performance com dados do Google Analytics.\n- Trabalhei com PostgreSQL para estruturar, consultar e transformar dados para analise.\n- Contribui para o desenvolvimento de um sistema interno integrando multiplos bancos SQL.",
                    en: "- Automated analytical workflows using Python to improve efficiency in data processing and reporting.\n- Extracted and processed data from multiple sources through web scraping and API integrations.\n- Built dashboards and performance reports using Google Analytics data.\n- Worked with PostgreSQL to structure, query, and transform datasets for analytical use.\n- Contributed to the development of an internal system integrating multiple SQL databases.",
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
                    pt: "- Consultei e transformei datasets em PostgreSQL para suportar relatorios analiticos e operacionais.\n- Desenvolvi processos de ETL para integrar dados internos e externos.\n- Criei dashboards e relatorios analiticos em Power BI e HEX.\n- Processei e analisei dados com Python, Pandas e NumPy.\n- Entreguei insights por meio de analise exploratoria e estatistica.",
                    en: "- Queried and transformed datasets using PostgreSQL to support analytical and operational reporting.\n- Built ETL processes to integrate data from multiple internal and external sources.\n- Developed dashboards and analytical reports using Power BI and HEX.\n- Processed and analyzed datasets using Python with Pandas and NumPy.\n- Delivered insights through exploratory and statistical data analysis.",
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
                    pt: "- Desenhei e otimizei pipelines de ETL para integrar grandes volumes de dados entre sistemas.\n- Desenvolvi fluxos automatizados em Python para transformacao e processamento de dados.\n- Modelei bancos relacionais e otimizei queries em ambientes PostgreSQL.\n- Estruturei pipelines que suportavam fluxos de analise preditiva.\n- Implementei servicos containerizados com Docker para melhorar confiabilidade de deploy.",
                    en: "- Designed and optimized ETL pipelines integrating large datasets across multiple systems.\n- Developed automated data workflows using Python for data transformation and processing.\n- Modeled relational databases and optimized queries in PostgreSQL environments.\n- Built data pipelines supporting predictive analytics workflows.\n- Implemented containerized services using Docker to improve deployment reliability.",
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
                    pt: "- Desenvolvi pipelines ETL/ELT para integrar dados de plataformas como Shopify, Omie e Tiny ERP.\n- Modelei camadas analiticas no BigQuery para reporting confiavel.\n- Construi dashboards estrategicos para vendas, marketing e operacoes.\n- Realizei deploy de APIs e automacoes em Docker na GCP.",
                    en: "- Developed ETL/ELT pipelines integrating data from platforms such as Shopify, Omie, and Tiny ERP.\n- Modeled analytics layers in BigQuery for reliable reporting.\n- Built strategic dashboards for sales, marketing, and operations.\n- Deployed APIs and automations in Docker on GCP.",
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
                    pt: "- Desenhei e implementei pipelines ETL integrando dados de multiplos sistemas internos e externos.\n- Desenvolvi fluxos automatizados em Python para processar e transformar dados.\n- Modelei e otimizei bancos relacionais com PostgreSQL e SQL Server.\n- Construi dashboards interativos em Power BI para inteligencia de negocio e monitoramento operacional.\n- Implementei integracoes via API e web scraping para coleta de dados externos.\n- Automatizei processos de report e ingestao de dados para ganho de eficiencia operacional.",
                    en: "- Designed and implemented ETL pipelines integrating data from multiple internal and external systems.\n- Developed automated data workflows using Python to process and transform datasets.\n- Modeled and optimized relational databases using PostgreSQL and SQL Server.\n- Built interactive dashboards in Power BI supporting business intelligence and operational monitoring.\n- Implemented API integrations and web scraping solutions for external data collection.\n- Automated reporting processes and data ingestion workflows to improve operational efficiency.",
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
