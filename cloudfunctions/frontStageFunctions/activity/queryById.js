const cloud = require('wx-server-sdk');
const convert = require('../utils/convert');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 根据id获取活动详情
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
    console.log('查询活动详情', res.data);

    const participateUserList = await db.collection('participate_user').aggregate().match({
      activity_id: data.id
    }).lookup({
      from: 'user',
      localField: 'user_id',
      foreignField: '_id',
      as: 'infoList'
    }).end();
    res.data.participateUserList = participateUserList.list.map(item => {
      item.nick_name = item.infoList[0].nick_name;
      item.avatar_url = item.infoList[0].avatar_url;
      delete item.infoList;
      return item;
    });

    const result = convert.Activity(res.data);
    delete result.probability;
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