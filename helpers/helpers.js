const moment = require("moment");
const invalidDatabaseQueryFilter = ["search", "start", "end", "page_size"];
const acceptedFields = [
  "level",
  "message",
  "resourceId",
  "timestamp",
  "traceId",
  "spanId",
  "commit",
  "start",
  "end",
  "search",
  "metadata.parentResourceId",
];

const addTimeStampQuery = (queryParams = {}, filter = {}) => {
  if (queryParams.start && queryParams.end) {
    console.log(queryParams.start, queryParams.end);
    filter.timestamp = {
      $gte: new Date(queryParams.start).getTime(),
      $lte: new Date(queryParams.end).getTime(),
    };
  }
  return filter;
};

const saveLogToDatabase = (log) => {
  log
    .save()
    .then(() => console.log("Log saved to the database:", log))
    .catch((error) =>
      console.error("Error saving log to the database:", error)
    );
};

// Create a MongoDB filter object based on query parameters
const createMongoDBFilter = (queryParams) => {
  const filter = {};

  if (queryParams) {
    for (const key in queryParams) {
      // Exclude 'search' parameter, as it is handled separately
      if (!invalidDatabaseQueryFilter.includes(key)) {
        filter[key] = queryParams[key];
      }
    }
  }

  return filter;
};

// Generating the cacheKey for the possible filters in a sorted manner
const generateCacheKey = (queryParams) => {
  // Filter and sort the query parameters based on accepted fields
  const sortedParams = Object.entries(queryParams)
    .filter(([key]) => {
      if (key == "start" || key == "end") {
        return false;
      }
      return acceptedFields.includes(key);
    })
    .sort(([a], [b]) => acceptedFields.indexOf(a) - acceptedFields.indexOf(b))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  console.log(sortedParams);
  // Convert the sorted parameters into a string to create a unique cache key
  return JSON.stringify(sortedParams);
};

module.exports = {
  addTimeStampQuery,
  createMongoDBFilter,
  saveLogToDatabase,
  generateCacheKey,
};
