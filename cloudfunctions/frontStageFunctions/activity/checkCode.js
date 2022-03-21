const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 验证活动码
exports.main = async (event, context) => {
  try {
    const data = event.data; // 接收数据
    console.log('验证活动code', data.id, data.code);
    // 查询数据库信息
    const res = await db.collection('activity').doc(data.id).get();
    return {
      success: true,
      data: res.data && res.data.activity_code === data.code ? true : false
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};