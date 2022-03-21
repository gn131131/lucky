const cloud = require('wx-server-sdk');
const convert = require('../utils/convert');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 获取当前用户信息
exports.main = async (event, context) => {
  console.log('getUserInfo', event)
  try {
    // 获取基础信息
    const wxContext = cloud.getWXContext();
    // 查找当前用户是否在用户表中
    const res = await db.collection('user').where({
      open_id: wxContext.OPENID
    }).get();
    console.log('获取当前用户信息', res.data);
    return {
      success: true,
      data: convert.User(res.data[0])
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};