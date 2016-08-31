# selenium-cucumber-js

A JavaScript BDD framework created using the official [selenium-webdriver](https://github.com/SeleniumHQ/selenium/tree/master/javascript/node/selenium-webdriver) for JavaScript and [cucumber-js](https://github.com/cucumber/cucumber-js).

## Installation

```bash
npm install --save selenium-cucumber-js
```

## Usage

```bash
node ./node_modules/selenium-cucumber-js/index.js -s ./step-definitions
```

### Options

```bash
-h, --help                output usage information
-V, --version             output the version number
-f, --features <path>     path to feature files
-s, --steps <path>        path to step definitions. defaults to ./step-definitions
-p, --pageObjects <path>  path to page objects
-b, --browser <path>      name of browser to use. defaults to chrome
-t, --tags <tagName>      name of tag to run
```