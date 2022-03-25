const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 根据id删除活动
exports.main = async (event, context) => {
  try {
    const data = event.data; // 接收数据
    console.log('删除活动', data.id);
    const result = await db.collection('activity').doc(data.id).remove();
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