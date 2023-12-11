const redisClient = require("../config/redisConfig");
const LogModel = require("../models/LogModel");
const util = require("util");

const logCacheKey = "logs";
const updateInterval = 2 * 60 * 1000;
const limit = 100;
const lpushAsync = util.promisify(redisClient.lpush).bind(redisClient);
// Handle logs result - update Redis cache
const handleLogsResult = (logs, cacheKey) => {
  console.log("Logs retrieved from MongoDB");

  if (logs.length > 0) {
    // Update Redis cache with the latest logs based on the cache key
    redisClient.rpush(cacheKey, ...logs.map((log) => JSON.stringify(log)));
    // Set expiration time for the cache key (adjust the expiration time as needed)
    redisClient.expire(cacheKey, 2 * 60); // Cache expires in 2 minutes
  }
};

const updateRedisCache = async () => {
  console.log("Updating Redis cache....");
  const latestLogs = await LogModel.find({})
    .sort({ timestamp: -1 })
    .select("-_id")
    .limit(limit);
  const logStringArray = latestLogs.map((log) => JSON.stringify(log));
  redisClient.del(logCacheKey, (err, response) => {
    redisClient.rpush(logCacheKey, ...logStringArray);
  });
};

updateRedisCache();

setInterval(updateRedisCache, updateInterval);
module.exports = {
  handleLogsResult,
  logCacheKey,
};
