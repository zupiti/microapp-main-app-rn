# Regras de desenvolvimento — POC Microapps React Native

Este documento define as convenções obrigatórias do workspace shell **`poc`**. Complementa [`IMPLEMENTACAO.md`](IMPLEMENTACAO.md) (como implementar) e o contrato OpenSpec em [`openspec/`](openspec/). Alterações de arquitetura e código devem permanecer consistentes com estes contratos.

---

## Stack e ferramentas

- **React Native** no `microapp-main-app` (versão alinhada via `resolutions` na raiz).
- **react-native-builder-bob** para build das libs (`microapp*`, `microfront*`).
- **create-react-native-library** (`--local`) para scaffold de libs no workspace.
- **Yarn Workspaces** na raiz (`poc`) — único ponto de instalação de dependências.
- **react-native-monorepo-config** (`withMetroConfig`) no Metro do mainapp (bob >= 0.43 **não** usa mais `react-native-builder-bob/metro-config`).
- **Git submodules** para agregar repositórios independentes no shell.

---

## Arquitetura (obrigatório)

| Papel | Relação | Pastas neste POC |
|-------|---------|------------------|
| Main App | 1 → N microapps | `microapp-main-app-rn` |
| Microapp | 1 → N microfronts | `microapp1-rn`, `microapp2-rn`, `microapp3-rn` |
| Microfront | lib UI/feature | `microfront1-rn`, `microfront2-rn` |
| Docs / OpenSpec | shell docs | `microapp-main-app-rn/rules-project` |

Regras:

1. Cada `microapp*` e cada `microfront*` vive em **repositório git próprio**.
2. A raiz `poc` é **shell privado** (`"private": true`) — agrega submodules e workspaces; **não** é publicada como pacote.
3. Dependências internas usam Git refs (`git+https://...#main`) quando não estiverem no modo local.
4. **Proibido** `yarn install` / `npm install` dentro de `microapp*` ou `microfront*` no fluxo de desenvolvimento diário.
5. Deve existir **um único** `node_modules` na raiz do shell após `yarn`.

---

## Organização do código

```text
poc/
├── package.json              # workspaces + resolutions
├── .gitmodules
├── microapp-main-app-rn/     # app RN + metro.config.js
│   └── rules-project/        # IMPLEMENTACAO.md, rules.md, openspec/
├── microappN-rn/             # lib bob (src/ → lib/)
└── microfrontN-rn/           # lib bob (src/ → lib/)
```

Dentro de cada lib bob:

| Pasta / campo | Uso |
|---------------|-----|
| `src/` | Código-fonte (entrada `source` / `react-native`) |
| `lib/` | Output gerado por `bob build` — não editar à mão |
| `package.json` | `prepare`: `bob build`; targets commonjs + module + typescript |
| `peerDependencies` | `react`, `react-native` |

No mainapp: UI e orquestração apenas; regras de feature ficam no microapp/microfront correspondente.

---

## Arquitetura interna do microapp (obrigatório)

Cada `microapp*-rn` MUST organizar o `src/` em camadas (padrão do módulo de referência de eleições):

```text
src/
├── entities/          # tipos de domínio (somente types; barrel em index.ts)
├── services/          # transporte HTTP/mock cru
├── repositories/      # orquestra services + normaliza payloads/erros
├── hooks/             # estado + efeitos; chama só repositories
├── utils/             # helpers puros (sem React)
├── ui/
│   ├── screens/       # telas finas (sem useEffect de dados)
│   ├── components/    # apresentação
│   ├── styles/        # StyleSheet / styled
│   └── navigation/    # opcional — stacks/tipos de rota
├── index.tsx          # API pública (exporta screens)
└── .eslintrc.js       # fronteiras de import por camada
```

**Fluxo de dependência (só à esquerda):**

`entities → services → repositories → hooks → ui/screens → ui/components`

| Camada | Pode | Não pode |
|--------|------|----------|
| `entities/` | tipos puros | React, RN, outras camadas |
| `services/` | HTTP/transport + tipos de entities | repositories, hooks, ui, utils |
| `repositories/` | services + utils + entities | hooks, ui |
| `hooks/` | repositories + utils + entities | services, ui/screens, ui/components, ui/styles |
| `utils/` | entities | React, services, repositories, hooks, ui |
| `ui/screens/` | hooks + components + styles | services, repositories, `useEffect` de dados |
| `ui/components/` | props + styles + entities/utils | services, repositories |

### Diretrizes de hooks

1. Uma responsabilidade por hook: `use-<domínio>-<responsabilidade>.ts`.
2. Chamar **apenas** `repositories/` — nunca `services/` direto.
3. Donos de loading/erro/dados e de `useEffect` de fetch/mutação.
4. Screens só consomem o retorno do hook e passam props aos components.
5. Guardar race async (`ativo` / `AbortController`) em efeitos com id/unmount.
6. Estado compartilhado entre várias screens: Context Provider no padrão hub (compor hooks).
7. Entidades sempre via barrel `../entities`, nunca `*_entity.ts` individual.
8. Fronteiras reforçadas pelo `.eslintrc.js` de cada microapp.

Exemplos no POC: `microapp1-rn` (pedidos), `microapp2-rn` (métricas), `microapp3-rn` (contador).

---

## Nomenclatura

- **Pastas e package name**: iguais (`microapp1-rn`, `microfront2-rn`, `microapp-main-app-rn`).
- **Camadas do microapp**: `entities/*_entity.ts`, hooks `use-*.ts`, screens/components em `kebab-case`.
- **Classes / componentes**: `PascalCase`.
- **Variáveis / funções**: `camelCase`.
- **Booleanos**: prefixo `is` / `has` / `can`.
- **Código e comentários técnicos**: inglês; textos de UI conforme o produto.

---

## Dependências e Metro

- Alinhar `react` e `react-native` com `resolutions` (ou `packageExtensions`) na raiz.
- Mainapp declara microapps em `dependencies`.
- Microapp declara seus microfronts em `dependencies`.
- `metro.config.js` do mainapp MUST usar `withMetroConfig` com `root` apontando para a pasta do shell (`..`).
- Ao adicionar pacote workspace, atualizar `workspaces` na raiz e, se listado explicitamente, o array `workspaces` do Metro.

---

## Metodologia Melos-like (desenvolvimento local)

Equivalente operacional ao Melos (Flutter) para este shell multi-repo RN.

| Melos (Flutter) | Neste POC |
|-----------------|-----------|
| `melos.yaml` | `microapps.yaml` (raiz do shell) |
| `melos bootstrap` | `yarn bootstrap` / `yarn microapps bootstrap` |
| path deps / local | `yarn point-local` (grafo → range `*`) |
| `melos list` | `yarn list` / `yarn microapps list --scope …` |
| `melos exec` | `yarn microapps run <script> --scope …` |
| run app | `yarn start` / `yarn microapps start` |

### Fluxo diário

```bash
# primeira vez / CI local
yarn bootstrap

# desenvolver apontando packages locais (já linkados)
yarn start

# build só das libs bob
yarn build:libs
# equivalente: yarn microapps run prepare --scope libs

# validar links + grafo local
yarn validate
```

### Point-local

`point-local` lê `microapps.yaml#graph` e garante que:

- `microapp-main-app-rn` → `microapp1-rn|2|3` com Git refs configuradas
- cada microapp → seus microfronts/shared com Git refs configuradas

Metro resolve `src/` via `react-native`/`source` + `react-native-monorepo-config`. Editar uma lib e salvar recarrega no mainapp — **sem** `yarn` dentro da lib.

### Scopes

- `apps` — mainapp
- `microapps` — `microapp*-rn`
- `microfronts` — `microfront*-rn`
- `libs` — microapps + microfronts

---

## Fluxo de desenvolvimento

```bash
# setup (Melos-like)
git submodule update --init --recursive   # se submodules registrados
yarn bootstrap                            # yarn + point-local + validate

# run
yarn start                                # Metro do mainApp
```

- Mudança de código em lib: editar `src/` — Metro resolve via symlink.
- Mudança de dependência npm: editar o `package.json` do package → `yarn` **só na raiz**.

---

## Publicação

- Cada pacote versiona e publica no **seu** repositório.
- `prepare` / `prepack` MUST executar `bob build`.
- Consumo em produção: versão do registry ou URL git com tag — não depender do shell `poc`.

---

## Qualidade e entrega

- Seguir [`IMPLEMENTACAO.md`](IMPLEMENTACAO.md) e specs em [`openspec/specs/`](openspec/specs/).
- Mudanças rastreadas: criar/atualizar change em `openspec/changes/` quando o escopo alterar arquitetura ou contratos.
- **Não** commit/push sem solicitação explícita.
- **Não** criar ou editar `.md` fora do pedido (exceto os já solicitados: `IMPLEMENTACAO.md`, `rules.md`, openspec).

---

## OpenSpec

- Config: [`openspec/config.yaml`](openspec/config.yaml).
- Specs canônicas: [`openspec/specs/`](openspec/specs/).
- Changes ativas: [`openspec/changes/`](openspec/changes/).
- Antes de propor mudança estrutural, ler as capabilities existentes e alinhar delta aos requirements (WHEN/THEN).

---

## Checklist rápido (agente / dev)

- [ ] Hierarquia 1 mainapp → N microapps → N microfronts respeitada
- [ ] Microapps com camadas `entities/services/repositories/hooks/utils/ui` + `.eslintrc.js`
- [ ] Hooks só falam com repositories; screens sem `useEffect` de dados
- [ ] `yarn bootstrap` / `yarn validate` OK
- [ ] Um `yarn` na raiz; sem `node_modules` recursivo
- [ ] Libs com bob (`prepare: bob build`)
- [ ] Metro com `react-native-monorepo-config`
- [ ] Repo git independente por pacote + submodule no shell
- [ ] Specs OpenSpec atualizadas se o contrato mudar
- [ ] Packages novos refletidos em `microapps.yaml` + workspaces + Metro
