module.exports = function () {

    this.When(/^I search Google for "([^"]*)"$/, function (searchQuery) {

        return driver.get('http://www.google.com').then(function(){
            return driver.findElement(by.name('q'));
        })
        .then(function(el){
            return el.sendKeys(searchQuery + selenium.Key.ENTER);
        });
    });

    this.Then(/^I should see some results$/, function () {

        return driver.wait(until.elementsLocated(by.css('div.g')), 10000).then(function(){
            return driver.findElements(by.css('div.g'));
        })
        .then(function (elements) {
            expect(elements.length).to.not.equal(0);
        });        
    });
};