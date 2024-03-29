const cloud = require('wx-server-sdk');
const convert = require('../utils/convert');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 分页查询所有中奖记录
exports.main = async (event, context) => {
  try {
    const data = event.data; // 接收数据
    const userId = data.userId;
    const pageSize = data.page.pageSize;
    const pageNum = data.page.pageNum; // 分页数据
    console.log('分页获取中奖列表');
    const countResult = await db.collection('win_user').count();
    const total = countResult.total;
    const matchParams = {
      user_id: userId
    };
    console.log('匹配参数', matchParams);
    // 查询数据库信息
    const res = await db.collection('win_user').aggregate()
    .sort({
      win_time: -1
    })
    .match(matchParams)
    .lookup({
      from: 'user',
      localField: 'user_id',
      foreignField: '_id',
      as: 'userList'
    }).skip(pageSize * (pageNum - 1)).limit(pageSize).end();
    console.log('查询结果', res.list);

    return {
      success: true,
      data: {records: res.list.map(item => {
        const result = convert.WinUser(item);
        result.userName = result.userList[0].nickName;
        delete result.userList;
        return result;
      }), page: {pageSize: pageSize, pageNum: pageNum, total: total}}
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};