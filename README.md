# Twitter Sentiment Analysis - via [webtask.io][1]

This repo contains example code that will show you how to:
1. Connect webtasks to search the Twitter API for all tweets based on your search criteria.
2. Get a Postive/Negative sentimate score via the npm package `sentiment` from the 'text' object of the tweet. 
3. Save this data to Azure Table Storage for use later in a dashboard.

There is a config object in the main `index.js` that will allow you to configure how you want the Twitter search API endpoints to be used.  Here's a quick example:
```
    const twitterAPISearchArgs = {
      q: 'auth0', 
      result_type: 'recent', 
      count: 100,
      lang: 'en'
    };
```
Be forewarned, the Twitter search API doesn't allow paging through the data as most well defined API's do. We get around this by trying to mimic a normal paging effort by taking in the max number of records at a time (100), and then go back and get 100 more until there isn't any further records retured.

What is not in this repo is a Power BI workbook that takes the information saved in Azure Table Storage and then graphically represents the overall sentimate of tweets about your search criteria. You can view an example of what this looks like here:  [Auth0 Twitter Sentiment Analysis][2].  The data in this dashboard will update approximately every 3 hours or so and this limitation is due to Power BI and not this webtask.  The run time for the webtask that feeds this dashboard generally takes about 3-5 seconds to pull well over 1000 tweets, score them and then save them to Azure Table Storage.

It must also be noted that in this dashboard, tweets by any account name that starts with `auth0` are filtered out as well as any tweet that starts with `RT: ` as this would signify a retweet and as such, might skew the overall Positive/Negative sentiment.

Almost everything is done in ES6/ES7 and uses Async/Await extensively.  The Azure Table Storage code is currently self contained in this repo, but at some point in the near future will probably be moved out to a seperate repo/npm package as it's essentially a multi-use wrapper for most all of the Azure Table Storage functions found in the [`azure-storage`][3] package.

To use ES6/ES7 on [webtasks.io][1], you will have to compile locally and then publish to the service.  This repo has relied on wepback & babel to do this.  Take a look at the `package.json`, `webpack.config.js` and `.babelrc` files to see how things are configured to allow this to happen.  There are several scripts in the `package.json` file that will allow you to build and debug locally before publishing.

 [1]: <https://webtask.io>
 [2]: <https://twitter-sentiment-analysis.azurewebsites.net/>
 [3]: <https://github.com/Azure/azure-storage-node>