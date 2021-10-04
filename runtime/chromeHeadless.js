'use strict';

var chromedriver = require('chromedriver');
var selenium = require('selenium-webdriver');

/**
 * Creates a Selenium WebDriver using Chrome as the browser
 * @returns {ThenableWebDriver} selenium web driver
 */
module.exports = function() {

    var driver = new selenium.Builder().withCapabilities({
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        chromeOptions: {
            args: ['disable-gpu', 'headless', 'disable-extensions', 'log-level=1'], // Remove or change log-level if you want more output.
            excludeSwitches: ['enable-logging'] // Re-enable this if you want more verbose logging. Usually not needed.
        },
        path: chromedriver.path
    }).build();

    driver.manage();

    return driver;
};
