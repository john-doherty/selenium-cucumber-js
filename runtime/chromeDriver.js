"use strict";
(function(){
    var chromedriver = require('chromedriver');

    module.exports = function () {
        return new selenium.Builder().withCapabilities({
            browserName: 'chrome',
            javascriptEnabled: true,
            acceptSslCerts: true,
            chromeOptions: {
                args: ['start-maximized']
            },
            path: chromedriver.path
        }).build();
    }
})();