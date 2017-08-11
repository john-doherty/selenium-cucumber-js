'use strict';

var firefox = require('geckodriver');
var selenium = require('selenium-webdriver');

/**
 * Creates a Selenium WebDriver using Firefox as the browser
 * @returns {ThenableWebDriver} selenium web driver
 */
module.exports = function() {

    var driver = new selenium.Builder().withCapabilities({
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true,
        'webdriver.firefox.bin': firefox.path
    }).build();

    driver.manage().window().maximize();

    return driver;
};
