const cloud = require('wx-server-sdk');
const convert = require('../utils/convert');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 根据活动id获取活动详情，带奖品和参与用户
exports.main = async (event, context) => {
  try {
    const data = event.data; // 接收数据
    console.log('根据id获取活动详情', data.id);
    // 查询数据库信息
    const res = await db.collection('activity').doc(data.id).get();
    // 查询奖品列表并插入
    const prizeList = await db.collection('prize').where({
      activity_id: data.id
    }).get();
    res.data.prizeList = prizeList.data;
    // 查询参与用户列表并插入
    const participateUserList = await db.collection('participate_user').aggregate().lookup({
      from: 'user',
      localField: 'user_id',
      foreignField: '_id',
      as: 'infoList'
    }).match({
      activity_id: data.id
    }).end();
    res.data.participateUserList = participateUserList.list.map(item => {
      item.nick_name = item.infoList[0].nick_name;
      item.avatar_url = item.infoList[0].avatar_url;
      delete item.infoList;
      return item;
    });
    const result = convert.Activity(res.data);
    return {
      success: true,
      data: result
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};