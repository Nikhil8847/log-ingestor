`# Log Ingestor and Query Interface

This project is a log ingestor system that efficiently handles vast volumes of log data and provides a simple interface for querying this data using full-text search or specific field filters. The system includes both a log ingestor and a query interface.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Sample Log Data Format](#sample-log-data-format)
- [Requirements](#requirements)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Sample Queries](#sample-queries)
- [Advanced Features](#advanced-features)
- [Contributing](#contributing)
- [License](#license)

## Overview

The log ingestor system allows logs to be ingested over HTTP, on port `3000`, in the specified JSON format. The query interface offers a user-friendly way to search logs based on various parameters.

## Features

- Efficient log ingestion over HTTP.
- User interface for full-text search and specific field filters.
- Scalable to handle high volumes of logs.
- Real-time log ingestion and searching capabilities.

## Sample Log Data Format

```json
{
  "level": "error",
  "message": "Failed to connect to DB",
  "resourceId": "server-1234",
  "timestamp": "2023-09-15T08:00:00Z",
  "traceId": "abc-xyz-123",
  "spanId": "span-456",
  "commit": "5e5342f",
  "metadata": {
    "parentResourceId": "server-0987"
  }
}
```

## Requirements

- Node.js
- MongoDB
- Redis

## System Architecture

Describe the architecture of your system, including components, databases used, and any additional services.

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/your-repository.git
    ```

2.  Install dependencies:

    > Run this command in root folder, and in root/client folder to install all the dependencies

    ```bash
    npm install
    ```

3.  Set up MongoDB and Redis server(I am using **redis cloud**), To do this setup environment variables in **.env** file <br>
    Example .env file

    ```bash
    MONGO_URL=
    PORT=3000 // default always
    REDIS_PORT=
    REDIS_PASSWORD=
    REDIS_HOST=
    ```

4.  Configure the environment variables.

5.  Start the application: <br>
    a. To run the backend run:
    ```bash
    npx nodemon index.js
    ```
    b. To run the front end: go to **client** directly and run command:
    ```bash
    npx nodemon index.js
    ```

## API Endpoints

---

- `POST /logs`: Ingest log.
- `GET /logs`: Query logs.

The codebase handles multiple filters at the same time. example: for full text search **search** query param is added

### List of all the filters

- level
- resource Id
- time Stamp
- span id
- commit
- parent resource id
- search --> for full text search on all the above fields (except timestamp)

Provide additional details on each endpoint, including request/response formats.

## Sample Queries

- Find all logs with the level set to "error".
- Search for logs with the message containing the term "Failed to connect".
- Retrieve all logs related to resourceId "server-1234".
- Filter logs between the timestamp "2023-09-10T00:00:00Z" and "2023-09-15T23:59:59Z".

# System Improvement and Scalability Considerations

As we strive to enhance the efficiency and scalability of our log ingestor and query interface system, it's crucial to address several key aspects. Below are identified problems along with recommended improvements:

## 1\. Caching Stretagy

Problem: We can cache this sytem at various levels to improve the performance significantly. We can also use technique like **Write Back Cache** to increase the responsiveness of the system

What I did? I have used Redis to cache the data in memory on server with a recaching period of 2 minutes. I am also using a hashing to generate a **hash key** to generate a **caching key** for the Redis (To avoid redundancies I sorted the filters which make sure the reordering the query params doesn't give me new hash for the same database results).

Improvement: Consider Redis clustering or partitioning to distribute the cache across multiple nodes. Adjust cache eviction policies to align with access patterns for improved efficiency.

## 2\. Pagination for Query Results:

Problem: Fetching all logs in a single request may lead to performance issues, especially as log volumes grow.

Improvement: Implement pagination in the API to retrieve logs in smaller, manageable chunks. This reduces the load on both the server and client, ensuring smoother performance.

## 3\. Horizontal Scaling

Problem: As this solution is running on a single machine the incoming requests will be overloaded to a single instance.

Improvement: Multiple set of machines/instances can be used to run this solution and can be load balanced using different algorithm (as per requirements) to efficiently scale this horizontally.
I also would like to mention that **read replicas** can also integrated in the system in case there is need to make the system read heavy.

## 4\. Real-time Log Ingestion Challenges:

Problem: Achieving true real-time log ingestion can be challenging, especially with high data volumes.

What I did? I simply used long polling instead of web sockets or SSE to update the users with updated logs. I am using the concept of **long polling** to efficiently utilize whatever resources I have.
(The cache has a TTL of 2 minutes and will be updated every 2 minutes by a worker)

Improvement: Explore technologies like Apache Kafka for real-time data streaming. Implement a message queue system to decouple log producers from the ingestor for better scalability.
