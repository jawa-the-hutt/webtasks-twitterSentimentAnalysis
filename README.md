# Twitter Sentiment Analysis - via [webtask.io][1]

This repo contains example code that will show you how to:
1. Connect webtasks to search the Twitter API for all tweets based on your search criteria.
2. Get a Postive/Negative sentimate score via the npm package `sentiment` from the 'text' object of the tweet. 
3. Save this data to Azure Table Storage for use later in a dashboard.

## Getting Started
1. Install the wt command line client
    ```
    npm install wt-cli -g
    ```
2.  Initialize wt
    ```
    wt init EMAIL_ADDRESS
    ```
3.  You should get something like this:
    ```
    Please enter the verification code we sent to your@email.com below.
    Verification code: 123456
    Welcome to webtasks!  Create your first one as follows:
    
    $ echo "module.exports = function (cb) { cb(null, 'Hello'); }" > hello.js
    $ wt create hello.js
    ```
4.  Install all necessary packages:
    ```
    npm install
    ```
5.  Create a `.secrets` file
6.  Get TWitter API Keys and put the following in the `.secrets` file while substituting the actual keys where necessary:
    ```
    TWITTER_CONSUMER_KEY=key
    TWITTER_CONSUMER_SECRET=key
    TWITTER_ACCESS_TOKEN=key
    TWITTER_ACCESS_TOKEN_SECRET=key
    ```
7.  If you don't already have one, setup an Azure account.
8.  In Azure:
    *   Create a Resource Group.
    *   Create a Storage Account in the resource group.  Copy the name as you'll need it below
    *   In the Storage Account, goto the Keys and copy one of the keys as you'll need it below.
10. Back in `.secrets` file, add the following:
    ```
    TABLE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName='your copied storage account name';AccountKey='the copied key'
       ```
11. There is a config object in the main `index.js` that will allow you to configure how you want the Twitter search API endpoints to be used.  Here's a quick example:
    ```
    const twitterAPISearchArgs = {
      q: 'auth0', 
      result_type: 'recent', 
      count: 100,
      lang: 'en'
    };
    ```
12. Run the following from the command line:  `npm run debug`.  This will compile the code and then start the `wt` server where you'll be able to debug against locally.

13. Once you are done debugging, you ban publish by running the following command: `npm run deploy`.  This will compile your code, minify it, and then upload it to [webtasks.io][1]. If successful, you should see something like this:
    ```
    > auth0-tweet-sentiment-analysis@1.0.0 deploy D:\development\Auth0-webtasks
    > npm run build:prod && wt create -p node8 --secrets-file .secrets webtask.js

    > auth0-tweet-sentiment-analysis@1.0.0 build:prod D:\development\Auth0-webtasks
    > SET NODE_ENV=production&&webpack -p

    Hash: 434ce54f223fb78d123c
    Version: webpack 3.8.1
    Time: 1551ms
         Asset     Size  Chunks             Chunk Names
    webtask.js  16.3 kB       0  [emitted]  webtask
       [6] ./azure-table-storage/table-ops.js 3.02 kB {0} [built]
       [7] ./utils/async-it.js 2.02 kB {0} [built]
       [8] ./index.js 12.2 kB {0} [built]
      [11] ./azure-table-storage/entity-ops.js 21.3 kB {0} [built]
      [13] ./azure-table-storage/utils.js 23.9 kB {0} [built]
      [15] ./utils/is-guid.js 321 bytes {0} [built]
        + 11 hidden modules
    * Hint: A package.json file has been detected adjacent to your webtask. Ensuring that all dependencies from that file are available on the platform. This may take a few minutes for new versions of modules so please be patient.
    * Hint: If you would like to opt-out from this behaviour, pass in the --ignore-package-json flag.
    Resolving 6 modules...
    Provisioning 6 modules...
    azure-storage@2.6.0 is available
    babel-runtime@6.26.0 is available
    moment@2.19.2 is available
    object.entries@1.0.4 is available
    sentiment@4.1.0 is available
    twit@2.2.9 is available
    Webtask created
    
    You can access your webtask at the following url:
    https://wt-5a870934e941f76c1a45d7a93bf4dfc7-0.sandbox.auth0-extend.com/auth0-tweet-sentiment-analysis
    ```

## Some notes:

Be forewarned, the Twitter search API doesn't allow paging through the data as most well defined API's do. We get around this by trying to mimic a normal paging effort by taking in the max number of records at a time (100), and then go back and get 100 more until there isn't any further records retured.

Almost everything is done in ES6/ES7 and uses Async/Await extensively.  The Azure Table Storage code is currently self contained in this repo, but at some point in the future will probably be moved out to a seperate repo/npm package as it's essentially a multi-use wrapper for most all of the Azure Table Storage functions found in the [`azure-storage`][3] package.

To use some ES6/ES7 functions on [webtasks.io][1], you have to compile locally and then publish to the service via the `wt` client  This repo has relied on wepback & babel to do this.  Take a look at the `package.json`, `webpack.config.js` and `.babelrc` files to see how things are configured to allow this to happen.

## License

This project is licensed under the MIT License - see the [LICENSE.md][4] file for details

 [1]: <https://webtask.io>
 [3]: <https://github.com/Azure/azure-storage-node>
 [4]: <https://github.com/jawa-the-hutt/webtasks-twitterSentimentAnalysis/blob/master/LICENSE.md>
