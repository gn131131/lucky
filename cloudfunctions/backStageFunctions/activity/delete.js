const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 批量删除活动
exports.main = async (event, context) => {
  try {
    const delIds = event.data.delIds; // 接收数据
    console.log('删除活动', delIds);
    const tasks = [];
    delIds.forEach(id => {
      const promise = db.collection('activity').doc(id).remove();
      tasks.push(promise);
    });
    const result = await Promise.all(tasks);
    console.log('删除结果', result);
    return {
      success: true,
      data: true
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};