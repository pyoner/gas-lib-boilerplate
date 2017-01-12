# Google Apps Script lib boilerplate

## Install
First, clone the repo via git:
```bash
git clone https://github.com/pyoner/gas-lib-boilerplate.git your-project-name
```
And then install dependencies.
```bash
$ cd your-project-name && npm install
```

## Usage for lib
Put your code inside src/lib directory.
To publish lib code on npm run:
```bash
npm publish
```

# Optional actions

## Install 
1. `npm install -g node-google-apps-script` [more info](https://www.npmjs.com/package/node-google-apps-script)
2. clone this repo and move to inside repo directory
3. `npm install .` install deps
4. change `gapps.config.json` fileId


## Usage for test app or lib code on a server
To build project run:
```bash
npm run build
```
To deploy project run:
```bash
npm run deploy
```
or run:
```bash
gapps upload
```
