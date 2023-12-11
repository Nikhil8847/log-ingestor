const express = require("express");

const router = express.Router();
const { getLogs, ingestLog } = require("../controllers/logController");
router.route("/").get(getLogs).post(ingestLog);

module.exports = router;
