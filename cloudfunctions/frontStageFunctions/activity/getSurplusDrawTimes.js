const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 获取当前用户，当前活动剩余抽奖次数和当前中奖概率
exports.main = async (event, context) => {
  try {
    const data = event.data; // 接收数据
    // 查询参与信息
    const res = await db.collection('participate_user').where({
      activity_id: data.id,
      user_id: data.userId
    }).get();
    console.log('查询参与表', res.data);

    if (res.data.length > 0) {
      const drawTimes = res.data[0].draw_times;
      const surplusDrawTimes = res.data[0].surplus_draw_times;
      let showProbability = 0;
      let probability = 0;
      let certainTimes = -1;
      // 查询活动信息
      const activityInfo = await db.collection('activity').doc(data.id).get();
      console.log('当前活动数据', activityInfo.data);

      // 当前活动展示中奖概率
      const showProbabilityList = activityInfo.data.show_probability;
      const probabilityList = activityInfo.data.probability;
      console.log('当前活动展示中奖概率', showProbabilityList);
      console.log('当前活动计算中奖概率', probabilityList);
      // 当前概率索引，检查之前有没有中奖，中奖的话按最少剩余抽奖次数算当前概率
      const winArr = await db.collection('win_user').where({
        activity_id: data.id,
        user_id: data.userId
      }).get();
      console.log('中奖表', winArr.data);
      let currentDrawIndex = 0;
      if (winArr.data.length > 0) {
        const lastWin = winArr.data.sort((a, b) => {
          return b.win_time - a.win_time;
        })[0];
        currentDrawIndex = lastWin.surplus_draw_times + (drawTimes - lastWin.draw_times) - surplusDrawTimes;
      } else {
        currentDrawIndex = drawTimes - surplusDrawTimes;
      }
      console.log('当前概率索引', currentDrawIndex);
      // 索引超长，从头计算
      if (currentDrawIndex > probabilityList.length - 1) {
        currentDrawIndex = currentDrawIndex - probabilityList.length;
        console.log('超长重新计算概率索引', currentDrawIndex);
      }
      const certainIndex = probabilityList.findIndex(item => item === 100);
      console.log('必中索引', certainIndex);
      if (certainIndex !== -1) {
        if (currentDrawIndex <= certainIndex) {
          certainTimes = certainIndex - currentDrawIndex;
        } else {
          certainTimes = certainIndex + (probabilityList.length - currentDrawIndex) + 1;
        }
      }
      // 当前展示中奖概率
      showProbability = showProbabilityList[currentDrawIndex];
      probability = probabilityList[currentDrawIndex];
      console.log('当前展示中奖概率', showProbability);
      console.log('当前计算中奖概率', probability);

      return {
        success: true,
        data: {
          surplusDrawTimes: surplusDrawTimes,
          showProbability: showProbability,
          certainTimes: certainTimes
        }
      };
    } else {
      return {
        success: false,
        errMsg: '查询失败'
      };
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
}; 