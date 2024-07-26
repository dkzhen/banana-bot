const { default: axios } = require("axios");
const { validateToken } = require("./CheckValidToken");

exports.clickRewards = async () => {
  const USER_API = "https://interface.carv.io/banana/get_user_info";
  try {
    const tokens = await validateToken();

    for (const token of tokens) {
      try {
        const info = await axios.get(USER_API, {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        });
        const max_click = info.data.data.max_click_count;
        let today_click = info.data.data.today_click_count;

        if (today_click >= max_click) {
          console.log(
            "Today click count has reached or exceeded the max click count."
          );
        } else {
          while (today_click < max_click) {
            await axios.post(
              "https://interface.carv.io/banana/do_click",
              {
                clickCount: 1,
              },
              {
                headers: {
                  Authorization: `Bearer ${token.token}`,
                },
              }
            );
            console.log("Taping...");
            today_click++;
            if (today_click == max_click) {
              console.log("Click sudah maksimal.");
              break;
            }
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  } catch (error) {
    console.log("error from validate token");
    console.log(error.message);
  }
};
