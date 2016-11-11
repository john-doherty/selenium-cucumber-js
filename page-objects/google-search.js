module.exports = {

    url: 'http://www.google.co.uk',

    elements: {
        searchInput: by.name('q'),
        searchResultLink: by.css('div.g > h3 > a')
    },

    preformSearch: function (keywords) {

        var selector = page.googleSearch.elements.searchInput;

        return driver.findElement(selector).sendKeys(keywords, selenium.Key.ENTER);
    }
};