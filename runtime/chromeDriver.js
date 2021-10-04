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
            args: ['start-maximized', 'disable-extensions'],
            excludeSwitches: ['enable-logging'] // Re-enable this if you want more verbose logging. Usually not needed.
        },
        path: chromedriver.path
    }).build();

    driver.manage().window().maximize();

    return driver;
};
