const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors"); // Import the cors package
require('dotenv').config()

app.use(cors());

const candidates = require("./controllers/Candidates");
const adds = require("./controllers/adds");
const votes = require("./controllers/vote");
const citys = require("./controllers/citys");
const history = require("./controllers/historydata");


app.use("/api/candidate", candidates);
app.use("/api/adds", adds);
app.use("/api/votes", votes);
app.use("/api/city", citys);
app.use("/api/history", history);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}).keepAliveTimeout = 61 * 1000

const cron = require("node-cron");

cron.schedule("8 14 * * *", () => {
  console.log("Task executed at 6:00 AM.");
});
