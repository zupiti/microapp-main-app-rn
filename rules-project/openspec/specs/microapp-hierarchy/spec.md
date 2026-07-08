# microapp-hierarchy

## Purpose

Definir a hierarquia canônica: 1 mainapp → N microapps; 1 microapp → N microfronts; cada pacote em repositório git independente.

## Requirements

### Requirement: Relação mainapp para microapps

O `microapp-main-app` MUST depender de zero ou mais packages `microapp*` listados no workspace.

#### Scenario: mainapp consome microapps

- **WHEN** o mainapp declara dependências de feature modular
- **THEN** essas dependências MUST ser packages `microapp*` (não microfronts diretamente, salvo exceção documentada em change OpenSpec)

### Requirement: Relação microapp para microfronts

Cada `microapp*` MUST poder depender de zero ou mais packages `microfront*`.

#### Scenario: microapp compõe microfronts

- **WHEN** um microapp precisa de UI/feature compartilhada
- **THEN** MUST declarar o microfront correspondente em `dependencies` com protocolo workspace (`workspace:*` ou `link:`)

### Requirement: Multi-repo por pacote

Cada pasta `microapp-main-app`, `microapp*` e `microfront*` MUST corresponder a um repositório git próprio, agregado no shell via git submodule.

#### Scenario: clonagem do shell

- **WHEN** um desenvolvedor clona o shell
- **THEN** MUST conseguir obter os packages com `git submodule update --init --recursive` (ou clone com `--recurse-submodules`)

### Requirement: Nomenclatura

Nomes de pasta e campo `"name"` do `package.json` MUST ser iguais para cada pacote local (`microapp1`, `microfront2`, etc.).

#### Scenario: import pelo nome do package

- **WHEN** o mainapp importa um microapp
- **THEN** o import MUST usar o `"name"` do package (ex.: `import ... from 'microapp1'`)
