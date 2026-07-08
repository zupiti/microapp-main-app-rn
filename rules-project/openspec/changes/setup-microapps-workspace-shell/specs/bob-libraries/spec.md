## ADDED Requirements

### Requirement: Scaffold com create-react-native-library local

Novas libs `microapp*` / `microfront*` MUST ser criadas (ou alinhadas) com `create-react-native-library` usando o modo local (`--local`) adequado a monorepo/workspace.

#### Scenario: nova lib no workspace

- **WHEN** o time adiciona um novo microfront ou microapp
- **THEN** o package MUST seguir a estrutura bob (`src/`, targets de build, script `prepare`)

### Requirement: Build via bob no prepare

Cada lib MUST executar `bob build` no script `prepare` e/ou `prepack`.

#### Scenario: publish ou install via git

- **WHEN** o pacote é publicado ou instalado de forma que dispare `prepare`/`prepack`
- **THEN** o diretório `lib/` MUST ser gerado com targets configurados (commonjs, module, typescript)

### Requirement: peerDependencies de React

Libs MUST declarar `react` e `react-native` como `peerDependencies` (não como dependência de runtime duplicada no app).

#### Scenario: consumer é o mainapp / microapp

- **WHEN** a lib é linkada no workspace
- **THEN** React MUST vir do grafo do consumidor (hoisted), não de um React embutido na lib

### Requirement: source para Metro em desenvolvimento

O `package.json` da lib MUST expor entrada de source (`source` / `react-native`) apontando para `src/` para desenvolvimento no monorepo.

#### Scenario: edição com hot reload

- **WHEN** o desenvolvedor altera um arquivo em `microfront1/src`
- **THEN** o Metro do mainapp MUST conseguir resolver o source do package via workspace sem exigir publish
