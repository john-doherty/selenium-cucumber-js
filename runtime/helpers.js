module.exports = {

    /**
     * returns a promise that is called when the url has loaded and the body element is present
     * @param {string} url to load
     * @returns {Promise}
     * @example
     *      helpers.loadPage('http://www.google.com');
     */
    loadPage: function(url, waitInSeconds) {

        // use either passed in timeout or global 10 seconds default
        var timeout = (waitInSeconds) ? (waitInSeconds * 1000) : DEFAULT_TIMEOUT;

        // load the url and wait for it to complete
        return driver.get(url).then(function() {

            // now wait for the body element to be present
            return driver.wait(until.elementLocated(by.css('body')), timeout);
        });
    },

    /***
     * returns the value of an attribute on an element   
     * @param {string} css selector used to find the element
     * @param {string} attribute name to retrieve
     * @returns {string} the value of the attribute or empty string if not found
     * @example
     *      helpers.getAttributeValue('body', 'class');
     */
    getAttributeValue: function (selector, attributeName) {

        // get the element from the page
        return driver.findElement(by.css(selector)).then(function(attributeValue) {
            return attributeValue;
        })
        .catch(function(){
            return '';
        });
    },

    /**
     * returns list of elements matching a query selector who's inner text mathes param
     * @param {string} css selector used to get list of elements
     * @param {string} inner text to match (does not have to be visible)
     * @returns {Promise}
     * @example
     *      helpers.getElementsContainingText('nav[role="navigation"] ul li a', 'Safety Boots')
     */
    getElementsContainingText: function(cssSelector, textToMatch) {

        // method to execute within the DOM to find elements containing text
        function findElementsContainingText(query, content) {

            var results = []; // array to hold results

            // workout which property to use to get inner text
            var txtProp = ('textContent' in document) ? 'textContent' : 'innerText';

            // get the list of elements to inspect
            var elements = document.querySelectorAll(query);

            for (var i=0, l=elements.length; i<l; i++) {
                if (elements[i][txtProp] === content){
                    results.push(elements[i]);
                }
            }

            return results;
        };

        // grab matching elements
        return driver.findElements(by.js(findElementsContainingText, cssSelector, textToMatch));
    },

    /**
     * returns first elements matching a query selector who's inner text matches textToMatch param
     * @param {string} css selector used to get list of elements
     * @param {string} inner text to match (does not have to be visible)
     * @returns {Promise}
     * @example
     *      helpers.getFirstElementContainingText('nav[role="navigation"] ul li a', 'Safety Boots').click();
     */
    getFirstElementContainingText: function(cssSelector, textToMatch){
        return helpers.getElementsContainingText(cssSelector, textToMatch).then(function(elements){
            return elements[0];
        });
    }

};