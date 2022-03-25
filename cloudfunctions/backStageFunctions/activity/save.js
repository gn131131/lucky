const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 保存活动
exports.main = async (event, context) => {
  try {
    const data = event.data; // 接收数据
    console.log('新增活动');
    const prizeList = data.prizeList;
    // 保存活动表
    const activity = await db.collection('activity').add({
      data: {
        name: data.name,
        participate_num: data.participateNum || 0,
        win_num: data.winNum || 0,
        watch_num: data.watchNum || 0,
        active_time_range: data.activeTimeRange,
        draw_times: data.drawTimes,
        activity_code: data.activityCode,
        probability: data.probability,
        show_probability: data.showProbability,
        publish_status: data.publishStatus,
        status: data.status,
        create_time: new Date().getTime(),
        update_time: new Date().getTime()
      }
    });
    console.log('新增活动成功', activity);
    // 保存奖品表
    const tasks = [];
    prizeList.forEach(item => {
      const promise = db.collection('prize').add({
        data: {
          activity_id: activity._id,
          name: item,
          create_time: new Date().getTime(),
          update_time: new Date().getTime()
        }
      });
      tasks.push(promise);
    });
    const prize = await Promise.all(tasks);
    console.log('新增礼物成功', prize);
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