const { default: axios } = require("axios");
const { validateToken } = require("./CheckValidToken");

exports.claimLotery = async () => {
  const USER_API = "https://interface.carv.io/banana/get_lottery_info";
  try {
    const tokens = await validateToken();

    for (const token of tokens) {
      try {
        const info = await axios.get(USER_API, {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        });
        const remainLotery = info.data.data.remain_lottery_count;
        if (remainLotery > 0) {
          for (let i = 0; i < remainLotery; i++) {
            await axios.post(
              "https://interface.carv.io/banana/do_lottery",
              {},
              {
                headers: {
                  Authorization: `Bearer ${token.token}`,
                },
              }
            );
            console.log("lottery claimed successfully");
          }
        } else {
          console.log("no lottery left");
        }
        const count = info.data.data.countdown_end;
        if (count) {
          await axios.post(
            "https://interface.carv.io/banana/claim_lottery",
            {
              claimLotteryType: 1,
            },
            {
              headers: {
                Authorization: `Bearer ${token.token}`,
              },
            }
          );
          console.log("farming claimed successfully");
        } else {
          console.log("farming claim countdown");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
