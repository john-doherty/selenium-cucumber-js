module.exports = function () {

    this.Given(/^I am on the Mammoth Workwear home page$/, function (done) {

        // load google
        helpers.loadPage(page.mammothWorkwear.url).then(function(){
            done();
        });
    });

    this.When(/^I click navigation item "([^"]*)"$/, function (linkTitle, done) {

        // click an item in the search results via the google page object
        page.mammothWorkwear.clickNavigationItem(linkTitle).then(function(){
            done();
        });
    });

    this.Then(/^I click product item "([^"]*)"$/, function (productTitle, done) {

        // click an item in the search results via the google page object
        page.mammothWorkwear.clickProductItem(productTitle).then(function(){
            done();
        });
    });

    this.Then(/^I should see product detail with title "([^"]*)"$/, function (pageTitle, done) {

        page.mammothWorkwear.titleContains(pageTitle).then(function(){
            done();
        });
    });
};