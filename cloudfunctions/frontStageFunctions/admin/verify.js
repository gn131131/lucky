const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 验证管理员
exports.main = async (event, context) => {
  try {
    const data = event.data; // 接收数据
    // 获取基础信息
    const wxContext = cloud.getWXContext();
    // 查找当前用户是否在管理员表
    const res = await db.collection('admin').where({
      open_id: wxContext.OPENID,
      password: data.password
    }).get();
    console.log('FindAdmin', res.data);
    return {
      success: true,
      data: res.data.length > 0 ? true : false
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};