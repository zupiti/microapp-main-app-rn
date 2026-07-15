# Microapp Main App RN

Main app React Native da POC de microapps. Este repo centraliza a orquestracao do shell: `package.json`, `microapps.yaml`, `scripts/`, docs em `rules-project/` e o app que consome os microapps via Git refs.

## Comecar Apenas Com O Main App

Se voce deletou todos os microapps/microfronts locais e ficou apenas com `microapp-main-app-rn`, use o setup local para baixar tudo novamente a partir das Git refs de `microapps.yaml`:

```sh
cd microapp-main-app-rn
yarn setup:microapps:local
```

Esse comando clona os repos ausentes ao lado do main app, troca o grafo para `link:` local, roda `yarn install`, limpa `node_modules` aninhados e valida os links.

Depois rode:

```sh
yarn start
yarn ios
```

## Requisitos

- Node >= 18
- Yarn Classic 1.x
- Ambiente React Native configurado para iOS e/ou Android
- CocoaPods para iOS

## Instalar

Rode os comandos a partir de `microapp-main-app-rn`:

```sh
yarn install
```

Para iOS:

```sh
bundle install
cd ios
bundle exec pod install
cd ..
```

## Rodar Com Git Refs

O estado padrao usa Git refs declaradas em `package.json` e `microapps.yaml`.

```sh
yarn point-local
yarn validate
```

Subir Metro:

```sh
yarn start
```

Rodar iOS:

```sh
yarn ios
```

Rodar Android:

```sh
yarn android
```

## Rodar Localmente

Para desenvolver todos os microapps locais do shell:

```sh
yarn setup:microapps:local
yarn start
```

Esse setup troca o grafo para dependencias locais, roda `yarn install`, limpa `node_modules` aninhados e valida os links.

## Scripts Uteis

```sh
yarn microapps list
yarn validate
yarn clean
yarn build:libs
yarn test
yarn test:coverage
```

Examples standalone:

```sh
yarn example:microapp1
yarn example:microapp2
yarn example:microapp3
```

## Limpar Build

iOS:

```sh
rm -rf ios/build
rm -rf ~/Library/Developer/Xcode/DerivedData/MicroappMainApp-*
```

Android:

```sh
rm -rf android/build android/app/build
```

Metro/cache:

```sh
rm -rf "$TMPDIR/metro-*" "$TMPDIR/react-*"
```

## Arquivos De Orquestracao

- `microapps.yaml`: grafo dos microapps, microfronts e refs Git.
- `scripts/microapps.js`: CLI de bootstrap, validacao, limpeza e execucao por scope.
- `rules-project/`: regras, OpenSpec e documentacao da arquitetura.

## Arquitetura Dos Microapps

Cada `microapp*-rn` segue camadas com dependencia unidirecional:

```text
entities → services → repositories → hooks → ui/screens → ui/components
```

| Package | Dominio de exemplo |
|---------|--------------------|
| `microapp1-rn` | pedidos |
| `microapp2-rn` | metricas |
| `microapp3-rn` | contador |

**Hooks:** uma responsabilidade; chamam so `repositories/`; screens nao fazem `useEffect` de dados. Fronteiras em cada `.eslintrc.js`.

Documentacao canonica:

- `rules-project/rules.md` — secao **Arquitetura interna do microapp**
- `rules-project/IMPLEMENTACAO.md` — §6.2.1
- README de cada `microapp*-rn`
