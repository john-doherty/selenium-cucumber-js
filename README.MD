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
-h, --help                output usage information
-V, --version             output the version number
-s, --steps <path>        path to step definitions. defaults to ./step-definitions
-p, --pageObjects <path>  path to page objects
-b, --browser <path>      name of browser to use. defaults to chrome
-t, --tags <tagName>      name of tag to run
```

### Feature files

A feature file is a [Business Readable, Domain Specific Language](http://martinfowler.com/bliki/BusinessReadableDSL.html) file that lets you describe software’s behaviour without detailing how that behaviour is implemented. Feature files are written using the [Gherkin syntax](https://github.com/cucumber/cucumber/wiki/Gherkin) and must live in a folder named **features** within the root of your project.

```gherkin
# features/google-search.feature

Feature: Searching for vote cards app
  As an internet user
  In order to find out more about the itunes vote cards app
  I want to be able to search for information about the itunes vote cards app

  Scenario: Google search for vote cards app
    When I search Google for "itunes vote cards app"
    Then I should see some results
```

### Step definitions

Step definitions are the glue between features files and the actual system under test. Step definitions are written in JavaScript and should be stored in either ```./features/step-definitions``` or ```./step-definitions``` folder. If you use a different location you must provide the path via the ```-s``` command line switch.

```javascript
// step-definitions/google-search.js

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
| `driver`    | the [selenium driver](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/ie_exports_Driver.html) object (_the current browser_) |
| `selenium`  | the raw [selenium-webdriver](https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs) node module |
| `by`        | the selenium [By](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_By.html) class used to locate elements on the page |
| `until`     | the selenium [until](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/until.html) class used to wait for elements/events |
| `expect`    | [chai expect](http://chaijs.com/api/bdd/) can be used within steps to test values |
| `assert`    | [chai assert](http://chaijs.com/api/assert/) can also be used to assert values |
| `trace`     | handy trace method will log console output in blue to make it standout from cucumber output |


## How to debug

Selenium methods
You can attach a ```.then``` function to any Selenium webdriver method and use it to insert a ```debugger``` statement, for example:

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

## Example

You can run the example included in this project using the following command:

```bash
node ./node_modules/selenium-cucumber-js/index.js
```
