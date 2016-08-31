module.exports = {

    elements: {
        searchInput: by.name('q')
    },

    preformSearch: function (keywords) {

        var input = driver.findElement(page.search.elements.searchInput);
        
        input.sendKeys(keywords);
        input.sendKeys(selenium.Key.ENTER);
    }
};