const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 前端请求活动id, 用户id, 后端确定是否中奖以及奖品id
exports.main = async (event, context) => {
  try {
    const data = event.data; // 接收数据
    console.log('开始抽奖', data.id, data.userId);

    // 查询当前参与用户数据
    const participateUserInfo = await db.collection('participate_user').where({
      user_id: data.userId,
      activity_id: data.id
    }).get();
    console.log('当前参与用户数据', participateUserInfo.data);

    // 查询活动信息
    const activityInfo = await db.collection('activity').doc(data.id).get();
    console.log('当前活动数据', activityInfo.data);

    if (participateUserInfo.data.length > 0) {
      if (participateUserInfo.data[0].surplus_draw_times > 0) {

        // 当前活动抽奖概率
        const probabilityList = JSON.parse(activityInfo.data.probability || '[]');
        // 当前抽取次数
        const currentDrawIndex = participateUserInfo.data[0].draw_times - participateUserInfo.data[0].surplus_draw_times;
        // 当前抽奖概率
        const currentProbability = probabilityList[currentDrawIndex];
        // 随机数
        const randomNum = Math.ceil(Math.random() * 100);
        console.log('当前抽奖', probabilityList, currentDrawIndex, currentProbability, randomNum);
        
        // 先减掉抽奖次数，只能中一次奖，中奖了即刻清空抽奖次数
        await db.collection('participate_user').where({
          user_id: data.userId,
          activity_id: data.id
        }).update({
          data: {
            surplus_draw_times: randomNum <= currentProbability ? 0 : (participateUserInfo.data[0].surplus_draw_times - 1)
          }
        });
        
        if (randomNum <= currentProbability) {
          console.log('中奖');
          // 查询奖品表
          const prizeList = await db.collection('prize').where({
            activity_id: data.id
          }).get();
          const prizeRandomIndex = Math.floor((Math.random()*prizeList.data.length));
          console.log('抽取奖品', prizeList, prizeRandomIndex);

          // 保存中奖表
          await db.collection('win_user').add({
            data: {
              user_id: data.userId,
              activity_id: data.id,
              activity_name: activityInfo.data.name,
              prize_id: prizeList.data[prizeRandomIndex]._id,
              prize_name: prizeList.data[prizeRandomIndex].name,
              draw_times: participateUserInfo.data[0].draw_times,
              surplus_draw_times: participateUserInfo.data[0].surplus_draw_times - 1,
              win_time: new Date().getTime()
            }
          });

          // 更新中奖人数
          await db.collection('activity').doc(data.id).update({
            data: {
              win_num: activityInfo.data.win_num + 1
            }
          });

          return {
            success: true,
            data: prizeList.data[prizeRandomIndex]._id
          }
        } else {
          console.log('未中奖');
          return {
            success: true,
            data: false
          }
        };
      } else {
        return {
          success: false,
          errMsg: '您已无抽奖次数'
        };
      }
    } else {
      // 一般不会出现此情况
      return {
        success: false,
        errMsg: '当前用户未参与此活动'
      };
    }
    return {
      success: true,
      data: []
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};