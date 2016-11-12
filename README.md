# Free Code Camp "Image Search Abstraction Layer" Project

Takes a search string and returns up to ten image search results. An optional offset value may be passed to see subsequent pages of results. Can also return the ten most recent searches along with the time they were made (formatted as a unix timestamp).

### Example search:
* https://nameless-savannah-20182.herokuapp.com/api/hello world
* might return:
* [{"imgURL":"example.com/helloworld.jpg","pageURL":"example.com","pageTitle":"Example Domain"},{...}]

### Example recents
* https://nameless-savannah-20182.herokuapp.com/api/recent/searches
* might return:
* [{"search":"hello world","time":"1234567"},{...}]
