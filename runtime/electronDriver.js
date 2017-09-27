'use strict';

var selenium = require('selenium-webdriver');
var path = require('path');

var myapp = path.resolve(process.cwd(), 'MyApp.app/Contents/MacOS/MyApp');
/**
 * Creates a Selenium WebDriver using Firefox as the browser
 * @returns {ThenableWebDriver} selenium web driver
 */
module.exports = function () {

    var driver = new selenium.Builder()
        .withCapabilities({
            chromeOptions: {
                // Here is the path to your Electron binary.
                binary: myapp
            }
        })
        .forBrowser('electron')
        .build();

    return driver;
};
