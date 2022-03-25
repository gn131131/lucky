const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 更新活动
exports.main = async (event, context) => {
  try {
    const data = event.data; // 接收数据
    console.log('编辑活动', data.id);
    // 查询数据库信息
    await db.collection('activity').doc(data.id).update({
      data: {
        name: data.name,
        active_time_range: data.activeTimeRange,
        draw_times: data.drawTimes,
        activity_code: data.activityCode,
        probability: data.probability,
        publish_status: data.publishStatus,
        status: data.status,
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