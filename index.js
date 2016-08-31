var path = require('path'),
    program = require('commander'),
    pjson = require('./package.json');

program
  .version(pjson.version)
  .description(pjson.description)
  .option('-f, --features <path>', 'path to feature files')
  .option('-s, --steps <path>', 'path to step definitions. defaults to ./step-definitions', './step-definitions')
  .option('-p, --pageObjects <path>', 'path to page objects')
  .option('-b, --browser <path>', 'name of browser to use. defaults to chrome', /^(chrome|firefox|phantomjs)$/i, 'chrome')
  .option('-t, --tags <tagName>', 'name of tag to run')
  .parse(process.argv);

program.on('--help', function(){
    console.log('  For more details please visit https://github.com/john-doherty/selenium-cucumber-js#readme\n');
});

// store browserName globally (used within world.js)
global.browserName = program.browser;

// rewrite command line switches for cucumber
process.argv.splice(2, 100);

// add cucumber world as first required script (this sets up the gloals)
process.argv.push('-r');
process.argv.push(path.join(process.cwd(), 'runtime/world.js'));

// add cucumber world as first required script (this sets up the gloals)
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