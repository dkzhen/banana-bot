const axios = require("axios");
const { configDotenv } = require("dotenv");
const fs = require("fs").promises;
configDotenv();

exports.getTokens = async () => {
  try {
    const data = await fs.readFile("configs/config.json", "utf-8");
    const tokens = JSON.parse(data);
    tokens.map((item, index) => {
      console.log(`\n[ Token ${index + 1} ] : ${item.token}`);
    });
    console.log(`[ Total tokens ] : ${tokens.length}`);

    return tokens;
  } catch (error) {
    console.log(
      `[ Error ] : Token not found, please add token on configs/config.json`
    );
    return null;
  }
};
