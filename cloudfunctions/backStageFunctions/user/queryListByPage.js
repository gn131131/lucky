const cloud = require('wx-server-sdk');
const convert = require('../utils/convert');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 获取已注册的用户列表
exports.main = async (event, context) => {
  try {
    const data = event.data; // 接收数据
    const pageSize = data.page.pageSize;
    const pageNum = data.page.pageNum; // 分页数据
    console.log('分页获取用户列表');
    const countResult = await db.collection('user').count();
    const total = countResult.total;
    // 查询数据库信息
    const res = await db.collection('user').skip(pageSize * (pageNum - 1)).limit(pageSize).get();
    return {
      success: true,
      data: {records: convert.User(res.data), page: {pageSize: pageSize, pageNum: pageNum, total: total}}
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};