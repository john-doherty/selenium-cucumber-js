'use strict';

var selenium = require('selenium-webdriver');

/**
 * Creates a Selenium WebDriver using Chrome as the browser
 * @returns {ThenableWebDriver} selenium web driver
 */
module.exports = function () {

    var driver = new selenium.Builder().
        usingServer('http://localhost:4444/wd/hub').
        withCapabilities(selenium.Capabilities.chrome()).build();

    driver.manage().window().maximize();

    return driver;
};
