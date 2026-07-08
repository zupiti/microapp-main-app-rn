## Why

O shell já agrega multi-repo via Yarn Workspaces, mas faltava uma metodologia operacional explícita — equivalente ao Melos no Flutter — para bootstrap, point-local e comandos por scope, de forma que o time desenvolva apontando packages locais sem `yarn` em cada pasta.

## What Changes

- Adicionar `microapps.yaml` (equivalente a `melos.yaml`).
- Adicionar CLI `scripts/microapps.js` com `bootstrap`, `point-local`, `validate`, `list`, `clean`, `run`, `start`.
- Expor aliases no `package.json` raiz (`yarn bootstrap`, `yarn point-local`, `yarn start`, …).
- Documentar a metodologia em `rules.md` / `IMPLEMENTACAO.md` e capability OpenSpec `local-dev-melos-like`.

## Capabilities

### New Capabilities

- `local-dev-melos-like`: metodologia Melos-like para desenvolvimento local multi-repo RN.

### Modified Capabilities

- `workspace-shell-yarn`: passa a ser operado preferencialmente via CLI `microapps` (bootstrap/validate).

## Impact

- **Raiz:** `microapps.yaml`, `scripts/microapps.js`, scripts do `package.json`, `.gitignore` (`.microapps-local.json`).
- **Docs:** `microapp-main-app-rn/rules-project/rules.md`, `microapp-main-app-rn/rules-project/IMPLEMENTACAO.md`, `microapp-main-app-rn/rules-project/openspec/specs/local-dev-melos-like`.
- **Validação:** `yarn bootstrap` / `yarn validate` / `yarn microapps list`.
