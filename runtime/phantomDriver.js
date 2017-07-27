"use strict";
(function(){
    var phantomjs = require('phantomjs-prebuilt');
    var selenium = require('selenium-webdriver');

    module.exports = function () {
        var driver = new selenium.Builder().withCapabilities({
            browserName: 'phantomjs',
            javascriptEnabled: true,
            acceptSslCerts: true,
            'phantomjs.binary.path': phantomjs.path
        }).build();

        driver.manage().window().maximize();

        return driver;
    }
})();