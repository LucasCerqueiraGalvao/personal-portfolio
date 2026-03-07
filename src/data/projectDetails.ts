type LocalizedText = {
    pt: string;
    en: string;
};

type ProjectLinks = {
    repository?: string;
    demo?: string;
    docs?: string;
};

type ProjectStatus = "public" | "private" | "offline" | "nda";

export type ProjectSlug =
    | "event_driven_integration_api_on_gcp"
    | "fiscal_data_platform_emissions_product_analytics"
    | "legal_data_intelligence_platform"
    | "crm_analytics_platform_dbt_data_vault"
    | "enterprise_data_validation_framework"
    | "documents_reader"
    | "cotation_scraper"
    | "codex_discord_gateway"
    | "ic_machine_learning"
    | "tech_case_analista_de_dados_jr"
    | "pcg_analise_de_dados"
    | "aes_code_in_c"
    | "lucas_personal_portfolio";

export type ProjectDetailSection = {
    id: "context" | "challenge" | "solution" | "results" | "notes";
    title: LocalizedText;
    content: LocalizedText;
};

export type ProjectDetail = {
    slug: ProjectSlug;
    summary: LocalizedText;
    stack: string[];
    highlights: LocalizedText[];
    links: ProjectLinks;
    status: ProjectStatus;
    featuredImage?: string;
    sections: ProjectDetailSection[];
};

export const projectDetailOrder: ProjectSlug[] = [
    "event_driven_integration_api_on_gcp",
    "fiscal_data_platform_emissions_product_analytics",
    "legal_data_intelligence_platform",
    "crm_analytics_platform_dbt_data_vault",
    "enterprise_data_validation_framework",
    "documents_reader",
    "cotation_scraper",
    "codex_discord_gateway",
    "ic_machine_learning",
    "tech_case_analista_de_dados_jr",
    "pcg_analise_de_dados",
    "aes_code_in_c",
    "lucas_personal_portfolio",
];

export const projectDetails: Record<ProjectSlug, ProjectDetail> = {
    event_driven_integration_api_on_gcp: {
        slug: "event_driven_integration_api_on_gcp",
        summary: {
            pt: "API de integracao orientada a eventos em GCP com Flask, Docker e webhooks.",
            en: "Event-driven integration API on GCP with Flask, Docker, and webhooks.",
        },
        stack: [
            "Python",
            "Flask",
            "Docker",
            "Cloud Run",
            "Cloud Build",
            "Webhooks",
        ],
        highlights: [
            {
                pt: "Arquitetura de integracao em producao com validacao de token, dry-run e logs estruturados.",
                en: "Production-grade integration architecture with token validation, dry-run mode, and structured logs.",
            },
            {
                pt: "Pipeline de deploy automatizado para build, registry e publicacao continua.",
                en: "Automated deployment pipeline for build, registry, and continuous release.",
            },
        ],
        links: {},
        status: "nda",
        sections: [
            {
                id: "context",
                title: {
                    pt: "Contexto",
                    en: "Context",
                },
                content: {
                    pt: "Projeto de integracao para processar eventos de sistemas externos com confiabilidade operacional.",
                    en: "Integration project designed to process external system events with operational reliability.",
                },
            },
            {
                id: "solution",
                title: {
                    pt: "Solucao",
                    en: "Solution",
                },
                content: {
                    pt: "API Flask containerizada recebendo webhook trigger, validando autenticacao e enriquecendo dados antes do envio final.",
                    en: "Containerized Flask API receiving webhook triggers, validating authentication, and enriching data before final delivery.",
                },
            },
            {
                id: "results",
                title: {
                    pt: "Resultados",
                    en: "Results",
                },
                content: {
                    pt: "Fluxo padronizado de integracao com operacao segura, observabilidade e capacidade de escalar por novos eventos.",
                    en: "Standardized integration flow with safe operation, observability, and scalability for new event types.",
                },
            },
        ],
    },
    fiscal_data_platform_emissions_product_analytics: {
        slug: "fiscal_data_platform_emissions_product_analytics",
        summary: {
            pt: "Plataforma fiscal e de produto para emissoes, reconciliacao e analytics.",
            en: "Fiscal and product platform for emissions, reconciliation, and analytics.",
        },
        stack: [
            "Python",
            "SQL",
            "BigQuery",
            "XML Parsing",
            "Data Modeling",
            "BI",
        ],
        highlights: [
            {
                pt: "Conversao de dados fiscais semiestruturados em camada analitica auditavel.",
                en: "Transformation of semi-structured fiscal data into an auditable analytics layer.",
            },
            {
                pt: "Modelagem relacional de materiais e SKUs com consistencia referencial para BI.",
                en: "Relational modeling of materials and SKUs with referential consistency for BI.",
            },
        ],
        links: {},
        status: "nda",
        sections: [
            {
                id: "challenge",
                title: {
                    pt: "Desafio",
                    en: "Challenge",
                },
                content: {
                    pt: "Unificar fontes fiscais heterogeneas mantendo rastreabilidade e qualidade para uso analitico.",
                    en: "Unify heterogeneous fiscal sources while preserving traceability and quality for analytics use.",
                },
            },
            {
                id: "solution",
                title: {
                    pt: "Solucao",
                    en: "Solution",
                },
                content: {
                    pt: "Pipeline com parsing de XML, deduplicacao entre fontes, reconciliacao e modelagem em camadas raw/silver/gold.",
                    en: "Pipeline with XML parsing, cross-source deduplication, reconciliation, and raw/silver/gold modeling.",
                },
            },
            {
                id: "results",
                title: {
                    pt: "Resultados",
                    en: "Results",
                },
                content: {
                    pt: "Base confiavel para analises de emissao, vendas e perfil de consumo com apoio a decisao executiva.",
                    en: "Reliable foundation for emissions, sales, and consumption profile analytics to support executive decisions.",
                },
            },
        ],
    },
    legal_data_intelligence_platform: {
        slug: "legal_data_intelligence_platform",
        summary: {
            pt: "Plataforma juridica com ingestao serverless, regras de eventos e camada analitica.",
            en: "Legal platform with serverless ingestion, event rules, and analytics layers.",
        },
        stack: ["Python", "AWS Lambda", "S3", "MongoDB", "BigQuery", "SQL"],
        highlights: [
            {
                pt: "Captura automatizada de publicacoes juridicas com persistencia orientada a escala.",
                en: "Automated legal publication ingestion with scale-oriented persistence.",
            },
            {
                pt: "Motor de deteccao de eventos processuais para acelerar analise operacional.",
                en: "Procedural event detection engine to accelerate operational analysis.",
            },
        ],
        links: {},
        status: "nda",
        sections: [
            {
                id: "context",
                title: {
                    pt: "Contexto",
                    en: "Context",
                },
                content: {
                    pt: "Necessidade de transformar dados juridicos publicos em informacao util para acompanhamento recorrente.",
                    en: "Need to transform public legal data into useful information for recurring monitoring.",
                },
            },
            {
                id: "solution",
                title: {
                    pt: "Solucao",
                    en: "Solution",
                },
                content: {
                    pt: "Arquitetura em etapas com coleta serverless, parsing textual, deteccao de marcos processuais e modelagem analitica.",
                    en: "Stage-based architecture with serverless collection, text parsing, procedural milestone detection, and analytics modeling.",
                },
            },
            {
                id: "results",
                title: {
                    pt: "Resultados",
                    en: "Results",
                },
                content: {
                    pt: "Reducao da operacao manual e aumento de velocidade para analises juridicas e tomada de decisao.",
                    en: "Reduced manual workload and faster legal analytics and decision making.",
                },
            },
        ],
    },
    crm_analytics_platform_dbt_data_vault: {
        slug: "crm_analytics_platform_dbt_data_vault",
        summary: {
            pt: "Plataforma de CRM com DBT, Data Vault e monitoramento de qualidade.",
            en: "CRM platform with DBT, Data Vault, and quality monitoring.",
        },
        stack: ["DBT", "SQL", "Data Vault 2.0", "HubSpot", "Python", "Power BI"],
        highlights: [
            {
                pt: "Modelagem historica com governanca para aumentar confianca dos indicadores comerciais.",
                en: "Historical modeling with governance to increase trust in commercial indicators.",
            },
            {
                pt: "Alertas automaticos para inconsistencias e retrabalho operacional.",
                en: "Automated alerts for inconsistencies and operational rework.",
            },
        ],
        links: {},
        status: "nda",
        sections: [
            {
                id: "challenge",
                title: {
                    pt: "Desafio",
                    en: "Challenge",
                },
                content: {
                    pt: "Resolver baixa consistencia dos dados de CRM e falta de confiabilidade nas metricas de acompanhamento.",
                    en: "Address low CRM data consistency and lack of reliability in monitoring metrics.",
                },
            },
            {
                id: "solution",
                title: {
                    pt: "Solucao",
                    en: "Solution",
                },
                content: {
                    pt: "Implementacao de ETL com DBT e Data Vault, testes de qualidade e camada analitica para dashboards com filtros dinamicos.",
                    en: "ETL implementation with DBT and Data Vault, quality tests, and analytics layers for dashboards with dynamic filters.",
                },
            },
            {
                id: "results",
                title: {
                    pt: "Resultados",
                    en: "Results",
                },
                content: {
                    pt: "Reducao de divergencias, melhoria da governanca e suporte mais rapido para decisao comercial semanal.",
                    en: "Reduced divergences, improved governance, and faster support for weekly commercial decisions.",
                },
            },
        ],
    },
    enterprise_data_validation_framework: {
        slug: "enterprise_data_validation_framework",
        summary: {
            pt: "Framework corporativo de validacao e reconciliacao entre fontes de dados.",
            en: "Enterprise framework for validation and reconciliation across data sources.",
        },
        stack: ["Python", "SQL", "BigQuery", "Pandas", "Observability"],
        highlights: [
            {
                pt: "Reconciliacao por chaves progressivas e classificacao automatica de divergencias.",
                en: "Progressive key reconciliation and automated divergence classification.",
            },
            {
                pt: "Padronizacao de regras de qualidade com trilha de auditoria e alerta proativo.",
                en: "Standardized quality rules with audit trail and proactive alerting.",
            },
        ],
        links: {},
        status: "nda",
        sections: [
            {
                id: "context",
                title: {
                    pt: "Contexto",
                    en: "Context",
                },
                content: {
                    pt: "Diferentes pipelines exigiam padrao unico para confiabilidade e investigacao rapida de inconsistencias.",
                    en: "Different pipelines required a single reliability standard and fast inconsistency investigation.",
                },
            },
            {
                id: "solution",
                title: {
                    pt: "Solucao",
                    en: "Solution",
                },
                content: {
                    pt: "Framework com validacoes estruturais, regras de negocio, deduplicacao, reconciliacao progressiva e observabilidade de incidentes.",
                    en: "Framework with structural validations, business rules, deduplication, progressive reconciliation, and incident observability.",
                },
            },
            {
                id: "results",
                title: {
                    pt: "Resultados",
                    en: "Results",
                },
                content: {
                    pt: "Maior confiabilidade de dados, menor tempo de diagnostico e melhoria continua no ciclo de qualidade.",
                    en: "Higher data reliability, lower diagnosis time, and continuous improvement in the quality cycle.",
                },
            },
        ],
    },
    documents_reader: {
        slug: "documents_reader",
        summary: {
            pt: "Pipeline para leitura de documentos de comercio exterior com OCR e extracao estruturada de dados.",
            en: "Pipeline for foreign trade document processing with OCR and structured data extraction.",
        },
        stack: ["Python", "OCR", "Regex", "Desktop App", "Data Validation"],
        highlights: [
            {
                pt: "Fluxo completo de extracao, comparacao e consolidacao de dados.",
                en: "Complete extraction, comparison, and data consolidation workflow.",
            },
            {
                pt: "Arquitetura preparada para evolucao por estagios.",
                en: "Architecture prepared for staged evolution.",
            },
        ],
        links: {
            repository:
                "https://github.com/LucasCerqueiraGalvao/documents_reader",
        },
        status: "public",
        sections: [
            {
                id: "context",
                title: {
                    pt: "Contexto",
                    en: "Context",
                },
                content: {
                    pt: "Projeto focado em reduzir esforco manual na leitura e validacao de documentos de importacao.",
                    en: "Project focused on reducing manual effort in reading and validating import documents.",
                },
            },
            {
                id: "solution",
                title: {
                    pt: "Solucao",
                    en: "Solution",
                },
                content: {
                    pt: "Separacao em etapas com processamento, comparacao e relatorio final de inconsistencias.",
                    en: "Stage-based processing with comparison and final inconsistency reporting.",
                },
            },
            {
                id: "results",
                title: {
                    pt: "Resultados",
                    en: "Results",
                },
                content: {
                    pt: "Base pronta para operacao recorrente e escalavel com menor dependencia de revisao manual.",
                    en: "Foundation ready for recurring and scalable operation with reduced manual review.",
                },
            },
        ],
    },
    cotation_scraper: {
        slug: "cotation_scraper",
        summary: {
            pt: "Orquestracao de scrapers de cotacao de frete com consolidacao automatica de resultados.",
            en: "Freight quote scraper orchestration with automated result consolidation.",
        },
        stack: ["Python", "Playwright", "Data Pipeline", "Automation"],
        highlights: [
            {
                pt: "Execucao em pipeline diario com limpeza de artefatos e comparacao de precos.",
                en: "Daily pipeline execution with artifact cleanup and price comparison.",
            },
            {
                pt: "Estrutura orientada a operacao continua.",
                en: "Structure designed for continuous operation.",
            },
        ],
        links: {
            repository:
                "https://github.com/LucasCerqueiraGalvao/cotation-scraper",
        },
        status: "public",
        sections: [
            {
                id: "challenge",
                title: {
                    pt: "Desafio",
                    en: "Challenge",
                },
                content: {
                    pt: "Coletar cotacoes de multiplas fontes com padronizacao de formato e consistencia.",
                    en: "Collect quotes from multiple sources with format standardization and consistency.",
                },
            },
            {
                id: "solution",
                title: {
                    pt: "Solucao",
                    en: "Solution",
                },
                content: {
                    pt: "Pipelines desacoplados por fonte e etapa de consolidacao para gerar comparativo final.",
                    en: "Source-decoupled pipelines and a consolidation stage to generate final comparison output.",
                },
            },
            {
                id: "notes",
                title: {
                    pt: "Observacoes",
                    en: "Notes",
                },
                content: {
                    pt: "Estrutura pronta para novos provedores sem reescrever o fluxo principal.",
                    en: "Structure ready for new providers without rewriting the main flow.",
                },
            },
        ],
    },
    codex_discord_gateway: {
        slug: "codex_discord_gateway",
        summary: {
            pt: "Gateway de integracao para automacoes e fluxos orientados a agentes em Discord.",
            en: "Integration gateway for Discord-based automation and agent-driven workflows.",
        },
        stack: ["Python", "Discord", "Automation", "API Integration"],
        highlights: [
            {
                pt: "Projeto recente com potencial para integracoes de produtividade e monitoramento.",
                en: "Recent project with potential for productivity and monitoring integrations.",
            },
        ],
        links: {},
        status: "private",
        sections: [
            {
                id: "context",
                title: {
                    pt: "Contexto",
                    en: "Context",
                },
                content: {
                    pt: "Projeto orientado a integracao de mensagens, comandos e automacoes para uso tecnico.",
                    en: "Project focused on integrating messages, commands, and technical automations.",
                },
            },
            {
                id: "notes",
                title: {
                    pt: "Observacoes",
                    en: "Notes",
                },
                content: {
                    pt: "Detalhes serao expandidos quando a versao publica estiver pronta.",
                    en: "Details will be expanded when a public version is ready.",
                },
            },
        ],
    },
    ic_machine_learning: {
        slug: "ic_machine_learning",
        summary: {
            pt: "Repositorio academico com experimentos de machine learning aplicados a previsao e analise.",
            en: "Academic repository with machine learning experiments for forecasting and analysis.",
        },
        stack: ["Python", "Machine Learning", "Data Analysis"],
        highlights: [
            {
                pt: "Exploracao de tecnicas de modelagem e avaliacao.",
                en: "Exploration of modeling and evaluation techniques.",
            },
        ],
        links: {
            repository:
                "https://github.com/LucasCerqueiraGalvao/IC-Machine-Learning",
        },
        status: "public",
        sections: [
            {
                id: "context",
                title: {
                    pt: "Contexto",
                    en: "Context",
                },
                content: {
                    pt: "Projeto de iniciacao com foco em aprendizagem aplicada e experimentacao orientada a dados.",
                    en: "Initiation project focused on applied learning and data-driven experimentation.",
                },
            },
            {
                id: "results",
                title: {
                    pt: "Resultados",
                    en: "Results",
                },
                content: {
                    pt: "Base de conhecimento para decisoes de modelagem em projetos futuros.",
                    en: "Knowledge base for modeling decisions in future projects.",
                },
            },
        ],
    },
    tech_case_analista_de_dados_jr: {
        slug: "tech_case_analista_de_dados_jr",
        summary: {
            pt: "Case tecnico em notebook para analise de dados, exploracao e comunicacao de conclusoes.",
            en: "Technical notebook case for data analysis, exploration, and conclusion communication.",
        },
        stack: ["Python", "Jupyter", "Data Analysis", "SQL"],
        highlights: [
            {
                pt: "Estruturacao de raciocinio analitico ponta a ponta.",
                en: "End-to-end analytical reasoning structure.",
            },
        ],
        links: {
            repository:
                "https://github.com/LucasCerqueiraGalvao/TECH-CASE-ANALISTA-DE-DADOS-JR",
        },
        status: "public",
        sections: [
            {
                id: "challenge",
                title: {
                    pt: "Desafio",
                    en: "Challenge",
                },
                content: {
                    pt: "Transformar dados brutos em insight acionavel com clareza tecnica.",
                    en: "Turn raw data into actionable insight with technical clarity.",
                },
            },
            {
                id: "solution",
                title: {
                    pt: "Solucao",
                    en: "Solution",
                },
                content: {
                    pt: "Analise exploratoria, tratamento de dados e sintese final para tomada de decisao.",
                    en: "Exploratory analysis, data treatment, and final synthesis for decision-making.",
                },
            },
        ],
    },
    pcg_analise_de_dados: {
        slug: "pcg_analise_de_dados",
        summary: {
            pt: "Projeto de analise de dados energeticos com foco em comparacao e previsao.",
            en: "Energy data analysis project focused on comparison and forecasting.",
        },
        stack: ["Python", "Data Science", "Power BI", "Pandas"],
        highlights: [
            {
                pt: "Limpeza, modelagem e visualizacao de dados em fluxo integrado.",
                en: "Integrated flow for data cleaning, modeling, and visualization.",
            },
        ],
        links: {
            repository:
                "https://github.com/LucasCerqueiraGalvao/pcg-analise-de-dados",
        },
        status: "public",
        sections: [
            {
                id: "context",
                title: {
                    pt: "Contexto",
                    en: "Context",
                },
                content: {
                    pt: "Analise academica para interpretar consumo e comportamento energetico.",
                    en: "Academic analysis to interpret consumption and energy behavior.",
                },
            },
            {
                id: "results",
                title: {
                    pt: "Resultados",
                    en: "Results",
                },
                content: {
                    pt: "Entregas visuais e analiticas voltadas a interpretacao de tendencias.",
                    en: "Visual and analytical deliverables focused on trend interpretation.",
                },
            },
        ],
    },
    aes_code_in_c: {
        slug: "aes_code_in_c",
        summary: {
            pt: "Implementacao de criptografia AES em C com foco em estrutura e desempenho.",
            en: "AES encryption implementation in C focused on structure and performance.",
        },
        stack: ["C", "Cryptography", "Algorithms"],
        highlights: [
            {
                pt: "Projeto importante para demonstrar base forte em algoritmos e baixo nivel.",
                en: "Important project to demonstrate strong algorithmic and low-level foundations.",
            },
        ],
        links: {
            repository: "https://github.com/LucasCerqueiraGalvao/AES-Code-In-C",
        },
        status: "public",
        sections: [
            {
                id: "challenge",
                title: {
                    pt: "Desafio",
                    en: "Challenge",
                },
                content: {
                    pt: "Implementar conceito criptografico com controle de memoria e operacoes eficientes.",
                    en: "Implement cryptographic concepts with memory control and efficient operations.",
                },
            },
            {
                id: "solution",
                title: {
                    pt: "Solucao",
                    en: "Solution",
                },
                content: {
                    pt: "Codigo modular para facilitar entendimento, teste e evolucao tecnica.",
                    en: "Modular code to improve understanding, testing, and technical evolution.",
                },
            },
        ],
    },
    lucas_personal_portfolio: {
        slug: "lucas_personal_portfolio",
        summary: {
            pt: "Portfolio pessoal em React + Vite com foco em apresentacao de cases e experiencia profissional.",
            en: "Personal portfolio built with React + Vite focused on showcasing projects and professional experience.",
        },
        stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "i18next"],
        highlights: [
            {
                pt: "Base escalavel para evoluir layout, rotas e paginas dedicadas por projeto.",
                en: "Scalable foundation to evolve layout, routes, and dedicated project pages.",
            },
        ],
        links: {
            repository:
                "https://github.com/LucasCerqueiraGalvao/personal-portfolio",
        },
        status: "public",
        sections: [
            {
                id: "context",
                title: {
                    pt: "Contexto",
                    en: "Context",
                },
                content: {
                    pt: "Projeto principal para consolidar identidade tecnica e narrativa de carreira.",
                    en: "Main project to consolidate technical identity and career narrative.",
                },
            },
            {
                id: "solution",
                title: {
                    pt: "Solucao",
                    en: "Solution",
                },
                content: {
                    pt: "Arquitetura com i18n, rotas reais e estrutura de dados para detalhamento de projetos.",
                    en: "Architecture with i18n, real routes, and data structures for detailed project pages.",
                },
            },
        ],
    },
};
