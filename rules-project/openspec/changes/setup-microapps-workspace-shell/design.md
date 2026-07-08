## Context

O diretório `poc` já contém pastas vazias: `microapp-main-app`, `microapp1`, `microapp2`, `microapp3`, `microfront1`, `microfront2`. Ainda não há `package.json`, submodules nem código RN. A documentação de implementação (`IMPLEMENTACAO.md`) descreve o alvo.

bob >= 0.43 removeu `react-native-builder-bob/metro-config`; o caminho canônico é `react-native-monorepo-config`.

## Goals / Non-Goals

**Goals:**

- Contrato OpenSpec + `rules.md` alinhados à arquitetura documentada.
- Specs mensuráveis para shell, hierarquia, bob e Metro.
- Base para implementar o scaffold sem ambiguidade.

**Non-Goals:**

- Implementar agora o código RN / publish CI completo (fica para changes seguintes).
- Unificar todos os packages em um único repositório git (o modelo é multi-repo).

## Decisions

1. **Shell + submodules** — `poc` privado agrega remotes independentes; desenvolvimento usa Yarn Workspaces na raiz.
2. **workspace:\* / link:** — dependências locais sem publish no dia a dia.
3. **bob prepare** — build oficial das libs no ciclo publish/install git.
4. **Metro via react-native-monorepo-config** — `root` = pasta do shell.

## Risks / Trade-offs

- [submodules na DX] → Clone exige `--recurse-submodules`. Mitigação: documentado em `IMPLEMENTACAO.md` / tasks.
- [Yarn Classic vs Berry] — Mitigação: documentar ambos; preferir Berry `nodeLinker: node-modules` + `nmHoistingLimits: workspaces` se Yarn 2+.

## Migration Plan

N/A (bootstrap). Próxima change implementa scaffold real.

## Open Questions

- Remotes finais dos gits de cada pacote (org/URLs) — preencher no `.gitmodules` quando existirem.

## Workspace / hoisting

- Um `yarn` na raiz; `resolutions` para `react` / `react-native`.
- Sem `node_modules` obrigatório dentro de cada lib.

## Metro

- `microapp-main-app/metro.config.js` com `withMetroConfig`, `root: path.resolve(__dirname, '..')`.
