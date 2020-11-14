#!/usr/bin/env node

'use strict';

var fs = require('fs-plus');
var path = require('path');
var program = require('commander');
var pjson = require('./package.json');
var cucumber = require('cucumber');

function collectPaths(value, paths) {
    paths.push(value);
    return paths;
}

function coerceInt(value, defaultValue) {

    var int = parseInt(value);

    if (typeof int === 'number') return int;

    return defaultValue;
}

var config = {
    steps: './step-definitions',
    pageObjects: './page-objects',
    sharedObjects: './shared-objects',
    featureFiles: './features',
    reports: './reports',
    browser: 'chrome',
    browserTeardownStrategy: 'always',
    timeout: 15000
};

var configFileName = path.resolve(process.cwd(), 'selenium-cucumber-js.json');

if (fs.isFileSync(configFileName)) {
    config = Object.assign(config, require(configFileName));
}

program
    .version(pjson.version)
    .description(pjson.description)
    .option('-s, --steps <path>', 'path to step definitions. defaults to ' + config.steps, config.steps)
    .option('-p, --pageObjects <path>', 'path to page objects. defaults to ' + config.pageObjects, config.pageObjects)
    .option('-o, --sharedObjects [paths]', 'path to shared objects (repeatable). defaults to ' + config.sharedObjects, collectPaths, [config.sharedObjects])
    .option('-b, --browser <path>', 'name of browser to use. defaults to ' + config.browser, config.browser)
    .option('-k, --browser-teardown <optional>', 'browser teardown strategy after every scenario (always, clear, none). defaults to "always"', config.browserTeardownStrategy)
    .option('-r, --reports <path>', 'output path to save reports. defaults to ' + config.reports, config.reports)
    .option('-d, --disableLaunchReport [optional]', 'Disables the auto opening the browser with test report')
    .option('-j, --junit <path>', 'output path to save junit-report.xml defaults to ' + config.reports)
    .option('-t, --tags <tagName>', 'name of tag to run', collectPaths, [])
    .option('-f, --featureFiles <paths>', 'comma-separated list of feature files to run or path to directory defaults to ' + config.featureFiles, config.featureFiles)
    .option('-x, --timeOut <n>', 'steps definition timeout in milliseconds. defaults to ' + config.timeout, coerceInt, config.timeout)
    .option('-n, --noScreenshot [optional]', 'disable auto capturing of screenshots when an error is encountered')
    .option('-w, --worldParameters <JSON>', 'JSON object to pass to cucumber-js world constructor. defaults to empty', config.worldParameters)
    .parse(process.argv);

program.on('--help', function () {
    console.log('  For more details please visit https://github.com/john-doherty/selenium-cucumber-js#readme\n');
});

// store browserName globally (used within world.js to build driver)
global.browserName = program.browser;
global.browserTeardownStrategy = program.browserTeardown;

// store Eyes Api globally (used within world.js to set Eyes)
global.eyesKey = config.eye_key;

// used within world.js to import page objects
global.pageObjectPath = path.resolve(program.pageObjects);

// used within world.js to output reports
global.reportsPath = path.resolve(program.reports);
if (!fs.existsSync(program.reports)) {
    fs.makeTreeSync(program.reports);
}

// used within world.js to decide if reports should be generated
global.disableLaunchReport = (program.disableLaunchReport);

// used with world.js to determine if a screenshot should be captured on error
global.noScreenshot = (program.noScreenshot);

// used within world.js to output junit reports
global.junitPath = path.resolve(program.junit || program.reports);

// set the default timeout to 10 seconds if not already globally defined or passed via the command line
global.DEFAULT_TIMEOUT = global.DEFAULT_TIMEOUT || program.timeOut || 10 * 1000;

// used within world.js to import shared objects into the shared namespace
global.sharedObjectPaths = program.sharedObjects.map(function (item) {
    return path.resolve(item);
});

// rewrite command line switches for cucumber
process.argv.splice(2, 100);

// allow specific feature files to be executed
if (program.featureFiles) {
    var splitFeatureFiles = program.featureFiles.split(',');

    splitFeatureFiles.forEach(function (feature) {
        process.argv.push(feature);
    });
}

// add switch to tell cucumber to produce json report files
process.argv.push('-f');
process.argv.push('pretty');
process.argv.push('-f');
process.argv.push('json:' + path.resolve(__dirname, global.reportsPath, 'cucumber-report.json'));

// add cucumber world as first required script (this sets up the globals)
process.argv.push('-r');
process.argv.push(path.resolve(__dirname, 'runtime/world.js'));

// add path to import step definitions
process.argv.push('-r');
process.argv.push(path.resolve(program.steps));

// add tag
if (program.tags) {
    program.tags.forEach(function (tag) {
        process.argv.push('-t');
        process.argv.push(tag);
    });
}

if (program.worldParameters){
    process.argv.push('--world-parameters');
    process.argv.push(program.worldParameters);
}

// add strict option (fail if there are any undefined or pending steps)
process.argv.push('-S');

//
// execute cucumber
//
var cucumberCli = cucumber.Cli(process.argv);

global.cucumber = cucumber;

cucumberCli.run(function (succeeded) {

    var code = succeeded ? 0 : 1;

    function exitNow() {
        process.exit(code);
    }

    if (process.stdout.write('')) {
        exitNow();
    }
    else {
        // write() returned false, kernel buffer is not empty yet...
        process.stdout.on('drain', exitNow);
    }
});
