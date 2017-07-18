module.exports = function () {

    this.Given(/^I am on the Mammoth Workwear home page$/, function () {

        // load google
        return helpers.loadPage(page.mammothWorkwear.url);
    });

    this.When(/^I click navigation item "([^"]*)"$/, function (linkTitle) {

        // click an item in the search results via the google page object
        return page.mammothWorkwear.clickNavigationItem(linkTitle);
    });

    this.Then(/^I click product item "([^"]*)"$/, function (productTitle) {

        // click an item in the search results via the google page object
        return page.mammothWorkwear.clickProductItem(productTitle);
    });

    this.Then(/^I should see product detail with title "([^"]*)"$/, function (pageTitle) {

        return page.mammothWorkwear.titleContains(pageTitle);
    });
};
