#Javascript Client for ShowClix Search API

This is a basic JavaScript wrapper around the ShowClix REST API, specifically, the search part of the ShowClix REST API.  It relies on JSONP and requires jQuery to make handling JSONP sane.


#Use it

Here is a trivial example of the main method in the library, EventSearchAPI.search.  Gets the value of an input box, fires off a search, and then logs the results.


    var phrase = document.getElementById("search_input").value;
    var api = new EventSearchAPI(1);
    api.search(phrase, null, "date", 0, function(events) {
        for (i in events) {
            console.log(events[i].event);
        }
    });

For complete examples, check out the `examples` directory.

#Reference

## new EventSearchAPI(int partner)

Instantiate a new EventSearchAPI object.  It takes a single paramter to identify the partner account to search.

## EventSearchAPI.search(string phrase, int category, string sort, int page, function onSuccess)

`keywords` `string` search phrase to search

`category` `int` id of category/genre to search (see `EventSearchAPI.getCategories()`)

`sort` `string` options: ("name", "date", "popularity")

`page` `int` which page of results are we interested in (default 0)

`onSuccess` `function(events, phrase, page)` callback called upon successful completion of a search.  `events` is an array of object literals
containing event information
