'use strict';

/**
 * world.js is loaded by the cucumber framework before loading the step definations and feature files
 * it is responsible for setting up and exposing the driver/browser/expect/assert etc required within each step definition
 */

var fs = require('fs-plus'),
    requireDir = require('require-dir'),
    merge = require('merge'),
    chalk = require('chalk'),
    selenium = require('selenium-webdriver'),
    phantomjs = require('phantomjs'),
    chromedriver = require('chromedriver'),
    firefox = require('geckodriver'),
    expect = require('chai').expect,
    assert = require("chai").assert;

var DEFAULT_TIMEOUT = 10 * 1000; // 10 second default

/**
 * create the selenium browser based on global var set in index.js
 */
function getDriverInstance() {

    switch (browserName || '') {

        case 'firefox': {

            driver = new selenium.Builder().withCapabilities({
                browserName: 'firefox',
                javascriptEnabled: true,
                acceptSslCerts: true,
                'webdriver.firefox.bin': firefox.path
            }).build();

        } break;

        case 'phantomjs': {

            driver = new selenium.Builder().withCapabilities({
                browserName: 'phantomjs',
                javascriptEnabled: true,
                acceptSslCerts: true,
                'phantomjs.binary.path': phantomjs.path
            }).build();

        } break;

        // default to chrome
        default: {

            driver = new selenium.Builder().withCapabilities({
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true,
                chromeOptions: {
                    "args": ["start-maximized"]
                },
                path: chromedriver.path
            }).build();
        }
    };

    return driver;
}

function consoleInfo(){
    var args = [].slice.call(arguments),
        output = chalk.bgBlue.white('\n>>>>> \n' + args + '\n<<<<<\n');

    console.log(output);
}

function World() {

    var self = this;

    // create a list of properties to expose within each step definition (and globally for readability)
    var runtime = {
        driver: null,           // the browser object
        selenium: selenium,     // the raw nodejs selenium driver
        By: selenium.By,        // in keeping with Java expose selenium By 
        by: selenium.By,        // provide a javascript lowercase version
        until: selenium.until,  // provide easy access to selenium until methods
        expect: expect,         // expose chai expect to allow variable testing
        assert: assert,         // expose chai assert to allow variable testing
        trace: consoleInfo,     // expose an info method to log output to the console in a readable/visible format
        page: {},               // empty page objects placeholder
        shared: {}              // empty shared objects placeholder
    };

    // expose properties to step definition methods 
    Object.keys(runtime).forEach(function(key) {

        // make var avaliable within step def via this.key
        self[key] = runtime[key];

        // make property/method avaiable as a global (no this. prefix required)
        global[key] = runtime[key];
    });

    // import page objects (after global vars have been created)
    if (global.pageObjectPath && fs.existsSync(global.pageObjectPath)) {

        // require all page objects using camelcase as object names
        runtime.page = requireDir(global.pageObjectPath, { camelcase: true });

        // expose locally
        self.page = runtime.page;

        // expose globally
        global.page = runtime.page;
    };

    // import shared objects from multiple paths (after global vars have been created)
    if (global.sharedObjectPaths && Array.isArray(global.sharedObjectPaths) && global.sharedObjectPaths.length > 0) {

        var allDirs = {};

        // first require directories into objects by directory
        global.sharedObjectPaths.forEach(function(itemPath){

            if (fs.existsSync(itemPath)){

                var dir = requireDir(itemPath, { camelcase: true });

                merge(allDirs, dir);
            }
        });

        // if we managed to import some directories, expose them
        if (Object.keys(allDirs).length > 0){

            // expose locally
            self.shared = allDirs;

            // expose globally
            global.shared = allDirs;
        }
    };
}

// export the "World" required by cucubmer to allow it to expose methods within step def's
module.exports = function () {

    this.World = World;

    // create the driver before scenario if it's not instantiated
    this.Before(function (scenario) {

        if (!driver || !this.driver) {
            this.driver = global.driver = getDriverInstance();
        }

        driver.manage().window().maximize();
    });

    // close the browser after each scenario to ensure a fresh enviroment for the next scenario
    this.After(function (scenario) {

        if (!scenario.isFailed()) {
            driver.close();
            return driver.quit();
        }
    });
};