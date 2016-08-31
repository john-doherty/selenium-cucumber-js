# selenium-cucumber-js

A JavaScript BDD framework created using the official [selenium-webdriver](https://github.com/SeleniumHQ/selenium/tree/master/javascript/node/selenium-webdriver) for JavaScript and [cucumber-js](https://github.com/cucumber/cucumber-js).

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

### Feature file

Features are written with the [Gherkin syntax](https://github.com/cucumber/cucumber/wiki/Gherkin).

**IMPORTANT:** Feature files must live in a folder named **features** within the root of your project. Step definitions files can live anywhere you like.

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

### Step definition

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

## Example

Run the example above (_included in this project_) using the following command:

```bash
node ./node_modules/selenium-cucumber-js/index.js
```

## How to debug

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