const redis = require("redis");
require("dotenv").config();

console.log(process.env.REDIS_PORT);
const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  // },
});

client.on("connect", () => {
  console.log("redis Connected!");
});

client.on("ready", () => {
  console.log("redis is ready to use!");
});

// Log any error that may occur to the console
client.on("error", (err) => {
  console.log(`Error: ${err}`);
});

client.on("end", (err) => {
  console.log(`Client disconnected from redis`);
});

client.del("logs", (err, response) => {
  if (err) throw err;
  console.log(response);
});
process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
