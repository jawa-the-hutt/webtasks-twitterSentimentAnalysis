'use latest';
import azure from 'azure-storage';
import Twit from 'twit';
import sentiment from 'sentiment';
import moment from 'moment';
import TableOps from './azure-table-storage/table-ops';
import EntityOps from './azure-table-storage/entity-ops';

module.exports = (context, cb) => {
    //console.log('context - ', context);
    const tableService = azure.createTableService(context.secrets.TABLE_STORAGE_CONNECTION_STRING);
    const twitter = new Twit({
      consumer_key:         context.secrets.TWITTER_CONSUMER_KEY,
      consumer_secret:      context.secrets.TWITTER_CONSUMER_SECRET,
      access_token:         context.secrets.TWITTER_ACCESS_TOKEN,
      access_token_secret:  context.secrets.TWITTER_ACCESS_TOKEN_SECRET,
      timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    });
   
    const twitterAPISearchArgs = {
      q: 'auth0', 
      result_type: 'recent', 
      count: 100,
      lang: 'en'
    };

    createTable(tableService).then(result => {
      getTweets(twitter, twitterAPISearchArgs).then(tweets => {
        saveTweets(tableService, tweets).then(result => {
          //console.log('result - ', result);
          cb(null, tweets);
        });
      });
    });
};

// create the table in Azure Table Storage if it doesn't already exist
let createTable = async (tableService) => {
  try{
      let action = new TableOps({tableName: 'twitterSentimentAnalysis'}, tableService, 'createTableIfNotExists');
      return await action.run().then(response => {
        //console.log('response - ', response);
        if (response instanceof Error) {
            //console.log('error in response')
            return {
              status: response.status ? response.status : 500,
              body: {
                  message: response.message ? response.message : 'Unknown Error!',
                  stackTrace: response.stack ? response.stack : ''
              }
            };
        } else {
          return {
            status: response.status ? response.status : 200,
            body: 'ok',
            headers: {
                'content-type': 'application/json'
            }
          };
        };
      }).then(res => {
        //console.log('final response - ', res);
        return res;
      });
  } catch (e){
     console.log(e);
     return e;
  };
};

let getTweets = async (twitter, twitterAPISearchArgs) => {
  try{
    let results = await search(twitter, twitterAPISearchArgs, []).then(tweets => {
      let savedTweets = [];
      let tweetCount = 0;

      // iterate through returned tweets and shape them for azure table storage
      while(tweetCount < tweets.length){
        for(let tweet of tweets) {
          tweetCount++;

          // get sentimate score for each tweet
          let sentimentScore = sentiment(tweet.text);

          // setup the data for table storage the slice(4) on the tweet.created_at is there
          // to get past a bug with moment.js parsing of the twitter date pattern for dates that fall
          // on Thursday.  'Thu' was not being parsed with the standard 'ddd' pattern for moment.js
          let savedTweet = {
            PartitionKey: 'auth0Tweets',
            RowKey: tweet.id_str,
            id: tweet.id_str,
            text: tweet.text,
            user: tweet.user.screen_name,
            created_at: moment(tweet.created_at.slice(4), 'MMM DD HH:mm:ss ZZ YYYY', 'en').format(),
            user_followers_count: tweet.user.followers_count,
            hashtags: tweet.entities.hashtags,
            geo: tweet.geo,
            score: sentimentScore.score,
            comparative: sentimentScore.comparative,
            positive: sentimentScore.positive,
            negative: sentimentScore.negative
          };
          savedTweets.push(savedTweet);
        };
      };
      return savedTweets;
    });
    return results;
  } catch (e){
    console.log(e);
    return e;
  };
};

let search = async (twitter, twitterAPISearchArgs, matchedTweets, lastId) => {
  try{
  
    // add the argument to the search
    if(lastId)
      twitterAPISearchArgs.max_id = lastId;
  
    // search twitter
    const searchTwitter = await twitter.get('search/tweets', twitterAPISearchArgs).then(result => {
      if(result.data.statuses) {
        // check to see if we need to page through more tweets from search API
        return searchResults(result.data.statuses, matchedTweets);
      } else {
        return matchedTweets;
      };

    }).catch(err => {
      console.log('caught error', err.stack)
    });
    
    return searchTwitter;

  } catch (e){
    console.log(e);
    return e;
  };

  function searchResults (page, matchedTweets) {

    // there are not more results to process
    if (!page.length) {
      return matchedTweets;
    };

    //Get rid of the first element of each iteration (not the first time)
    if (matchedTweets.length) 
      page.shift();

    // aggregate previous tweets with new tweets in this page
    matchedTweets = matchedTweets.concat(page);

    // get the starting point of the next page
    var thisId = parseInt(matchedTweets[matchedTweets.length - 1].id_str);

    // iterate back through with one last check of the page to make
    // sure we didn't shift the last tweet out earlier
    if (page.length) 
      return search(twitter, twitterAPISearchArgs, matchedTweets, thisId);
  };
};

let saveTweets = async (tableService, tweets) => {
  try{
      let action = new EntityOps({tableName: 'twitterSentimentAnalysis', data: tweets}, tableService, 'insertOrReplaceEntity');
      return await action.run().then(response => {
        if (response instanceof Error) {
            console.log('error in response')
            return {
              status: response.status ? response.status : 500,
              body: {
                  message: response.message ? response.message : 'Unknown Error!',
                  stackTrace: response.stack ? response.stack : ''
              }
            }
        } else {
          return {
            status: response.status ? response.status : 200,
            body: 'ok',
            headers: {
                'content-type': 'application/json'
            }
          }
        }
      }).then(res => {
        //console.log('final response - ', res);
        return res;
      });
  } catch (e){
     console.log(e);
     return e;
  };
};
