# Personal Portfolio

Personal portfolio repository.

## Visao Geral

- SPA com rotas principais (`/about`, `/work`, `/journey`, `/reach`)
- Compatibilidade legada para (`/home`, `/projects`, `/experiences`, `/contact`)
- Pagina dedicada por projeto (`/work/:slug`)
- Internacionalizacao (PT/EN) com `i18next`
- Conteudo orientado a dados via arquivos de configuracao
- Ambientes Docker para desenvolvimento e producao

## Stack

- `React 19` + `TypeScript`
- `Vite`
- `React Router`
- `i18next` / `react-i18next`
- `Tailwind CSS`
- `Framer Motion`
- `Embla Carousel`
- `Three.js` (`@react-three/fiber`, `@react-three/drei`)

## Estrutura do Projeto

```text
personal-portfolio/
  public/
    cv/
    fonts/
    images/
      flags/
      projects/
  src/
    components/
    data/
      profile.ts
      projects.json
      projectDetails.ts
    locales/
      pt.json
      en.json
    pages/
    utils/
      i18n.ts
  Dockerfile
  Dockerfile.dev
  docker-compose.yml
  nginx.conf
```

## Requisitos

- `Node.js` 20+
- `npm` 10+
- Docker + Docker Compose (opcional)

## Configuracao de Ambiente

1. Crie o arquivo `.env` com base no exemplo:

```bash
cp .env.example .env
```

2. Defina a chave do Web3Forms:

```env
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key_here
```

## Execucao Local

```bash
npm ci
npm run dev
```

Aplicacao: `http://127.0.0.1:5173`

## Docker

### Desenvolvimento (hot reload)

```bash
docker compose up --build app-dev
```

Aplicacao: `http://127.0.0.1:5173`

### Producao (build + nginx)

```bash
docker compose up --build app-prod
```

Aplicacao: `http://127.0.0.1:8080`

O `nginx.conf` inclui fallback SPA para refresh direto em qualquer rota da aplicacao.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Gestao de Conteudo

- Dados pessoais e links: `src/data/profile.ts`
- Cards de projetos (ordem, imagem, tags): `src/data/projects.json`
- Conteudo detalhado por projeto: `src/data/projectDetails.ts`
- Traducoes: `src/locales/pt.json` e `src/locales/en.json`

## Build de Producao

```bash
npm run build
```

Artefatos gerados em `dist/`.
