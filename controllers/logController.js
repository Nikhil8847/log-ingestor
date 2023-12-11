const LogModel = require("../models/LogModel");
const { StatusCodes } = require("http-status-codes");
const redisClient = require("../config/redisConfig");
const {
  addTimeStampQuery,
  createMongoDBFilter,
  saveLogToDatabase,
  generateCacheKey,
} = require("../helpers/helpers");
const { handleLogsResult, logCacheKey } = require("../helpers/redisutils");

const ingestLog = async (req, res) => {
  try {
    const log = new LogModel(req.body);
    saveLogToDatabase(log);
    res.status(StatusCodes.CREATED).send("Log ingestiong request accepted");
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Internal Server Error",
    });
  }
};

// HOW TO INCREASE EFFICIENCY ????
// 1. USE MULTIPLE SERVERS WITH LOAD - BALANCING ---> PAID
// 2. SAME AS ABOVE BUT ALSO CAN USE READ REPLICAS TO APPRECIATE PERFORMANCE MORE ---> PAID
// 3. USE REDIS TO CACHE THE VALUES WITH CACHE UPDATE EVERY 2 MINUTES ---> CHOSEN
// AND MANY MORE THINGS (NEED TO EXPLORE)
/*
  a. The approach is cost efficient, I can support caching and implement the cache eviction
  policy according to requirement. 
  b. Instead of using being a web sockets I chose long polling, as the logs are not a data
  that need to very real time and users can just request again to get updated logs...

*/
const getLogs = async (req, res) => {
  // The question --> Should I cache all the logs?
  // No, I can just simply paginate the logs tooo...
  const queryParams = req.query;

  // Determine the caching key based on query parameters
  let cacheKey;
  if (Object.keys(queryParams).length === 0) {
    cacheKey = logCacheKey;
  } else cacheKey = generateCacheKey(queryParams);

  // Redis Client quering for key
  redisClient.llen(cacheKey, async (err, cacheLength) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      if (cacheLength > 0) {
        // If cache is not empty, retrieve logs from cache
        redisClient.lrange(cacheKey, 0, -1, (err, reply) => {
          if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
          } else {
            const cachedLogs = reply.map((log) => JSON.parse(log));
            console.log("Logs retrieved from cache");
            res.json(cachedLogs);
          }
        });
      } else {
        // If cache is empty, first populate the data, and then return the cached data
        const result = await fetchLogsFromDatabase(queryParams, cacheKey);
        res.json(result);
      }
    }
  });
};

const fetchLogsFromDatabase = async (queryParams = {}, cacheKey) => {
  try {
    let filter = addTimeStampQuery();

    if (cacheKey === "logs") {
      const logs = await LogModel.find(filter);
      handleLogsResult(logs, cacheKey);
      return logs;
    } else {
      // adding valid database query filters
      filter = createMongoDBFilter(queryParams);

      // adding timestamp querying if it's required
      filter = addTimeStampQuery(queryParams, filter);
      console.log("Filter: ", filter);
      // Perform text search if a search term is provided
      if (queryParams.search) {
        // regular expression to perform on case insensitive comparision
        const regularExpression = new RegExp(queryParams.search, "i");
        const logs = await LogModel.find(
          {
            $or: [
              { level: { $regex: regularExpression } },
              { message: { $regex: regularExpression } },
              { resourceId: { $regex: regularExpression } },
              { traceId: { $regex: regularExpression } },
              { spanId: { $regex: regularExpression } },
              { commit: { $regex: regularExpression } },
            ],
          },
          filter
        );
        handleLogsResult(logs, cacheKey);
        return logs;
      } else {
        const logs = await LogModel.find(filter);
        handleLogsResult(logs, cacheKey);
        return logs;
      }
    }
  } catch (error) {
    console.error("Error fetching logs from the database:", error);
  }
};

module.exports = {
  getLogs,
  ingestLog,
};
