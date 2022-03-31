const cloud = require('wx-server-sdk');
const convert = require('../utils/convert');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 分页查询当前人中奖记录
exports.main = async (event, context) => {
  try {
    const data = event.data; // 接收数据
    const pageSize = data.page.pageSize;
    const pageNum = data.page.pageNum; // 分页数据
    console.log('分页获取中奖列表');
    const countResult = await db.collection('win_user').count();
    const total = countResult.total;
    const matchParams = {};
    if (data.userId) {
      matchParams.user_id = data.userId;
    }
    // 查询数据库信息
    const res = await db.collection('win_user').aggregate()
    .match(matchParams)
    .sort({
      update_time: -1
    })
    .lookup({
      from: 'user',
      localField: 'user_id',
      foreignField: '_id',
      as: 'userList'
    })
    .skip(pageSize * (pageNum - 1)).limit(pageSize).end();
    console.log('查询结果', res.data);

    return {
      success: true,
      data: {records: res.list.map(item => {
        const result = convert.WinUser(item);
        if (result.userList[0].nickName.length <= 5) {
          result.userName = result.userList[0].nickName.substr(0, 1) + '***';
        } else {
          result.userName = result.userList[0].nickName.substr(0, 2) + '***' + result.userList[0].nickName.substr(-2);
        }
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