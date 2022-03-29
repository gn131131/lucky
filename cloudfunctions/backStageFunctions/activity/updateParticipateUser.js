const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 更新参与用户抽奖次数
exports.main = async (event, context) => {
  try {
    const data = event.data; // 接收数据
    console.log('更新参与用户抽奖次数', data.id);
    // 查询数据库信息
    await db.collection('participate_user').doc(data.id).update({
      data: {
        draw_times: data.drawTimes,
        surplus_draw_times: data.surplusDrawTimes,
        update_time: new Date().getTime()
      }
    });
    return {
      success: true,
      data: true
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};