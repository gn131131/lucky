const cloud = require('wx-server-sdk');
const convert = require('../utils/convert');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 获取模板列表
exports.main = async (event, context) => {
  try {
    console.log('获取模板列表');
    // 查询数据库信息
    const res = await db.collection('template').get();
    return {
      success: true,
      data: res.data.map(item => convert.Template(item))
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};