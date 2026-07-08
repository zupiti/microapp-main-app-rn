# workspace-shell-yarn

## Purpose

Definir o shell privado `poc` como agregador de desenvolvimento: Yarn Workspaces + git submodules, sem instalação recursiva de dependências.

## Requirements

### Requirement: Shell privado na raiz

A raiz do repositório `poc` MUST ser um package privado (`"private": true`) que lista todos os packages locais em `"workspaces"` e NÃO MUST ser publicado no registry.

#### Scenario: package.json da raiz

- **WHEN** um desenvolvedor ou agente inspeciona a raiz
- **THEN** MUST existir `package.json` com `"private": true` e `"workspaces"` incluindo `microapp-main-app`, cada `microapp*` e cada `microfront*`

### Requirement: Instalação única na raiz

Dependências MUST ser instaladas apenas na raiz do shell.

#### Scenario: setup diário

- **WHEN** o desenvolvedor prepara o ambiente local
- **THEN** MUST executar `yarn` (ou `yarn install`) somente na raiz `poc/`
- **AND** MUST NOT executar `yarn install` / `npm install` dentro de `microapp*` ou `microfront*` para o fluxo normal de desenvolvimento

### Requirement: Sem node_modules recursivo

Após o install da raiz, MUST existir no máximo um `node_modules` de workspace na raiz do shell (packages filhos NÃO MUST exigir `node_modules` próprio para resolver dependências do grafo).

#### Scenario: verificação pós-install

- **WHEN** `yarn` conclui com sucesso na raiz
- **THEN** as dependências dos workspaces MUST ser resolvidas via hoisting/symlinks em `poc/node_modules`
- **AND** o mainapp MUST subir com `yarn start` (ou `yarn workspace microapp-main-app start`) sem instalar nas libs

### Requirement: Resolutions alinhadas de React

A raiz MUST declarar `resolutions` (ou equivalente Yarn) alinhando `react` e `react-native` às versões do mainapp.

#### Scenario: evitar React duplicado

- **WHEN** microapps/microfronts declaram `peerDependencies` de `react` / `react-native`
- **THEN** o grafo do workspace MUST resolver uma única versão efetiva compatível com o mainapp
