;var EventSearchAPI = function(partnerId) {
    var me = this;
    me.partnerId = partnerId, me.lastSearchPhrase = null, me.lastPage = 0, me.lastXhr = null, me.lastCategory = null, me.lastSort = null;

    // Binds a form/input to a search callback
    // formSelector string css selector for form containing search input
    // inputSelector string css selector for search input
    // genreSelector string css selector to pull the genre from
    // onSuccess function(events, keywords, page) callback takes three arguments,
    //    array of event objects, keywords search, current page
    me.bind = function(formSelector, inputSelector, genreSelector, onSuccess) {
        jQuery(formSelector).submit(function(){
            var value = jQuery(inputSelector).val();
            var genre = genreSelector ? jQuery(genreSelector).val() : null;
            var sort = 'date';
            me.search(value, genre, sort, 1, onSuccess);
            return false;
        });
    };

    // Binds the click action of a link/element ID'd by `selector`
    // to the `more` method.  This method simply loads more search results
    // if more can be loaded.
    //
    // selector string css selector of element/link
    // onSuccess callback
    // eventType defaults to `click` but can be changed
    me.bindMore = function(selector, onSuccess, eventType) {
        eventType = eventType || 'click';
        jQuery(selector)[eventType](function() {
            search.more(onSuccess);
            return false;
        });
    };

    // Fire off a search
    // keywords string search phrase to search
    // category int id of genre/category to search
    // sort string name, popularity, or date
    // page int
    // onSuccess function(events, phrase, page)
    me.search = function(phrase, category, sort, page, onSuccess) {
        // Kill any outstanding xhr requests
        me.lastXhr && me.lastXhr.abort && me.lastXhr.abort();
        me.lastSearchPhrase = phrase;
        me.lastCategory = category;
        me.lastSort = sort;
        page = page || 1;
        limit = 24;

        var url = "http://api.showclix.com/Event/search?partner=" +
            me.partnerId + "&follow[]=venue&limit=" + limit + "&keyword=" + phrase + "&page=" + page;
        if (category) url = url + "&genre=" + category;
        if (sort) url = url + "&by=" + sort;

        me.lastXhr = jQuery.ajax({
            type: "get",
            dataType: "jsonp",
            url: url,
            success: function(data, text, xhr) {
                me.lastPage = page;
                onSuccess(data, me.lastSearchPhrase, me.lastPage);
            },
            error: function(xhr) {
                // console && console.log && console.log("Unable to reach servers.");
                me.genericErrorHandler && me.genericErrorHandler(xhr);
            }
        });
    };

    // Helper function that just uses the lased keyphrase and
    // page it left off at to load more results
    me.more = function(onSuccess) {
        // Have to have had at least on successful search
        me.lastPage && me.search(me.lastSearchPhrase, me.lastCategory, me.lastSort, me.lastPage + 1, onSuccess);
    };

    // Add an error handler that will get called when there
    // are problems with Network IO
    // onErrorCallback function callback optionally accepts an XHR as only argument
    me.addErrorHandler = function(onErrorCallback) {
        me.genericErrorHandler = onErrorCallback;
    };

    // Get the names an id's of all available categories
    // sorted in their default order
    me.jQuery = function() {
        return [
            [9,'Art / Exhibit'],
            [17,'Club Night'],
            [5,'Comedy'],
            [7,'Community'],
            [1,'Concert'],
            [4,'Conference'],
            [6,'Festival'],
            [14,'Fundraiser'],
            [3,'Networking'],
            [11,'Party'],
            [2,'Performing Arts'],
            [13,'Raffle'],
            [16,'Retreat'],
            [15,'Reunion'],
            [12,'Sporting'],
            [8,'Trade Show'],
            [18,'Workshop'],
            [10,'Other']
        ];
    }
};
