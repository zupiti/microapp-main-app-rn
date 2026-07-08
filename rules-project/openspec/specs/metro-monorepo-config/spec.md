# metro-monorepo-config

## Purpose

Definir a configuração Metro do mainapp para resolver packages do Yarn Workspace sem node_modules aninhados problemáticos.

## Requirements

### Requirement: Usar react-native-monorepo-config

O arquivo `microapp-main-app/metro.config.js` MUST usar `withMetroConfig` de `react-native-monorepo-config`.

#### Scenario: migração pós bob 0.43

- **WHEN** a configuração Metro do monorepo é definida ou atualizada
- **THEN** MUST NOT depender de `react-native-builder-bob/metro-config` (removido no bob >= 0.43)
- **AND** MUST usar `react-native-monorepo-config`

### Requirement: root aponta para o shell

A opção `root` passada a `withMetroConfig` MUST resolver para a pasta raiz do shell (`poc`), tipicamente `path.resolve(__dirname, '..')`.

#### Scenario: watch e resolve workspace

- **WHEN** o Metro inicia no mainapp
- **THEN** MUST observar/resolver packages listados nos workspaces do shell

### Requirement: workspaces explícitos quando necessário

Se a detecção automática for insuficiente, o Metro MUST listar paths relativos dos packages locais em `workspaces`.

#### Scenario: novo microapp adicionado

- **WHEN** um novo package workspace é adicionado ao shell
- **THEN** a lista `workspaces` do Metro (se explícita) MUST ser atualizada na mesma change
