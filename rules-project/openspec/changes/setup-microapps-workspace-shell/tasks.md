## 1. Documentação base

- [x] 1.1 Criar `IMPLEMENTACAO.md` em `microapp-main-app-rn/rules-project` com arquitetura, workspaces, bob, Metro e publish
- [x] 1.2 Criar `rules.md` com convenções obrigatórias
- [x] 1.3 Criar `openspec/config.yaml` com context do POC

## 2. Specs canônicas

- [x] 2.1 Criar capability `workspace-shell-yarn`
- [x] 2.2 Criar capability `microapp-hierarchy`
- [x] 2.3 Criar capability `bob-libraries`
- [x] 2.4 Criar capability `metro-monorepo-config`

## 3. Change OpenSpec

- [x] 3.1 Criar change `setup-microapps-workspace-shell` (proposal, design, tasks, deltas)

## 4. Scaffold (implementação de código)

- [x] 4.1 Inicializar shell git + `.gitmodules` com remotes reais (`zupiti/*-rn`)
- [x] 4.2 Criar `package.json` raiz com `workspaces` e `resolutions` (Yarn Classic; refs internas via Git)
- [x] 4.3 Scaffold mainapp React Native 0.78 em `microapp-main-app-rn`
- [x] 4.4 Scaffold cada `microapp*-rn` / `microfront*-rn` com bob (`prepare: bob build`)
- [x] 4.5 Ligar dependências workspace (mainapp→microapps, microapps→microfronts)
- [x] 4.6 Configurar `metro.config.js` com `react-native-monorepo-config`
- [x] 4.7 Executar `yarn` na raiz e validar ausência de `node_modules` recursivo necessário
- [x] 4.8 Smoke Metro (`yarn start` / bundle HTTP 200 na porta 8091)
