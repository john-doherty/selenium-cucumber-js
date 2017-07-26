"use strict";
(function(){
    var phantomjs = require('phantomjs-prebuilt');

    module.exports = function () {
        return new selenium.Builder().withCapabilities({
            browserName: 'phantomjs',
            javascriptEnabled: true,
            acceptSslCerts: true,
            'phantomjs.binary.path': phantomjs.path
        }).build();
    }
})();