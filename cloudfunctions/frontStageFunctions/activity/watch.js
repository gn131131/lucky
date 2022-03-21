const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 围观活动，若已参与过，则更新时间，未参与过新增表数据
exports.main = async (event, context) => {
  try {
    const data = event.data; // 接收数据
    // 查询数据库信息
    const res = await db.collection('watch_user').where({
      activity_id: data.id,
      user_id: data.userId
    }).get();
    console.log('查询围观表', res.data);
    if (res.data.length > 0) {
      console.log('围观过，更新时间');
      await db.collection('watch_user').where({
        activity_id: data.id,
        user_id: data.userId
      }).update({
        data: {
          update_time: new Date().getTime()
        }
      });
    } else {
      const activity = await db.collection('activity').doc(data.id).get();
      console.log('没有围观过', activity.data);
      await db.collection('watch_user').add({
        data: {
          user_id: data.userId,
          activity_id: data.id,
          create_time: new Date().getTime(),
          update_time: new Date().getTime()
        }
      });
      await db.collection('activity').doc(data.id).update({
        data: {
          watch_num: activity.data.watch_num + 1
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