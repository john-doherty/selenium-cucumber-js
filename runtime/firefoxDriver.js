"use strict";
(function(){
    var firefox = require('geckodriver');

    module.exports = function () {
        return new selenium.Builder().withCapabilities({
            browserName: 'firefox',
            javascriptEnabled: true,
            acceptSslCerts: true,
            'webdriver.firefox.bin': firefox.path
        }).build();
    }
})();