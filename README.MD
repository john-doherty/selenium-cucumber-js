# selenium-cucumber-js

A debuggable JS BDD framework that uses the official [selenium-webdriver](http://seleniumhq.github.io/selenium/docs/api/javascript/ "view webdriver js documentation") for Node and [cucumber-js](https://github.com/cucumber/cucumber-js "view cucumber js documentation").

## Installation

```bash
npm install selenium-cucumber-js --save-dev
```

## Usage

```bash
node ./node_modules/selenium-cucumber-js/index.js -s ./step-definitions
```

### Options

```bash
-h, --help                   output usage information
-V, --version                output the version number
-s, --steps <path>           path to step definitions. defaults to ./step-definitions
-p, --pageObjects <path>     path to page objects. defaults to ./page-objects
-o, --sharedObjects [paths]  path to shared objects (repeatable). defaults to ./shared-objects
-b, --browser <path>         name of browser to use. defaults to chrome
-t, --tags <tagName>         name of tag to run
```

By default tests are run using Google Chrome, to run tests using another browser supply the name of that browser along with the `-b` switch. Available options are:

| Browser | Example |
| :--- | :--- |
| Chrome | `-b chrome` |
| Firefox | `-b firefox` |
| Phantom JS | `-b phantomjs` |

### Feature files

A feature file is a [Business Readable, Domain Specific Language](http://martinfowler.com/bliki/BusinessReadableDSL.html) file that lets you describe software’s behaviour without detailing how that behaviour is implemented. Feature files are written using the [Gherkin syntax](https://github.com/cucumber/cucumber/wiki/Gherkin) and must live in a folder named **features** within the root of your project.

```gherkin
# ./features/google-search.feature

Feature: Searching for vote cards app
  As an internet user
  In order to find out more about the itunes vote cards app
  I want to be able to search for information about the itunes vote cards app

  Scenario: Google search for vote cards app
    When I search Google for "itunes vote cards app"
    Then I should see some results
```

The browser automatically closes after each scenario to ensure the next scenario uses a fresh browser environment.

### Step definitions

Step definitions act as the glue between features files and the actual system under test.

```javascript
// ./step-definitions/google-search.js

module.exports = function () {

    this.When(/^I search Google for "([^"]*)"$/, function (searchQuery) {

        driver.get('http://www.google.com');

        var input = driver.findElement(by.name('q'));

        input.sendKeys(searchQuery);
        input.sendKeys(selenium.Key.ENTER);
    });

    this.Then(/^I should see some results$/, function () {

        driver.wait(until.elementsLocated(by.css('div.g')), 10000);

        return driver.findElements(by.css('div.g')).then(function (elements) {
            expect(elements.length).to.not.equal(0);
        });
    });
};
```

The following variables are available within the ```Given()```, ```When()``` and ```Then()``` functions:

| Variable | Description |
| :--- | :--- |
| `driver`    | an instance of [selenium web driver](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html) (_the browser_) |
| `selenium`  | the raw [selenium-webdriver](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/) module, providing access to static properties/methods |
| `page`      | collection of **page** objects loaded from disk and keyed by filename |
| `shared`    | collection of **shared** objects loaded from disk and keyed by filename |
| `by`        | the selenium [By](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_By.html) class used to locate elements on the page |
| `until`     | the selenium [until](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/until.html) class used to wait for elements/events |
| `expect`    | instance of [chai expect](http://chaijs.com/api/bdd/) to ```expect('something').to.equal('something')``` |
| `assert`    | instance of [chai assert](http://chaijs.com/api/assert/) to ```assert.isOk('everything', 'everything is ok')``` |
| `trace`     | handy trace method to log console output with increased visibility |

### Page objects

Page objects are accessible via a global ```page``` object and are automatically loaded from ```./page-objects``` _(or the path specified using the ```-p``` switch)_. Page objects are exposed via a camel-cased version of their filename, for example ```./page-objects/google-search.js``` becomes ```page.googleSearch```.

Page objects also have access to the same runtime variables available to step definitions.

An example page object:

```javascript
// ./page-objects/gogole-search.js

module.exports = {

    elements: {
        searchInput: by.name('q')
    },

    preformSearch: function (keywords) {

        // notice the element path below use the full page qualifier
        var input = driver.findElement(page.googleSearch.elements.searchInput);

        input.sendKeys(keywords);
        input.sendKeys(selenium.Key.ENTER);
    }
};
```

And its usage within a step definition:

```js
module.exports = function () {

    this.When(/^I search Google for "([^"]*)"$/, function (searchQuery) {

        page.googleSearch.preformSearch(searchQuery);
    });
};
```

### Shared objects

Shared objects allow you to share anything from test data to helper methods throughout your project via a global ```shared``` object. Shared objects are automatically loaded from ```./shared-objects``` _(or the path specified using the ```-o``` switch)_ and made available via a camel-cased version of their filename, for example ```./shared-objects/test-data.js``` becomes ```shared.testData```.

Shared objects also have access to the same runtime variables available to step definitions.

An example shared object:

```javascript
// ./shared-objects/test-data.js

module.exports = {
    username: "import-test-user",
    password: "import-test-pa**word"
}
```

And its usage within a step definition:

```js
module.exports = function () {

    this.Given(/^I am logged in"$/, function () {

        driver.findElement(by.name('usn')).sendKeys(shared.testData.username);
        driver.findElement(by.name('pass')).sendKeys(shared.testData.password);
    });
};
```

### Event handlers

You can register event handlers for the following events within the cucumber lifecycle.

| Event          | Example                                                     |
|----------------|-------------------------------------------------------------|
| BeforeFeature  | ```this.BeforeFeatures(function(feature, callback) {}) ```  |
| BeforeScenario | ```this.BeforeScenario(function(scenario, callback) {});``` |
| AfterScenario  | ```this.AfterScenario(function(scenario, callback) {});```  |
| AfterFeature   | ```this.AfterFeature(function(feature, callback) {});```    |

## How to debug

Most selenium methods return a [JavaScript Promise](https://spring.io/understanding/javascript-promises "view JavaScript promise introduction") that is resolved when the method completes. The easiest way to step in with a debugger is to add a ```.then``` method to a selenium function and place a ```debugger``` statement within it, for example:

```js
module.exports = function () {

    this.When(/^I search Google for "([^"]*)"$/, function (searchQuery) {

        driver.findElement(by.name('q')).then(function(input) {
            expect(input).to.exist;
            debugger; // <<- your IDE should step in at this point, with the browser open
            return input;
        })
        .then(function(input){
            input.sendKeys(searchQuery);
            input.sendKeys(selenium.Key.ENTER);
        });
    });
};
```

## Default directory structure

You can use the framework without any command line arguments if your application uses the following folder structure:

```
.
├── features
│   └── google-search.feature
├── step-definitions
│   └── google-search-steps.js
├── page-objects
│   └── google-search.js
└── shared-objects
    ├── test-data.js
    └── stuff.json
```

## Demo

This project includes an example feature file and step definition to help you get started. You can run the example using the following command:

```bash
node ./node_modules/selenium-cucumber-js/index.js
```

## Bugs

Please raise bugs via [Github’s Issue Tracker](https://github.com/john-doherty/selenium-cucumber-js/issues) and provide enough information to allow the bug to be reproduced.

## License

[ISC License](LICENSE) &copy; 2016 [John Doherty](https://courseof.life/johndoherty)