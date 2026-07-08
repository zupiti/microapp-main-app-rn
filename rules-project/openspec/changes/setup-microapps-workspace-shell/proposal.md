## Why

O POC precisa de um sistema React Native modular (mainapp → microapps → microfronts) com publicação multi-repo e desenvolvimento local sem `node_modules` recursivo. Falta o contrato OpenSpec e as regras operacionais para guiar a implementação baseada em react-native-builder-bob + Yarn Workspaces.

## What Changes

- Documentar a implementação em `IMPLEMENTACAO.md`.
- Adicionar `rules.md` com convenções obrigatórias do shell.
- Criar OpenSpec (`openspec/config.yaml`, specs canônicas e change inicial).
- Definir capabilities: workspace shell/yarn, hierarquia microapps, libs bob, Metro monorepo.
- Estabelecer que cada microapp/microfront/mainapp terá repositório git próprio agregado via submodule.

## Capabilities

### New Capabilities

- `workspace-shell-yarn`: shell privado, um `yarn` na raiz, sem node_modules recursivo, resolutions de React.
- `microapp-hierarchy`: 1 mainapp → N microapps; 1 microapp → N microfronts; multi-repo + nomenclatura.
- `bob-libraries`: scaffold local, `prepare: bob build`, peers de React, source para Metro.
- `metro-monorepo-config`: `react-native-monorepo-config` no mainapp, root no shell.

### Modified Capabilities

- (nenhuma — change de bootstrap).

## Impact

- **Documentação:** `IMPLEMENTACAO.md`, `rules.md`, `openspec/**`.
- **Código futuro:** `package.json` raiz, submodules, libs bob, `metro.config.js` do `microapp-main-app`.
- **Validação:** `yarn` só na raiz; smoke `yarn start` no mainapp quando o scaffold existir.
- **Pacotes:** `microapp-main-app`, `microapp1..3`, `microfront1..2`.
