module.exports = function () {

    this.When(/^I search Google for "([^"]*)"$/, function (searchQuery) {

        driver.get('http://www.google.com');
        
        var input = driver.findElement(by.name('q'));
        
        input.sendKeys(searchQuery);
        input.sendKeys(selenium.Key.ENTER);

        // page object example
        //page.search.preformSearch(searchQuery);
    });

    this.Then(/^I should see some results$/, function () {

        driver.wait(until.elementsLocated(by.css('div.g')), 10000);

        return driver.findElements(by.css('div.g')).then(function (elements) {
            expect(elements.length).to.not.equal(0);
        });
    });
};