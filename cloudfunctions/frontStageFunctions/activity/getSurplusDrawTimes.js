const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 获取当前用户，当前活动剩余抽奖次数
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
      return {
        success: true,
        data: res.data[0].surplus_draw_times
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