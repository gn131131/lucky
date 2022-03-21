const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 参与活动，若已参与过，则更新时间，未参与过新增表数据，并删除围观表数据，同时更新历史记录表
exports.main = async (event, context) => {
  try {
    const data = event.data; // 接收数据
    // 查询参与信息
    const res = await db.collection('participate_user').where({
      activity_id: data.id,
      user_id: data.userId
    }).get();
    console.log('查询参与表', res.data);

    // 查询活动信息
    const activityInfo = await db.collection('activity').doc(data.id).get();
    console.log('查询活动表', activityInfo.data);

    if (res.data.length > 0) {
      console.log('参与过，更新时间');
      // 更新参与表
      await db.collection('participate_user').where({
        activity_id: data.id,
        user_id: data.userId
      }).update({
        data: {
          update_time: new Date().getTime()
        }
      });
      // 更新历史记录表
      await db.collection('history').where({
        activity_id: data.id,
        user_id: data.userId
      }).update({
        data: {
          update_time: new Date().getTime()
        }
      });
    } else {
      const activity = await db.collection('activity').doc(data.id).get();
      console.log('没有参与过', activity.data);
      // 添加参与表
      await db.collection('participate_user').add({
        data: {
          user_id: data.userId,
          activity_id: data.id,
          draw_times: activity.data.draw_times,
          surplus_draw_times: activity.data.draw_times,
          create_time: new Date().getTime(),
          update_time: new Date().getTime()
        }
      });
      // 更新参与人数和围观人数
      await db.collection('activity').doc(data.id).update({
        data: {
          participate_num: activity.data.participate_num + 1,
          watch_num: activity.data.watch_num - 1
        }
      });
      // 删除围观表数据
      await db.collection('watch_user').where({
        user_id: data.userId,
        activity_id: data.id,
      }).remove();
      // 添加历史记录表
      await db.collection('history').add({
        data: {
          user_id: data.userId,
          activity_id: data.id,
          activity_name: activityInfo.data.name,
          create_time: new Date().getTime(),
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