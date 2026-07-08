## ADDED Requirements

### Requirement: Configuração canônica microapps.yaml

O shell MUST manter um arquivo `microapps.yaml` na raiz com `packages`, `mainApp`, `graph`, `scopes` e `localDependencyRange`.

#### Scenario: listar packages do workspace

- **WHEN** o desenvolvedor executa `yarn microapps list`
- **THEN** o CLI MUST listar exatamente os packages declarados em `microapps.yaml#packages`

### Requirement: Bootstrap estilo Melos

O comando `yarn microapps bootstrap` (alias `yarn bootstrap`) MUST preparar o ambiente local completo sem install dentro de cada package.

#### Scenario: bootstrap

- **WHEN** o desenvolvedor executa `yarn bootstrap`
- **THEN** o sistema MUST (1) atualizar submodules se `.gitmodules` existir, (2) rodar `yarn install` só na raiz, (3) aplicar `point-local`, (4) limpar `node_modules` aninhados e (5) passar em `validate`

### Requirement: Point-local do grafo

O comando `yarn microapps point-local` MUST reescrever as dependências do grafo (`consumer → providers`) para o range local (`*` no Yarn Classic ou `workspace:*` no Berry).

#### Scenario: apontar microapps e microfronts locais

- **WHEN** `point-local` é executado
- **THEN** `microapp-main-app-rn` MUST depender de `microapp*-rn` via range local
- **AND** cada `microapp*-rn` MUST depender dos seus `microfront*-rn` via range local
- **AND** MUST gravar marker `.microapps-local.json` (gitignored)

### Requirement: Validate de links e ausência de node_modules recursivo

O comando `yarn microapps validate` MUST falhar se faltar symlink em `node_modules/<package>` ou se existir `node_modules` aninhado com packages reais.

#### Scenario: validação após bootstrap

- **WHEN** `validate` é executado após bootstrap bem-sucedido
- **THEN** MUST reportar OK para workspace links e grafo local

### Requirement: Scopes e run filtrado

O CLI MUST aceitar `--scope` com aliases (`apps`, `microapps`, `microfronts`, `libs`) ou nome de pasta de package.

#### Scenario: build só das libs

- **WHEN** o desenvolvedor executa `yarn microapps run prepare --scope libs`
- **THEN** MUST executar `prepare` apenas nos packages do scope `libs` que declaram o script

### Requirement: Start do mainApp

O comando `yarn microapps start` (ou `yarn start`) MUST iniciar o Metro do package declarado em `mainApp`.

#### Scenario: desenvolvimento diário

- **WHEN** o ambiente já foi bootstrapado
- **THEN** o desenvolvedor MUST conseguir desenvolver editando `src/` dos packages locais e reload via Metro sem instalar novamente nas libs
