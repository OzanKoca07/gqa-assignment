# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```



# GQA Portal – Technical Assignment

This project implements a simplified clinical study workflow:
- Studies
- Visit Templates (day + window)
- Form Templates + Form Fields
- Attach Forms to Visit Templates
- Subjects + Scheduled Visits generation
- Form data entry + submissions

## Tech Stack
- Backend: NestJS + Prisma + PostgreSQL
- Frontend: React + React Router + TanStack Query
- DB: PostgreSQL (docker)

## Prerequisites
- Docker + Docker Compose

## Run with Docker (Recommended)
```bash
docker compose up --build

Frontend: http://localhost:5173

Backend: http://localhost:3001

Environment
Backend uses backend/.env, frontend uses frontend/.env.

Quick Demo Flow

-Create a Study

-Create Visit Templates

-Create Form Templates and add fields

-Attach forms to a visit template

-Create a Subject with enrollment date

-Generate scheduled visits

-Open a scheduled visit → open a form → submit

-View submissions list

API

-Studies

POST /studies

GET /studies

-Visit Templates

POST /studies/:studyId/visit-templates

GET /studies/:studyId/visit-templates

-Form Templates + Fields

POST /studies/:studyId/form-templates

POST /studies/:studyId/form-templates/:formTemplateId/fields

-Attach Forms to Visit Template

POST /studies/:studyId/visit-templates/:visitTemplateId/forms

GET /studies/:studyId/visit-templates/:visitTemplateId/forms

DELETE /studies/:studyId/visit-templates/:visitTemplateId/forms/:formTemplateId

-Subjects + Scheduled Visits

POST /studies/:studyId/subjects

POST /studies/:studyId/subjects/:subjectId/scheduled-visits/generate

GET /studies/:studyId/subjects/:subjectId/scheduled-visits

-Submissions

POST /studies/:studyId/subjects/:subjectId/scheduled-visits/:scheduledVisitId/forms/:formTemplateId/submissions

GET /studies/:studyId/subjects/:subjectId/scheduled-visits/:scheduledVisitId/submissions

# Tests (Backend e2e)
- npm run test:e2e

## Notes / Tradeoffs


# Test çalıştırma

docker exec -it gqa_backend sh
npm test
npm run test:e2e

## ENV notları
backend/.env içinde DATABASE_URL docker için şöyle olmalı:
- postgresql://gqa:gqa_pass@db:5432/gqa_db

postgresql://gqa:gqa_pass@db:5432/gqa_db
- VITE_API_URL=http://localhost:3001
