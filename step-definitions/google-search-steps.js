module.exports = function () {

    this.When(/^I search Google for "([^"]*)"$/, function (searchQuery) {

        return helpers.loadPage('http://www.google.com').then(function() {

            // use a method on the page object which also returns a promise
            return page.googleSearch.preformSearch(searchQuery);
        })
    });

    this.Then(/^I should see some results$/, function () {

        // driver wair returns a promise so return that
        return driver.wait(until.elementsLocated(by.css('div.g')), 10000).then(function() {

            // return the promise of an element to the following then.
            return driver.findElements(by.css('div.g'));
        })
        .then(function (elements) {

            // verify this element has children
            expect(elements.length).to.not.equal(0);
        });
    });
};