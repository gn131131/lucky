const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 前端请求活动id, 用户id, 后端确定是否中奖以及奖品id，概率个数设置，抽奖按概率设定走，若中奖则清空概率
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

        // 当前活动中奖概率
        let probabilityList = activityInfo.data.probability;
        // 当前概率索引，检查之前有没有中奖，中奖的话按最少剩余抽奖次数算当前概率
        const winArr = await db.collection('win_user').where({
          activity_id: data.id,
          user_id: data.userId
        }).get();
        let currentDrawIndex = 0;
        if (winArr.data.length > 0) {
          const lastWinSurplusDrawTimes = winArr.data.sort((a, b) => {
            return a.surplus_draw_times - b.surplus_draw_times;
          })[0].surplus_draw_times;
          currentDrawIndex = lastWinSurplusDrawTimes - participateUserInfo.data[0].surplus_draw_times;
        } else {
          currentDrawIndex = participateUserInfo.data[0].draw_times - participateUserInfo.data[0].surplus_draw_times;
        }
        // 索引超长，从头计算
        if (currentDrawIndex > probabilityList.length - 1) {
          currentDrawIndex = currentDrawIndex - probabilityList.length;
        }
        // 当前抽奖概率
        const currentProbability = probabilityList[currentDrawIndex];
        // 随机数
        const randomNum = Math.ceil(Math.random() * 100);
        console.log('当前抽奖', probabilityList, currentDrawIndex, currentProbability, randomNum);
        
        // 先减掉抽奖次数
        await db.collection('participate_user').where({
          user_id: data.userId,
          activity_id: data.id
        }).update({
          data: {
            surplus_draw_times: participateUserInfo.data[0].surplus_draw_times - 1
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
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};