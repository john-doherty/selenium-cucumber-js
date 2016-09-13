module.exports = function () {

    this.When(/^I search Google for "([^"]*)"$/, function (searchQuery, done) {

        driver.get('http://www.google.com');
        
        var input = driver.findElement(by.name('q'));
        
        input.sendKeys(searchQuery);
        input.sendKeys(selenium.Key.ENTER);

        done();
    });

    this.Then(/^I should see some results$/, function (done) {

        driver.wait(until.elementsLocated(by.css('div.g')), 10000);

        driver.findElements(by.css('div.g')).then(function (elements) {
            expect(elements.length).to.not.equal(0);
            done();
        });
    });
};