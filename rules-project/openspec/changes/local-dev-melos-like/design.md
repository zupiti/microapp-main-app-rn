## Context

Flutter Melos usa `melos.yaml` + comandos `bootstrap`, `exec`, filters por package. No RN multi-repo deste POC, Yarn Workspaces já faz o papel de linking; faltava a DX/metodologia explícita.

## Goals / Non-Goals

**Goals:**

- Um comando de bootstrap local.
- Point-local automático do grafo mainapp → microapps → microfronts.
- Scopes (`apps`, `microapps`, `microfronts`, `libs`) para `list` / `run`.
- Validate contra node_modules recursivo.

**Non-Goals:**

- Publicação automática (versioning/release-it).
- Substituir bob/Metro — apenas orquestrar.

## Decisions

1. **Config `microapps.yaml`** na raiz do shell — espelha Melos e fica ao lado do `package.json` de workspaces.
2. **CLI Node sem deps** — parser YAML mínimo + `child_process` para não adicionar toolchain.
3. **Git refs por pacote** como referência configurada para dependências internas.
4. **Marker `.microapps-local.json`** gitignored para sinalizar modo local.

## Risks / Trade-offs

- Parser YAML limitado → config deve manter o subset documentado. Mitigação: validação no load.
- `point-local` reescreve `package.json` dos packages (cada um é um git repo). Mitigação: refs explícitas em `microapps.yaml`; commit opcional por time.

## Migration Plan

Já aplicável ao scaffold existente: `yarn bootstrap`.

## Open Questions

- Nenhuma.
