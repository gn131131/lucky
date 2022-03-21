const cloud = require('wx-server-sdk');
const convert = require('../utils/convert');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询当前人历史记录
exports.main = async (event, context) => {
  try {
    const data = event.data; // 接收数据
    const pageSize = data.page.pageSize;
    const pageNum = data.page.pageNum; // 分页数据
    console.log('分页获取历史记录列表', data);
    const countResult = await db.collection('history').count();
    const total = countResult.total;
    // 查询数据库信息
    const res = await db.collection('history').where({
      user_id: data.userId
    }).skip(pageSize * (pageNum - 1)).limit(pageSize).get();
    console.log('查询结果', res.data);

    return {
      success: true,
      data: {records: res.data.map(item => convert.History(item)), page: {pageSize: pageSize, pageNum: pageNum, total: total}}
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};