'use strict';

var phantomjs = require('phantomjs-prebuilt');
var selenium = require('selenium-webdriver');

/**
 * Creates a Selenium WebDriver using PhantomJS as the browser
 * @returns {ThenableWebDriver} selenium web driver
 */
module.exports = function() {

    var driver = new selenium.Builder().withCapabilities({
        browserName: 'phantomjs',
        javascriptEnabled: true,
        acceptSslCerts: true,
        'phantomjs.binary.path': phantomjs.path,
        'phantomjs.cli.args': '--ignore-ssl-errors=true'
    }).build();

    driver.manage().window().maximize();

    return driver;
};
