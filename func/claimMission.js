const { default: axios } = require("axios");
const { validateToken } = require("./CheckValidToken");

exports.claimMission = async () => {
  const USER_API = "https://interface.carv.io/banana/get_quest_list";
  try {
    const tokens = await validateToken();

    for (const token of tokens) {
      try {
        const info = await axios.get(USER_API, {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        });
        const missionList = info.data.data.quest_list.filter(
          (item) => item.quest_id !== 10
        );
        const missionNotClaimed = missionList.filter(
          (item) => item.is_claimed === false
        );
        const missionNotCompleted = missionList.filter(
          (item) => item.is_achieved === false
        );

        if (missionNotCompleted.length > 0) {
          for (const mission of missionNotCompleted) {
            await axios.post(
              "https://interface.carv.io/banana/achieve_quest",
              {
                quest_id: mission.quest_id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token.token}`,
                },
              }
            );
            console.log(
              `[ Running ] : mission ${mission.quest_name} completed successfully`
            );
          }
        } else {
          console.log(`[ Completed ] : No mission left`);
        }
        if (missionNotClaimed.length > 0) {
          for (const mission of missionNotClaimed) {
            await axios.post(
              "https://interface.carv.io/banana/claim_quest",
              {
                quest_id: mission.quest_id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token.token}`,
                },
              }
            );
            console.log(
              `[ Running ] : mission ${mission.quest_name} claimed successfully`
            );
          }
        } else {
          console.log(`[ Completed ] : No need claim mission left`);
          const claimLottery = await axios.post(
            "https://interface.carv.io/banana/claim_quest_lottery",
            {},
            {
              headers: {
                Authorization: `Bearer ${token.token}`,
              },
            }
          );
          if (claimLottery.data.code !== 4404) {
            console.log(`[ Running ] : lottery claimed successfully`);
          } else {
            console.log(`[ Completed ] : No quest lottery left`);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
