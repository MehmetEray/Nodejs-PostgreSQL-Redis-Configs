const express = require('express');
const fetch = require("node-fetch");
const redis = require('redis');

// Express Application Instance
const app = express();

// Creating and connecting redis client to local instance (port 6379)
const redisClient = redis.createClient(6379);

// Echo Redis Error
redisClient.on('error', (err) => {
  console.log(err);
});

// Get User Posts
app.get('/posts', (req, res) => {
  const postsRedisKey = 'user:posts';
  return redisClient.get(postsRedisKey, (err, posts) => {
    if(posts){
      return res.json({ source: 'cache', data: JSON.parse(posts) })
    } else { // If Key does not exist in Redis

        // Fetching directly from remote api
      fetch('https://jsonplaceholder.typicode.com/posts')
        .then(result => result.json())
        .then(posts => {

          // Save the  API response in Redis store,  data expire time in 3600 seconds, means one hour
          redisClient.setex(postsRedisKey, 3600, JSON.stringify(posts));

          // Send response to client
          return res.json({ source: 'API', data: posts });

        })
        .catch(error => {
          // Error message
          console.log(error);
          // Send error to the client
          return res.json(error.toString());
        })
    }
  })
});

// Starting Express server at port 3000
app.listen(3000, () => {
  console.log('Server listening on port:', 3000);
});