const cron = require("node-cron");
const express = require("express");
const { claimLotery } = require("./func/claimLotery");
const { clickRewards } = require("./func/click");
const { configDotenv } = require("dotenv");
const { claimMission } = require("./func/claimMission");
configDotenv();

// Schedule the task to run every hour on the hour
claimLotery();
clickRewards();
claimMission();
cron.schedule("0 * * * *", claimLotery);
cron.schedule("0 * * * *", clickRewards);
cron.schedule("0 * * * *", claimMission);

// Start the server
const port = process.env.PORT || 105;
const app = express();

app.get("/", (req, res) => {
  res.send("API cron job server is running");
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
