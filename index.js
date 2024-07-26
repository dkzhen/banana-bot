const cron = require("node-cron");
const express = require("express");
const { claimLotery } = require("./func/claimLotery");
const { clickRewards } = require("./func/click");

// Schedule the task to run every hour on the hour
claimLotery();
clickRewards();

cron.schedule("0 * * * *", claimLotery);
cron.schedule("0 * * * *", clickRewards);

// Start the server
const port = process.env.PORT || 105;
const app = express();

app.get("/", (req, res) => {
  res.send("API cron job server is running");
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
