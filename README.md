# red-mobile-nodes

Extra nodes for RedMobile.

## How to Use

Run the following command in the root directory of your Node-RED install.

```zsh
npm install @red-mobile/red-mobile-nodes
```

## Development

### Pre-commit

```zsh
pre-commit install
```

### Node.js

```zsh
nodenv install
node ci
```

## Test

```zsh
npm run test
```

## Build

```zsh
npm run build:android
```

## Deploy

```zsh
cd packages/android
npm publish
```
