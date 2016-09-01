var path = require('path'),
    program = require('commander'),
    pjson = require('./package.json');

program
  .version(pjson.version)
  .description(pjson.description)
  .option('-s, --steps <path>', 'path to step definitions. defaults to ./step-definitions', './step-definitions')
  .option('-p, --pageObjects [path]', 'path to page objects. defaults to ./page-objects', './page-objects')
  .option('-o, --sharedObjects <path>', 'path to shared objects. defaults to ./shared-objects', './shared-objects')
  .option('-b, --browser <path>', 'name of browser to use. defaults to chrome', /^(chrome|firefox|phantomjs)$/i, 'chrome')
  .option('-t, --tags <tagName>', 'name of tag to run')
  .parse(process.argv);

  [value]

program.on('--help', function(){
    console.log('  For more details please visit https://github.com/john-doherty/selenium-cucumber-js#readme\n');
});

// store browserName globally (used within world.js to build driver)
global.browserName = program.browser;

// used within world.js to import page objects
global.pageObjects = path.resolve(program.pageObjects);

// used within world.js to import shared objects into the shared namespace
global.sharedObjects = path.resolve(program.sharedObjects);

// rewrite command line switches for cucumber
process.argv.splice(2, 100);

// add cucumber world as first required script (this sets up the globals)
process.argv.push('-r');
process.argv.push(path.join(__dirname, 'runtime/world.js'));

// add path to import step definitions
process.argv.push('-r');
process.argv.push(program.steps);

// add tag
if (program.tags) {
    process.argv.push('-t');
    process.argv.push(program.tags);
}

if (process.platform === 'win32') {
    require('./node_modules/.bin/cucumber-js');
}
else {
    require('./node_modules/.bin/cucumber.js');
}