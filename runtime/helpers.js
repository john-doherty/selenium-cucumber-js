module.exports = {

    /**
     * returns a promise that is called when the url has loaded and the body element is present
     * @param {string} url - url to load
     * @param {integer} waitInSeconds - number of seconds to wait for page to load
     * @returns {Promise} resolved when url has loaded otherwise rejects
     * @example
     *      helpers.loadPage('http://www.google.com');
     */
    loadPage: function(url, waitInSeconds) {

        // use either passed in timeout or global default
        var timeout = (waitInSeconds) ? (waitInSeconds * 1000) : DEFAULT_TIMEOUT;

        // load the url and wait for it to complete
        return driver.get(url).then(function() {

            // now wait for the body element to be present
            return driver.wait(until.elementLocated(by.css('body')), timeout);
        });
    },

    /**
     * returns the value of an attribute on an element
     * @param {string} htmlCssSelector - HTML css selector used to find the element
     * @param {string} attributeName - attribute name to retrieve
     * @returns {string} the value of the attribute or empty string if not found
     * @example
     *      helpers.getAttributeValue('body', 'class');
     */
    getAttributeValue: function (htmlCssSelector, attributeName) {

        // get the element from the page
        return driver.findElement(by.css(htmlCssSelector)).then(function(el) {
            return el.getAttribute(attributeName);
        });
    },

    /**
     * returns list of elements matching a query selector who's inner text matches param.
     * WARNING: The element returned might not be visible in the DOM and will therefore have restricted interactions
     * @param {string} cssSelector - css selector used to get list of elements
     * @param {string} textToMatch - inner text to match (does not have to be visible)
     * @returns {Promise} resolves with list of elements if query matches, otherwise rejects
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

            for (var i = 0, l = elements.length; i < l; i++) {
                if (elements[i][txtProp].trim() === content.trim()) {
                    results.push(elements[i]);
                }
            }

            return results;
        }

        // grab matching elements
        return driver.findElements(by.js(findElementsContainingText, cssSelector, textToMatch));
    },

    /**
     * returns first elements matching a query selector who's inner text matches textToMatch param
     * @param {string} cssSelector - css selector used to get list of elements
     * @param {string} textToMatch - inner text to match (does not have to be visible)
     * @returns {Promise} resolves with first element containing text otherwise rejects
     * @example
     *      helpers.getFirstElementContainingText('nav[role="navigation"] ul li a', 'Safety Boots').click();
     */
    getFirstElementContainingText: function(cssSelector, textToMatch) {

        return helpers.getElementsContainingText(cssSelector, textToMatch).then(function(elements) {
            return elements[0];
        });
    },

    /**
     * clicks an element (or multiple if present) that is not visible, useful in situations where a menu needs a hover before a child link appears
     * @param {string} cssSelector - css selector used to locate the elements
     * @param {string} textToMatch - text to match inner content (if present)
     * @returns {Promise} resolves if element found and clicked, otherwise rejects
     * @example
     *      helpers.clickHiddenElement('nav[role="navigation"] ul li a','Safety Boots');
     */
    clickHiddenElement: function(cssSelector, textToMatch) {

        // method to execute within the DOM to find elements containing text
        function clickElementInDom(query, content) {

            // get the list of elements to inspect
            var elements = document.querySelectorAll(query);

            // workout which property to use to get inner text
            var txtProp = ('textContent' in document) ? 'textContent' : 'innerText';

            for (var i = 0, l = elements.length; i < l; i++) {

                // if we have content, only click items matching the content
                if (content) {

                    if (elements[i][txtProp] === content) {
                        elements[i].click();
                    }
                }
                // otherwise click all
                else {
                    elements[i].click();
                }
            }
        }

        // grab matching elements
        return driver.findElements(by.js(clickElementInDom, cssSelector, textToMatch));
    },

    /**
     * Waits until a HTML attribute equals a particular value
     * @param {string} elementSelector - HTML element CSS selector
     * @param {string} attributeName - name of the attribute to inspect
     * @param {string} attributeValue - value to wait for attribute to equal
     * @param {integer} waitInMilliseconds - number of milliseconds to wait for page to load
     * @returns {Promise} resolves if attribute eventually equals, otherwise rejects
     * @example
     *      helpers.waitUntilAttributeEquals('html', 'data-busy', 'false', 5000);
     */
    waitUntilAttributeEquals: function(elementSelector, attributeName, attributeValue, waitInMilliseconds) {

        // use either passed in timeout or global default
        var timeout = waitInMilliseconds || DEFAULT_TIMEOUT;

        // readable error message
        var timeoutMessage = attributeName + ' does not equal ' + attributeValue + ' after ' + waitInMilliseconds + ' milliseconds';

        // repeatedly execute the test until it's true or we timeout
        return driver.wait(function() {

            // get the html attribute value using helper method
            return helpers.getAttributeValue(elementSelector, attributeName).then(function(value) {

                // inspect the value
                return value === attributeValue;
            });

        }, timeout, timeoutMessage);
    },

    /**
     * Waits until a HTML attribute exists
     * @param {string} elementSelector - HTML element CSS selector
     * @param {string} attributeName - name of the attribute to inspect
     * @param {integer} waitInMilliseconds - number of milliseconds to wait for page to load
     * @returns {Promise} resolves if attribute exists within timeout, otherwise rejects
     * @example
     *      helpers.waitUntilAttributeExists('html', 'data-busy', 5000);
     */
    waitUntilAttributeExists: function(elementSelector, attributeName, waitInMilliseconds) {

        // use either passed in timeout or global default
        var timeout = waitInMilliseconds || DEFAULT_TIMEOUT;

        // readable error message
        var timeoutMessage = attributeName + ' does not exists after ' + waitInMilliseconds + ' milliseconds';

        // repeatedly execute the test until it's true or we timeout
        return driver.wait(function() {

            // get the html attribute value using helper method
            return helpers.getAttributeValue(elementSelector, attributeName).then(function(value) {

                // attribute exists if value is not null
                return value !== null;
            });

        }, timeout, timeoutMessage);
    },

    /**
     * Waits until a HTML attribute no longer exists
     * @param {string} elementSelector - HTML element CSS selector
     * @param {string} attributeName - name of the attribute to inspect
     * @param {integer} waitInMilliseconds - number of milliseconds to wait for page to load
     * @returns {Promise} resolves if attribute is removed within timeout, otherwise rejects
     * @example
     *      helpers.waitUntilAttributeDoesNotExists('html', 'data-busy', 5000);
     */
    waitUntilAttributeDoesNotExists: function(elementSelector, attributeName, waitInMilliseconds) {

        // use either passed in timeout or global default
        var timeout = waitInMilliseconds || DEFAULT_TIMEOUT;

        // readable error message
        var timeoutMessage = attributeName + ' still exists after ' + waitInMilliseconds + ' milliseconds';

        // repeatedly execute the test until it's true or we timeout
        return driver.wait(function() {

            // get the html attribute value using helper method
            return helpers.getAttributeValue(elementSelector, attributeName).then(function(value) {

                // attribute exists if value is not null
                return value === null;
            });

        }, timeout, timeoutMessage);
    },

    /**
     * Get the content value of a :before pseudo element
     * @param {string} cssSelector - css selector of element to inspect
     * @returns {Promise} executes .then with value
     * @example
     *      helpers.getPseudoElementBeforeValue('body header').then(function(value) {
     *          console.log(value);
     *      });
     */
    getPseudoElementBeforeValue: function(cssSelector) {

        function getBeforeContentValue(qs) {

            var el = document.querySelector(qs);
            var styles = el ? window.getComputedStyle(el, ':before') : null;

            return styles ? styles.getPropertyValue('content') : '';
        }

        return driver.executeScript(getBeforeContentValue, cssSelector);
    },

    /**
     * Get the content value of a :after pseudo element
     * @param {string} cssSelector - css selector of element to inspect
     * @returns {Promise} executes .then with value
     * @example
     *      helpers.getPseudoElementAfterValue('body header').then(function(value) {
     *          console.log(value);
     *      });
     */
    getPseudoElementAfterValue: function(cssSelector) {

        function getAfterContentValue(qs) {

            var el = document.querySelector(qs);
            var styles = el ? window.getComputedStyle(el, ':after') : null;

            return styles ? styles.getPropertyValue('content') : '';
        }

        return driver.executeScript(getAfterContentValue, cssSelector);
    },

    clearCookies: function() {
        return driver.manage().deleteAllCookies();
    },

    clearStorages: function() {
        return driver.executeScript('window.localStorage.clear(); window.sessionStorage.clear();')
    },

    clearCookiesAndStorages: function() {
        return helpers.clearCookies().then(helpers.clearStorages());
    }
};
