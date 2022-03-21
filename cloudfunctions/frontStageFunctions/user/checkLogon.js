const cloud = require('wx-server-sdk');
const convert = require('../utils/convert');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询用户是否注册
exports.main = async (event, context) => {
  console.log('checklogin', event)
  try {
    // 获取基础信息
    const wxContext = cloud.getWXContext();
    // 查找当前用户是否在用户表中
    const res = await db.collection('user').where({
      open_id: wxContext.OPENID
    }).get();
    console.log('FindUser', res.data);
    return {
      success: true,
      data: res.data.length > 0 ? convert.User(res.data[0]) : false
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};