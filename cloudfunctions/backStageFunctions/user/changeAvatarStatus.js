const cloud = require('wx-server-sdk');
const convert = require('../utils/convert');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 修改头像状态
exports.main = async (event, context) => {
  try {
    const data = event.data; // 接收数据
    const id = data.id;
    const hideAvatar = data.hideAvatar; // 分页数据
    console.log('用户信息');
    await db.collection('user').doc(id).update({
      data: {
        hide_avatar: hideAvatar,
        update_time: new Date().getTime()
      }
    });
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