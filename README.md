<br />
<h1 align="center">Emat Monorepo</h1>
# Emat Monorepo

✅ &nbsp;NX monorepo<br>
✅ &nbsp;NgRx store (Redux pattern)<br>
✅ &nbsp;Angular v15 Component-First Architecture<br>
✅ &nbsp;Server Side Render (Universal)<br>
✅ &nbsp;Angular Material<br>
✅ &nbsp;OnPush Change Detection<br>
✅ &nbsp;Smart components y Presentational components<br>
<hr />

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![](https://img.shields.io/badge/monorepo-Nx-blue)](https://nx.dev/)
![npm peer dependency version (scoped)](https://img.shields.io/npm/dependency-version/eslint-config-prettier/peer/eslint)
![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)

## Getting Started

- Run git clone https://github.com/uell-tech/monorepo-test.git emat-monorepo
- Run `yarn install`

## Development server

Run `yarn nx serve emat-portal` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Server Side Render Development server

Run `yarn nx run emat-portal:serve-ssr` for a SSR dev server.

## Understand this workspace

Run `yarn nx graph` to see a diagram of the dependencies of the projects.

## Running end-to-end tests

Run `yarn nx e2e emat-portal-e2e` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `yarn nx affected:e2e` to execute the end-to-end tests affected by a change.

## Running unit tests

Run `yarn nx test emat-portal` to execute the unit tests via [Jest](https://jestjs.io).

Run `yarn nx affected:test` to execute the unit tests affected by a change.

## Generate an application

Run `nx g @nrwl/angular:app my-app` to generate an application.

> When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/angular:lib my-lib` to generate a library.

> Libraries are shareable across libraries and applications. They can be imported from `@emat/mylib`.

## Code scaffolding

Run `nx g @nrwl/angular:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
