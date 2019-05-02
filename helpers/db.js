let redis = require("redis");
require("dotenv").config();
/* Redis client */
const client = redis.createClient({
  port: process.env.REDIS_PORT, //port
  host: process.env.REDIS_HOST, //hostanme or IP address
  password: process.env.REDIS_PASSWORD //password
});
client.on("connect", function() {
  console.log("Redis client connected");
});
client.on("error", function(err) {
  console.log("Something went wrong " + err);
});

module.exports = { client };
