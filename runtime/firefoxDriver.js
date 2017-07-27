"use strict";
(function(){
    var firefox = require('geckodriver');
    var selenium = require('selenium-webdriver');

    module.exports = function () {
        var driver = new selenium.Builder().withCapabilities({
            browserName: 'firefox',
            javascriptEnabled: true,
            acceptSslCerts: true,
            'webdriver.firefox.bin': firefox.path
        }).build();

        driver.manage().window().maximize();

        return driver;
    }
})();