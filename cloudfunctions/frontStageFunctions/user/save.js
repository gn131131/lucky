const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 修改数据库信息云函数入口函数
exports.main = async (event, context) => {
  try {
    // 获取基础信息
    const wxContext = cloud.getWXContext();
    // 存用户
    console.log('enter params', event);
    // 查找当前用户是否在用户表中
    const res = await db.collection('user').where({
      open_id: wxContext.OPENID
    }).get();
    const data = event.data; // 接收数据
    if (res.data.length > 0) {
      console.log('更新用户');
      await db.collection('user').where({open_id: wxContext.OPENID}).update({
        data: {
          nick_name: data.nickName,
          avatar_url: data.avatarUrl,
          update_time: new Date().getTime()
        }
      });
      return {
        success: true,
        data: true
      };
    } else {
      console.log('保存用户');
      const userInfo = await db.collection('user').add({
        data: {
          open_id: wxContext.OPENID,
          nick_name: data.nickName,
          avatar_url: data.avatarUrl,
          create_time: new Date().getTime(),
          update_time: new Date().getTime()
        }
      });
      return {
        success: true,
        data: userInfo._id
      };
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};