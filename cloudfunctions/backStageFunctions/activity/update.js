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
        draw_times: data.drawTimes,
        activity_code: data.activityCode,
        probability: data.probability,
        show_probability: data.showProbability,
        publish_status: data.publishStatus,
        status: data.status,
        update_time: new Date().getTime()
      }
    });
    // 更新奖品表，暂时只更新一个
    console.log('奖品', data.prizeList);
    if (data.prizeList.length > 0) {
      console.log('奖品id', data.prizeList[0].id)
      await db.collection('prize').doc(data.prizeList[0].id).update({
        data: {
          name: data.prizeList[0].name,
          update_time: new Date().getTime()
        }
      });
    }
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